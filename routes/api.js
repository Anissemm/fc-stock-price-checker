'use strict';

const unirest = require('unirest');
const bcrypt = require('bcrypt');

const fetchStock = async (stock) => {
  const { body } = await unirest.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
  return body;
}

const encryptId = async (ip) => {
  const hashed = await bcrypt.hash(ip, 10);
  return hashed;
}

const getLikes = async (stockData, ip, Stock, like) => {
  const { symbol } = stockData;

  const stockFDB = await Stock.findOne({ stock: symbol });
  let alreadyLiked = false;

  if (stockFDB?.likes.length > 0) {
    for (let like of stockFDB.likes) {
      if (bcrypt.compareSync(ip, like)) {
        alreadyLiked = true;
        break;
      }
    }
  }

  if (!alreadyLiked && like === 'true') {
    const hashedIP = await encryptId(ip);
    await Stock.updateOne({ stock: symbol }, { $set: { stock: symbol }, $push: { likes: hashedIP } }, { upsert: true });
  }

  const stockInfo = await Stock.findOne({ stock: symbol });

  if (stockInfo) {
    return stockInfo.likes.length;
  }

  return 0;
}

const getStockInfo = async (stock, like, ip, Stock) => {
  const fetchedStock = await fetchStock(stock);

  let likes = like === 'true' ? 1 : 0;

  if (fetchedStock !== 'Invalid symbol') {
    likes = await getLikes(fetchedStock, ip, Stock, like);
  }

  const { latestPrice, symbol } = fetchedStock;

  return {
    stockData: {
      stock: symbol,
      price: latestPrice,
      likes
    }
  }

}

module.exports = function (app, db) {
  const Stock = db.collection('stock');

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;

      if (Array.isArray(stock)) {
        const { stockData: first } = await getStockInfo(stock[0], like, req.ip, Stock);
        const { stockData: second } = await getStockInfo(stock[1], like, req.ip, Stock);

        return res.json({
          stockData: [
            {
              stock: first.stock,
              price: first.price,
              rel_likes: second.likes - first.likes
            },
            {
              stock: second.stock,
              price: second.price,
              rel_likes: first.likes - second.likes
            }
          ]
        })
      }

      const stockInfo = await getStockInfo(stock, like, req.ip, Stock);

      return res.json(stockInfo)
    });

};
