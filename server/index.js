const express = require('express');
const app = express();
const port = 3008;

var bodyParser = require('body-parser');
const scrapers = require('./scrapers');
const db = require('./db');
app.use(bodyParser.json());
// express.json();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // disabled for security on local development
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// run with : node index.js

app.get('/stocks', async (req, res) => {
  // mock data
  //   const creators = [
  //     { name: 'Code drip', img: 'https://' },
  //     { name: 'Milky Chance', img: 'https://' },
  //     { name: 'Aaron Jack', img: 'https://' }
  //   ];

  // get all stocks from db as array
  const stocks = await db.getAllStocks();
  console.log(stocks);
  // ???? may have to scrape all stock urls here for currentPrice.
  const forLoop = async () => {
    for (let i = 0; i < stocks.length; i++) {
      stocks[i].currentPrice = await scrapers.getCurrentPrice(stocks[i].URL);
    }
  };
  forLoop();

  res.send(stocks);
});

app.post('/stocks', async (req, res) => {
  console.log(req.body);
  // 1 scrape channel
  const stockData = await scrapers.scrapeStock(req.body.stockURL);
  // console.log({ stockData });

  // 2 add to DB
  const allStocks = await db.insertStock(
    stockData.name,
    stockData.currentPrice,
    stockData.boughtAt,
    req.body.stockURL
  );

  //   res.send('success');
  res.send(allStocks);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
