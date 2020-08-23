const puppeteer = require('puppeteer');

async function scrapeStock(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // fetch stock name

  // destructuring syntax brings out first element in array the page.$x returns
  const [el] = await page.$x(
    '//*[@id="quote-header-info"]/div[2]/div[1]/div[1]/h1'
  );

  //  extract text from html element
  let text = await el.getProperty('textContent');

  // convert text to string
  const name = await text.jsonValue();

  // retrieve stock price
  const [el2] = await page.$x(
    '//*[@id="quote-header-info"]/div[3]/div[1]/div/span[1]'
  );
  text = await el2.getProperty('textContent');
  let currentPrice = await text.jsonValue();

  const regex = /,/g;
  const found = currentPrice.match(regex);
  if (found) {
    currentPrice = currentPrice.replace(regex, '');
  }
  const boughtAt = currentPrice;

  //   const src = await el2.getProperty('src');
  //   const avatarURL = await src.jsonValue();

  browser.close();

  // for testing
  console.log({ name, currentPrice, boughtAt });

  return { name, currentPrice, boughtAt };
}

async function getCurrentPrice(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // fetch stock price
  const [el] = await page.$x(
    '//*[@id="quote-header-info"]/div[3]/div[1]/div/span[1]'
  );
  let text = await el.getProperty('textContent');
  const currentPrice = await text.jsonValue();

  browser.close();

  // for testing
  console.log({ currentPrice });

  return { currentPrice };
}

// scrapeStock('https://finance.yahoo.com/quote/ZM/');
// getCurrentPrice('https://finance.yahoo.com/quote/ZM/');

module.exports = {
  scrapeStock,
  getCurrentPrice
};
