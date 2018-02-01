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

function messageRender(result) {
  let message = document.querySelector('div.message');
  if (result.result === 'OK') {
    message.innerHTML = `The items can be ordered, the total price is: ${result.total_price}`;
    message.classList.remove('red');
    message.classList.add('green');
  } else {
    message.innerHTML = result.result;
    message.classList.remove('green');
    message.classList.add('red');
  }
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
                        <th>Del</th>
                      </tr>`;
    result.data.forEach(function(element) {
      const markup = `<tr>
                        <td>${element.item_name}</td>
                        <td><a>[${element.manufacturer}]</a></td>
                        <td>${element.category}</td>
                        <td>${element.size}</td>
                        <td>${element.unit_price}</td>
                        <td><input type="checkbox" name="item" id=${element.id}></td>
                      </tr>`;
      table.innerHTML += markup;
    });
  }
}



function addNewClothes(baseUrl) {
  let name = document.querySelector('section.postbar input.nameInput');
  let size = document.querySelector('section.postbar input.sizeInput');
  let addButton = document.querySelector('section.postbar button');
  addButton.addEventListener('click', function() {
    if (name.value === '') {
      alert('Please type name!');
    } else if (size.value === '') {
      alert('Please type size!');
    } else {
      let body = JSON.stringify({
        "item_name": name.value,
        "size": size.value
      });
      name.value = '';
      size.value = '';
      let url = `${baseUrl}/warehouse`;
      ajax('POST', url, body, start);
    }
  });
}

function checkBoxDel(baseUrl) {
  let delButton = document.querySelector('button.del')
  delButton.addEventListener('click', function() {
    let checkboxList = document.querySelectorAll('input[type=checkbox]');
    checkboxList.forEach(function(element) {
      if (element.checked) {
        let url = `${baseUrl}/warehouse/${element.id}`;
        ajax('DELETE', url, null, start);
      }
    });    
  });
}


function eventHandler(baseUrl) {
  let itemNameList = document.querySelector('section select.item_name');
  let sizeList = document.querySelector('section select.size');
  let quantity = document.querySelector('section.navbar input');
  let getTotal = document.querySelector('section.navbar button');
  getTotal.addEventListener('click', function() {
    if (itemNameList.value === 'default') {
      alert('Please select a name!');
    } else if (sizeList.value === 'default') {
      alert('Please select a size!');
    } else if (quantity.value === '') {
      alert('Please type the quantity');
    } else {
      let url = `${baseUrl}/price-check?item=${itemNameList.value}&size=${sizeList.value}&quantity=${quantity.value}`;
      ajax('GET', url, null, messageRender);
    }
  });
  addNewClothes(baseUrl);
  checkBoxDel(baseUrl);
}

function createDropDownList(result, type) {
  let full = [];
  let currentList;
  if (type === 'name') {
    currentList = document.querySelector('section select.item_name');
    result.data.forEach(function(element) {
      full.push(element.item_name);
    });
  } else if (type === 'size') {
    currentList = document.querySelector('section select.size');
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
  eventHandler(baseUrl);
}

start();
