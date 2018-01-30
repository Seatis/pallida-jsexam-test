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
  var queryString = `SELECT * FROM warehouse`;
  connection.query(queryString, function(err, result) {
    result.forEach(function(element){
      data.push({'item_name': element.item_name, 'manufacturer': element.manufacturer, 'category': element.category, 'size': element.size, 'unit_price': element.unit_price});
    });
    res.send({'result': 'OK', 'data': data});
  });
});

app.listen(4000, () => console.log('Running'));