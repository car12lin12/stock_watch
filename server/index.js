const express = require('express');
const path = require('path');
const app = express();
const port = 3008;
var cors = require('cors');
app.use(cors());
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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
  // get all stocks from db as array
  const stocks = await db.getAllStocks();

  // update the currentPrice
  const forLoop = async () => {
    for (let i = 0; i < stocks.length; i++) {
      stocks[i].currentPrice = await scrapers.getCurrentPrice(stocks[i].URL);
      // stocks[i].currentPrice = await scrapers.getCurrentPrice(
      //   'https://finance.yahoo.com/quote/dell?ltr=1'
      // );
      // console.log(stocks[i]);
      // update DB for currentPrice
      await db.updateStock(stocks[i]);
    }
  };
  await forLoop();

  res.send(stocks);
});

app.post('/stocks', async (req, res) => {
  // console.log(req.body);
  // 1 scrape channel
  const stockData = await scrapers.scrapeStock(req.body.stockURL);
  // console.log({ stockData });

  // 2 add to DB
  const allStocks = await db.insertStock(
    stockData.name,
    stockData.currentPrice,
    stockData.boughtAt,
    // stockData.difference,
    req.body.stockURL
  );

  //   res.send('success');
  res.send(allStocks);
});

app.delete('/stocks/:id', async (req, res) => {
  // console.log('request :: ', req.params.id);

  // Delete from DB
  await db.deleteStock(req.params.id);

  res.send('success');
  // res.send(allStocks);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
