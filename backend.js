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
  database: 'licenceplate'
});

connection.connect();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.listen(4000, () => console.log('Running'));