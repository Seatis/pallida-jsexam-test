'use strict'

var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var app = express();

app.use(express.json());
app.use(express.static('./frontend'));
app.use(cors());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'GR18pv',
  database: 'clothes'
});

connection.connect();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/warehouse', function(req, res) {
  var data = [];
  var queryString = `SELECT * FROM warehouse ORDER BY id DESC`;
  connection.query(queryString, function(err, result) {
    result.forEach(function(element){
      data.push({'id': element.id, 'item_name': element.item_name, 'manufacturer': element.manufacturer, 'category': element.category, 'size': element.size, 'unit_price': element.unit_price});
    });
    res.send({'result': 'OK', 'data': data});
  });
});

app.get('/size-filter', function(req, res) {
  var data = [];
  var queryString = `SELECT size FROM warehouse WHERE item_name = '${req.query.item_name}'`;
  connection.query(queryString, function(err, result) {
    result.forEach(function(element){
      data.push(element.size);
    });
    res.send({'result': 'OK', 'data': data});
  });
});

app.get('/price-check', function(req, res) {
  var data = [];
  var queryString = `SELECT in_store, unit_price FROM warehouse WHERE item_name = '${req.query.item}' AND size = '${req.query.size}'`;
  connection.query(queryString, function(err, result) {
    if (Number(req.query.quantity) > result[0].in_store) {
      res.send({'result': "error, we don't have enough items in store"});
    } else if (Number(req.query.quantity) >= 3) {
      res.send({'result': 'OK', 'total_price': Number(req.query.quantity) * result[0].unit_price});
    } else {
      res.send({'result': 'please order at least 3, one for yourself, two for your friends'});
    }
  });
});

app.post('/warehouse', function(req, res) {
  let queryString = `INSERT INTO warehouse (item_name, manufacturer, category, size, unit_price, in_store)
                     VALUES ('${req.body.item_name}', 'xDesign', 'sweaters', '${req.body.size}', 35.6, 19)`;
  let queryCheck = `SELECT * FROM warehouse WHERE item_name = '${req.body.item_name}'`;
  
  connection.query(queryString, function(err, result) {
    if (err) {
      res.status(500).send({'status': 'error', 'result': err.toString()});
      return;
    }
    connection.query(queryCheck, function(err, result) {
      if (err) {
        res.status(500).send({'status': 'error', 'result': err.toString()});
        return;
      }
      res.send({'status': 'OK', 'result': result});
    });
  });
});


app.delete('/warehouse/:id', function(req, res) {
  let queryString = `DELETE FROM warehouse WHERE id = ${req.params.id}`;
  connection.query(queryString, function(err, result) {
    if (err) {
      res.status(500).send({'status': 'error', 'result': err.toString()});
      return;
    }
    res.send({'status': 'Item has been removed'});
  });
});

app.listen(4000, () => console.log('Running'));