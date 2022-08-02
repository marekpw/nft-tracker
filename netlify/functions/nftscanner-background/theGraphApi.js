const fetch = require('node-fetch');

/**
 * R
 * @param {number} count Number of results to query. Limit is 1000.
 * @param {string?} startFromId Internal ID of the transaction to start from. Used for pagination requests.
 * @returns 
 */
const getTransactions = async (count, startFromId = null) => {
  const variables = {
    first: count,
    orderBy: 'internalID',
    orderDirection: 'desc',
    where: {
      typename: "TradeNFT"
    }
  };

  if (startFromId) {
    variables.where.internalID_lt = startFromId;
  }

  const result = await fetch('https://api.thegraph.com/subgraphs/name/loopring/loopring', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      query transactions($first: Int, $orderBy: Transaction_orderBy, $orderDirection: OrderDirection, $where: Transaction_filter) {
        transactions(
          first: $first
          orderBy: $orderBy
          orderDirection: $orderDirection
          where: $where
        ) {
          id
          internalID
          block {
            id
            timestamp
            __typename
          }
          data
          ...TradeNFTFragment
          __typename
        }
      }
      
      fragment AccountFragment on Account {
        id
        address
        __typename
      }
      
      fragment TokenFragment on Token {
        id
        name
        symbol
        decimals
        address
        __typename
      }
      
      fragment TradeNFTFragment on TradeNFT {
        accountSeller {
          ...AccountFragment
          __typename
        }
        accountBuyer {
          ...AccountFragment
          __typename
        }
        token {
          ...TokenFragment
          __typename
        }
        nfts {
          ...NFTFragment
          __typename
        }
        realizedNFTPrice
        feeBuyer
        feeBipsA
        feeBipsB
        __typename
      }
      
      fragment NFTFragment on NonFungibleToken {
        id
        minter {
          ...AccountFragment
          __typename
        }
        nftID
        nftType
        token
        creatorFeeBips
        __typename
      }
      `,
      operationName: 'transactions',
      variables
    }),
  });

  const json = await result.json();
  return json.data.transactions;
};

module.exports = {
  getTransactions,
};