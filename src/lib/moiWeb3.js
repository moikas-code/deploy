/*
 *
 * @param {sting} recievecoin Coin being bought
 * @param {integer} value How Many Coins Bought
 * @param {integer} dec Number of Decimals Coin Uses
 */
export const getQuote = async (
  sendcoin = 'ETH',
  recievecoin = 'DAI',
  value = 0,
  dec = 18
) => {
  try {
    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?buyToken=${recievecoin}&sellToken=${sendcoin}&buyAmount=${
        value * Math.pow(10, dec)
      }&feeRecipient=${
        process.env.ADMIN_ID
      }&buyTokenPercentageFee=0.00075&slippagePercentage=0.0377`
    );
    let quote = await response.json();
    return quote;
  } catch (error) {
    console.log('getQuote()', error);
  }
};

export function truncateAddress(address) {
  try {
    return `${address.substring(0, 6).toLowerCase()}...${address
      .substring(38, 42)
      .toLowerCase()}`;
  } catch (error) {
    console.log(`truncateAddress(): ${error}`);
  }
}
