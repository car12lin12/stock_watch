const typeorm = require('typeorm');

// class is a model or entity for the database
class Stock {
  constructor(id, name, currentPrice, boughtAt, URL) {
    this.id = id;
    this.name = name;
    this.currentPrice = currentPrice;
    this.boughtAt = boughtAt;
    // this.difference = currentPrice - boughtAt;
    this.URL = URL;
  }
}

// hneed to create a Schema to map our model object to the database
// our model / class above is the target

const EntitySchema = require('typeorm').EntitySchema;

const StockSchema = new EntitySchema({
  name: 'Stock',
  target: Stock,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar'
    },
    currentPrice: {
      type: 'double precision'
    },
    boughtAt: {
      type: 'double precision'
    },
    // difference: {
    //   type: 'double precision'
    // },
    URL: {
      type: 'text'
    }
  }
});

/**
 * interact with database by creating a connection.
 * choose any port.
 */
async function getConnection() {
  return await typeorm.createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [StockSchema]
  });
}

async function getAllStocks() {
  const connection = await getConnection();
  const stockRepo = connection.getRepository(Stock);
  // finds all stocks
  const stocks = await stockRepo.find();
  connection.close();
  return stocks;
}

async function insertStock(name, currentPrice, boughtAt, URL) {
  // 1 connect to db
  const connection = await getConnection();

  // 2 create new model instance using appropriate params
  const stock = new Stock();
  stock.name = name;
  stock.currentPrice = currentPrice;
  stock.boughtAt = boughtAt;
  // stock.difference = difference;
  stock.URL = URL;

  // 3 save new object / model instance in db repository
  const stockRepo = connection.getRepository(Stock);
  const res = await stockRepo.save(stock);
  console.log('saved !!!!!!!!!!!!!', res);

  // 4 return new list
  const allStocks = await stockRepo.find();
  connection.close();
  return allStocks;
}

async function deleteStock(id) {
  // 1 connect to db
  const connection = await getConnection();
  // 3 save new object / model instance in db repository
  const stockRepo = connection.getRepository(Stock);
  const res = await stockRepo.delete({ id: id }); // delete instead
  // console.log('saved', res);

  // 4 return new list
  // const allStocks = await stockRepo.find();
  connection.close();
  // return allStocks;
  return id;
}

async function updateStock(stock) {
  // 1 connect to db
  const connection = await getConnection();
  const stockRepo = connection.getRepository(Stock);
  const res = await stockRepo.save({
    id: stock.id,
    currentPrice: stock.currentPrice
  }); // update existing entry
  // console.log('saved', res);

  // 4 return new list
  // const allStocks = await stockRepo.find();
  connection.close();
  // return allStocks;
  return res;
}

module.exports = {
  getAllStocks,
  insertStock,
  deleteStock,
  updateStock
};
