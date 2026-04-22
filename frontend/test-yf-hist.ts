import YahooFinance from 'yahoo-finance2';
async function run() {
  try {
    const yf = new YahooFinance();
    const period1 = new Date();
    period1.setDate(period1.getDate() - 7);
    const history = await yf.chart('RELIANCE.NS', { period1, interval: '1d' });
    console.log(history.quotes.length);
  } catch (e) {
    console.error(e);
  }
}
run();
