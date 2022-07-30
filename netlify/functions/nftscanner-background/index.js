// For local development
require('dotenv').config();

const { eachMinuteOfInterval, getTime } = require('date-fns');
const groupBy = require('lodash.groupby');

const { getNftMetadata } = require('./nftMetadata');
const { getFile, updateMultipleFiles } = require('./githubApi');
const { getTransactions } = require('./theGraphApi');

const WEEK_THRESHOLD = Date.now() - 3600 * 24 * 1 * 1000;
const DAY_THRESHOLD = Date.now() - 3600 * 24 * 1000;

const FILENAMES = {
  transactions: 'src/data/transactions.json',
  weekly: 'src/data/weekly.json',
  daily: 'src/data/daily.json',
  nfts: 'src/data/nfts.json',
  metadata: 'src/data/metadata.json',
};

// only displayed in the "Transactions" table
const LAST_TRANSACTIONS_LIMIT = 1000;

const parseTransaction = input => {
  const priceCoeff = Math.pow(10, input.token.decimals);
  return {
    id: input.id,
    iid: input.internalID,
    explorerNftId: input.nfts[0].id,
    nftId: input.nfts[0].nftID,
    buyer: input.accountBuyer.address,
    seller: input.accountSeller.address,
    ts: input.block.timestamp * 1000, // multiply by 1000 to work with JS millisecond timestamps
    price: parseInt(input.realizedNFTPrice) / priceCoeff,
    symbol: input.token.symbol,
    fee: (parseInt(input.feeBuyer) / priceCoeff) + (parseInt(input.feeSeller) / priceCoeff),
    token: input.nfts[0].token,
    
  };
};

const bucketMerger = (current, old) => {
  const sum = current.reduce((a, b) => a + b.price, 0);
  const fees = current.reduce((a, b) => a + b.fee, 0);
  const newData = [
    current.length,
    sum / current.length,
    sum,
    fees,
  ];

  if (!old) {
    return newData;
  }

  const [oldTrades, _, oldSum, oldFees] = old;
  const [newTrades, __, newSum, newFees] = newData;

  return [
    oldTrades + newTrades,
    oldSum / oldTrades + newSum / newTrades,
    oldSum + newSum,
    oldFees + newFees,
  ];
};

/**
 * Removes timestamp keys and only keeps the values.
 * {
 *   "timestamp1": [0, 0, 0],
 *   "timestamp2": [1, 1, 1]
 * }
 * =>
 * [[0, 0, 0], [1, 1, 1]]
 */
const bucketValues = buckets => {
  return Object.values(buckets).reduce((acc, current) => {
    return [...acc, current];
  }, []);
};

const resampleTransactions = (transactions, existingValues, options) => {
  const {
    minutes,
    threshold,
    idProperty = 'id',
    timestampProperty = 'ts',
  } = options;
  const rangeTransactions = transactions.filter(t => t[timestampProperty] > threshold);

  const coeff = 60 * minutes * 1000;

  const samples = eachMinuteOfInterval({
    start: Math.floor(threshold / coeff) * coeff,
    end: Math.ceil(Date.now() / coeff) * coeff
  }, { step: minutes })
    .map(date => getTime(date));
  
  const groupedByTime = groupBy(rangeTransactions, t => {
    for (let i = samples.length - 1; i >= 0; i--) {
      const timestamp = samples[i];

      if (t.ts > timestamp) {
        return timestamp;
      }
    }
  });

  const values = existingValues ?? {};

  // delete entries in the existing object older than the time threshold
  for (const [valueId, buckets] of Object.entries(values)) {
    for (const bucket of Object.keys(buckets)) {
      if (parseInt(bucket) < threshold) {
        delete buckets[bucket];
      }
    }

    if (Object.keys(buckets).length === 0) {
      delete values[valueId];
    }
  }

  const valuesInRange = Array.from(new Set(rangeTransactions.map(t => t[idProperty])));

  for (const valueId of valuesInRange) {
    values[valueId] = samples.reduce((accumulator, bucketTime) => {
      const timeString = bucketTime.toString();
      const bucketTransactions = (groupedByTime[timeString] || []).filter(t => t[idProperty] === valueId);
      
      if (!bucketTransactions.length) {
        // if there are no new transactions but there have been older ones, re-add them here
        if (values.hasOwnProperty(valueId) && values[valueId].hasOwnProperty(timeString)) {
          return {
            ...accumulator,
            [timeString]: values[valueId][timeString],
          }
        }

        // otherwise just skip this timestamp
        return accumulator;
      }

      return {
        ...accumulator,
        [timeString]: bucketMerger(
          bucketTransactions,
          values[valueId]?.[timeString]
        )
      };
    }, {});
  }

  return { samples, data: values };
}

/**
 * #########################
 * ## NETLIFY ENTRY POINT ##
 * #########################
 */
exports.handler = async () => {
  const [lastTransactionsFile, weeklyFile, dailyFile, nftsFile] = await Promise.all([
    getFile(FILENAMES.transactions),
    getFile(FILENAMES.weekly),
    getFile(FILENAMES.daily),
    getFile(FILENAMES.nfts),
  ]);

  let lastTransactions = JSON.parse(lastTransactionsFile.content);
  let weekly = JSON.parse(weeklyFile.content);
  let daily = JSON.parse(dailyFile.content);
  let nfts = JSON.parse(nftsFile.content);

  const lastRecordedTransactionId = weekly.lastTransaction;

  const transactionsToResample = [];
  let startFromId = undefined;
  while (true) {
    console.log('[INFO] Querying The Graph for 1000 TradeNFT transactions starting from: ', startFromId ?? 'latest transactions');
    const trx = await getTransactions(1000, startFromId);

    // record the last transaction from where we continue in the next iteration
    startFromId = trx[trx.length - 1].internalID;

    let foundExit = false;
    for (const transaction of trx) {
      const parsed = parseTransaction(transaction);

      if (parsed.iid === lastRecordedTransactionId) {
        // found the previous exit point - break and stop querying graph
        console.log(`[INFO] Reached transaction ID from the last scan, no more transactions to be processed: ${parsed.iid}`);
        foundExit = true;
        break;
      }

      if (parsed.ts < WEEK_THRESHOLD) {
        // that's too many - exit since we don't display data further than this anyway
        console.log(`[INFO] Latest transaction ID not reached within time range limit (or was not provided), no more transactions to be processed: ${lastRecordedTransactionId}`);
        foundExit = true;
        break;
      }

      if (!lastTransactions.find(t => t.iid === parsed.iid)) {
        // The client doesn't need everything. Only pass what's needed to save bandwidth.
        const { iid, id, nftId, buyer, seller, ts, price, fee } = parsed;
        lastTransactions.push({ iid, id, nftId, buyer, seller, ts, price, fee });
      }

      if (!nfts.hasOwnProperty(parsed.nftId)) {
        // the Loopring Explorer ID is longer and contains some additional data, but it's also composed of the token and nftId.
        // We can replace those to save bytes in the nft file.
        const explorerId = parsed.explorerNftId
          .replace(parsed.token, '{t}')
          .replace(parsed.nftId, '{n}');

        // initialize the new NFT - metadata will be added to it later
        nfts[parsed.nftId] = {
          eId: explorerId,
          token: parsed.token,
        }
      } 
      
      if (!transactionsToResample.find(t => t.nftId === parsed.nftId)) {
        // NFT's sale price was not updated yet in this scan. The first transaction with the NFT id  is also its latest transaction,
        // meaning its price is the last price.
        nfts[parsed.nftId].lastPrice = parsed.price;
      }

      transactionsToResample.push(parsed);
    }

    if (foundExit) {
      console.log(`[INFO] Transaction lookup completed. Parsing ${transactionsToResample.length} transactions...`);
      break;
    }
  }

  if (transactionsToResample.length === 0) {
    console.info('[INFO] No new transactions to process. Closing.');
    process.exit(0);
  }
  lastTransactions = lastTransactions
    .sort((a, b) => b.ts - a.ts)
    .slice(0, LAST_TRANSACTIONS_LIMIT);
  
  const { samples: dailySamples, data: dailyNftBuckets } = resampleTransactions(transactionsToResample, daily.nfts, {
    threshold: DAY_THRESHOLD,
    minutes: 30,
    idProperty: 'nftId',
  });

  const { data: dailyTokenBuckets } = resampleTransactions(transactionsToResample, daily.tokens, {
    threshold: DAY_THRESHOLD,
    minutes: 30,
    idProperty: 'token',
  });

  const { samples: weeklySamples, data: weeklyNftBuckets } = resampleTransactions(transactionsToResample, weekly.nfts, {
    threshold: WEEK_THRESHOLD,
    minutes: 60,
    idProperty: 'nftId',
  });

  const { data: weeklyTokenBuckets } = resampleTransactions(transactionsToResample, weekly.tokens, {
    threshold: WEEK_THRESHOLD,
    minutes: 60,
    idProperty: 'token'
  });

  console.log(`[INFO] All transactions parsed.`);

  daily.labels = dailySamples;
  daily.nfts = dailyNftBuckets;
  daily.tokens = dailyTokenBuckets;
  daily.lastTransaction = transactionsToResample[0].iid;

  weekly.labels = weeklySamples;
  weekly.nfts = weeklyNftBuckets;
  weekly.tokens = weeklyTokenBuckets;
  weekly.lastTransaction = transactionsToResample[0].iid;

  let dailyVolume = 0;
  let dailyTrades = 0;
  for (const buckets of Object.values(dailyNftBuckets)) {
    for (const bucket of bucketValues(buckets)) {
      const [trades, _, sum] = bucket;
      dailyVolume += sum;
      dailyTrades += trades;
    }
  }

  console.log(`[INFO] Calculated 24h volume: ${dailyVolume} ETH, 24h trades: ${dailyTrades}`);

  const weeklyPopularNfts = Object.keys(weeklyNftBuckets).filter(key => {
    if (lastTransactions.find(tx => tx.nftId === key)) {
      // we need all nfts for last transactions because they're displayed on the transactions page.
      return true;
    }

    const buckets = weeklyNftBuckets[key];
    const trades = bucketValues(buckets).reduce((acc, current) => {
      // 0 is the trade count
      return acc + current[0];
    }, 0);

    return trades >= 3;
  });

  const newNfts = Object.keys(weekly.nfts);
  
  const newNftsFiltered = weeklyPopularNfts.filter(nftId => {
    // if it doesn't have a title, metadata wasn't pulled yet or failed at some point
    return !nfts[nftId]?.title;
  });

  console.log(`[INFO] Unique NFTs traded in the last 7 days: ${newNfts.length}`);
  console.log(`[INFO] Popular NFTs in the last 7 days (last ${LAST_TRANSACTIONS_LIMIT} transactions or at least 3 trades): ${weeklyPopularNfts.length}`);
  console.log(`[INFO] Will download missing NFTs: ${newNftsFiltered.length}`);

  for (let index = 0; index < newNftsFiltered.length; index++) {
    const newNft = newNftsFiltered[index];
    const token = nfts[newNft].token;
    try {
      const metadata = await getNftMetadata(token, newNft);
      nfts[newNft] = {
        ...nfts[newNft],
        title: metadata.name,
        image: metadata.image.replace('ipfs://', ''),
      };
      console.log(`[OK][${index + 1}/${newNftsFiltered.length}] Updated metadata for ${newNft}`);
    } catch (error) {
      console.log(`[SKIPPED] Failed to update metadata for ${newNft} due to ${error}. Skipping.`);
    }
  };

  // Remove NFT metadata that isn't needed anymore
  const stale = Object.keys(nfts)
    .filter(nftId => !newNfts.includes(nftId))
    .map(nftId => delete nfts[nftId])
    .length;

  if (stale > 0) {
    console.log(`[INFO] Deleted ${stale} NFTs (no transactions in the last week)`);
  }

  console.log('[INFO] Scan completed. Writing to GitHub...');

  await updateMultipleFiles({
    [FILENAMES.daily]: JSON.stringify(daily),
    [FILENAMES.weekly]: JSON.stringify(weekly),
    [FILENAMES.transactions]: JSON.stringify(lastTransactions),
    [FILENAMES.nfts]: JSON.stringify(nfts),
    [FILENAMES.metadata]: JSON.stringify({
      updatedAt: Date.now(),
      lastTransaction: transactionsToResample[0].ts,
      volume: dailyVolume,
      trades: dailyTrades,
    }),
  });

  console.log('[INFO] Writing files to GitHub completed. Scan finished successfully.');
};

exports.handler();