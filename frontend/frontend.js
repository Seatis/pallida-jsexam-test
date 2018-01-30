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

function pageRender(result){
  createDropDownList(result, 'name');
  createDropDownList(result, 'size');
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

function createDropDownList(result, type) {
  let full = [];
  let currentList;
  if (type === 'name') {
    currentList = document.querySelector('section select.item_name');
    currentList.innerHTML = `<option value="default">Select item name</option>`;
    result.data.forEach(function(element) {
      full.push(element.item_name);
    });
  } else if (type === 'size') {
    currentList = document.querySelector('section select.size');
    currentList.innerHTML = `<option value="default">Select size</option>`;
    result.data.forEach(function(element) {
      full.push(element.size);
    });
  }
  let unique = Array.from(new Set(full));
  unique.forEach(function(element) {
    currentList.innerHTML += `<option value="${element}">${element}</option>`;
  });
  
}

function start () {
  let baseUrl = 'http://localhost:4000';
  ajax('GET', baseUrl + '/warehouse', null, pageRender);
}

start();
