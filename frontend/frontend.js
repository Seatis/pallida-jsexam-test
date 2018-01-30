'use strict'

function ajax (method, url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var responseData = JSON.parse(xhr.response);
      callback(responseData);
    }
  });
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

function appendTable(result){
  var table = document.querySelector('section table');
  if (result.result === 'wrong') {
    table.innerHTML = 'Something wrong!';
  } else {
    table.innerHTML = `<tr>
                        <th>Item name</th>
                        <th>Manufacturer</th> 
                        <th>Category</th>
                        <th>Size</th>
                        <th>Unit price</th>
                      </tr>
    `
    result.data.forEach(function(element) {
      const markup = `<tr>
                        <td>${element.item_name}</td>
                        <td><a>[${element.manufacturer}]</a></td>
                        <td>${element.category}</td>
                        <td>${element.size}</td>
                        <td>${element.unit_price}</td>
                      </tr>
      `
      table.innerHTML += markup;
    });
  }
}

function start () {
  let baseUrl = 'http://localhost:4000';
  ajax('GET', baseUrl + '/warehouse', null, appendTable);
}

start();
