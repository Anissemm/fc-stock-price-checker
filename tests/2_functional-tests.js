const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    test('Viewing one stock', (done) => {
        chai.request(server)
            .get('/api/stock-prices/')
            .query({
                stock: 'GOOG',
                like: false
            })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }

                assert.isObject(res.body, 'response must be an object');
                assert.property(res.body, 'stockData', 'response object must have a \'stockData\' property');
                assert.isObject(res.body.stockData, 'stockData', '\'stockData\' must be an object');
                assert.property(res.body.stockData, 'stock', 'response object must have a \'stock\' property');
                assert.isString(res.body.stockData.stock, '\'stock\' property must be of type string');
                assert.property(res.body.stockData, 'price', 'response object must have a \'price\' property');
                assert.isNumber(res.body.stockData.price, '\'price\' property must of type number');
                assert.property(res.body.stockData, 'likes', 'response object must have a \'likes\' property');
                assert.isNumber(res.body.stockData.likes, '\'likes\' property must of type number');
                assert.equal(res.body.stockData.stock, 'GOOG', '\'stock\' property must equal "GOOG"');
                done();
            });
    });


    let likes = 0;

    test('Viewing one stock and liking it', (done) => {
        chai.request(server)
            .get('/api/stock-prices/')
            .query({
                stock: 'GOOG',
                like: true
            })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }

                assert.isObject(res.body, 'response must be an object');
                assert.property(res.body, 'stockData', 'response object must have a \'stockData\' property');
                assert.isObject(res.body.stockData, 'stockData', '\'stockData\' must be an object');
                assert.property(res.body.stockData, 'stock', 'response object must have a \'stock\' property');
                assert.isString(res.body.stockData.stock, '\'stock\' property must be of type string');
                assert.property(res.body.stockData, 'price', 'response object must have a \'price\' property');
                assert.isNumber(res.body.stockData.price, '\'price\' property must of type number');
                assert.property(res.body.stockData, 'likes', 'response object must have a \'likes\' property');
                assert.isNumber(res.body.stockData.likes, '\'likes\' property must of type number');
                likes = res.body.stockData.likes;
                assert.equal(res.body.stockData.stock, 'GOOG', '\'stock\' property must equal "GOOG"');
                done();
            });
    });

    test('Viewing the same stock and liking it', (done) => {
        chai.request(server)
            .get('/api/stock-prices/')
            .query({
                stock: 'GOOG',
                like: true
            })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }

                assert.isObject(res.body, 'response must be an object');
                assert.property(res.body, 'stockData', 'response object must have a \'stockData\' property');
                assert.isObject(res.body.stockData, 'stockData', '\'stockData\' must be an object');
                assert.property(res.body.stockData, 'stock', 'response object must have a \'stock\' property');
                assert.isString(res.body.stockData.stock, '\'stock\' property must be of type string');
                assert.property(res.body.stockData, 'price', 'response object must have a \'price\' property');
                assert.isNumber(res.body.stockData.price, '\'price\' property must of type number');
                assert.property(res.body.stockData, 'likes', 'response object must have a \'likes\' property');
                assert.isNumber(res.body.stockData.likes, '\'likes\' property must of type number');
                assert.equal(res.body.stockData.stock, 'GOOG', '\'stock\' property must equal to "GOOG"');
                assert.equal(res.body.stockData.likes, likes, `\'stock\' property must equal to ${likes}`);
                done();
            });
    });

    test('Viewing two stocks', (done) => {
        chai.request(server)
            .get('/api/stock-prices/')
            .query({
                stock: ['GOOG', 'MSFT'],
                like: false
            })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }

                assert.isObject(res.body, 'response must be an object');
                assert.property(res.body, 'stockData', 'response object must have a \'stockData\' property');
                assert.isArray(res.body.stockData, 'stockData', '\'stockData\' must be an array');
                assert.lengthOf(res.body.stockData, 2, '"stockData" length must be equal to 2');
                assert.property(res.body.stockData[0], 'stock', 'response object must have a \'stock\' property');
                assert.isString(res.body.stockData[0].stock, '\'stock\' property must be of type string');
                assert.property(res.body.stockData[0], 'price', 'response object must have a \'price\' property');
                assert.isNumber(res.body.stockData[0].price, '\'price\' property must of type number');
                assert.property(res.body.stockData[0], 'rel_likes', 'response object must have a \'rel_likes\' property');
                assert.isNumber(res.body.stockData[0].rel_likes, '\'rel_likes\' property must of type number');
                assert.oneOf(res.body.stockData[0].stock, ['GOOG', 'MSFT'], '\'stock\' property must equal "GOOG" or "MSFT');
                done();
            });
    });

    test('Viewing two stocks and liking them.', (done) => {
        chai.request(server)
            .get('/api/stock-prices/')
            .query({
                stock: ['GOOG', 'MSFT'],
                like: true
            })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }

                assert.isObject(res.body, 'response must be an object');
                assert.property(res.body, 'stockData', 'response object must have a \'stockData\' property');
                assert.isArray(res.body.stockData, 'stockData', '\'stockData\' must be an array');
                assert.lengthOf(res.body.stockData, 2, '"stockData" length must be equal to 2');
                assert.property(res.body.stockData[0], 'stock', 'response object must have a \'stock\' property');
                assert.isString(res.body.stockData[0].stock, '\'stock\' property must be of type string');
                assert.property(res.body.stockData[0], 'price', 'response object must have a \'price\' property');
                assert.isNumber(res.body.stockData[0].price, '\'price\' property must of type number');
                assert.property(res.body.stockData[0], 'rel_likes', 'response object must have a \'rel_likes\' property');
                assert.isNumber(res.body.stockData[0].rel_likes, '\'rel_likes\' property must of type number');
                assert.oneOf(res.body.stockData[0].stock, ['GOOG', 'MSFT'], '\'stock\' property must equal "GOOG" or "MSFT');
                done();
            });
    });


});
