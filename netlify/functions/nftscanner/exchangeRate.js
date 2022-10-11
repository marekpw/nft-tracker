const fetch = require('node-fetch');

const conversionsToEth = {};

const convertToEth = async (price, symbol) => {
  const symbolUpper = symbol.toUpperCase();

  if (symbolUpper === 'ETH') {
    return price;
  }

  if (conversionsToEth[symbolUpper]) {
    return price * conversionsToEth[symbolUpper];
  }

  console.log(`[INFO] Exchange rate of symbol ${symbolUpper} not saved yet. Getting exchange rate...`);
  const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbolUpper}&tsyms=ETH`);
  const rates = await response.json();

  conversionsToEth[symbolUpper] = rates['ETH'];
  console.log(`[INFO] Received exchange rate for ${symbol}/ETH: ${conversionsToEth[symbolUpper]}`)

  return price * conversionsToEth[symbolUpper];
};

module.exports = {
  convertToEth,
};