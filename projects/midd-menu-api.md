---
layout: project
title: Middlebury Menu API
date: 2013-12-17 21:12:29 EST
---

## A REST API for menus.middlebury.edu.

This project is open source.  The code can be found at [github.com/danasilver/midd-menu-api](https://github.com/danasilver/midd-menu-api).

### Endpoints

API base url: `middmenuapi.herokuapp.com`.

Get today's menu.

```
GET /
```

Get the menu for yyyy-mm-dd.

```
GET /yyyy-mm-dd
```

### Try It Out

<style>
input[type="text"] {
  font-family: inherit;
  font-size: inherit;
  background-color: inherit;
  border: none;
  color: inherit;
  border-bottom: 1px solid #0086b3;
  padding: inherit;
}
input[type="submit"] {
  color: #333;
  background-color: #fff;
  margin-left: 5px;
  display: inline-block;
  padding: 2px 4px;
  font-size: 90%;
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[type="submit"]:hover {
  background-color: #f2f2f2;
}
input:active,
input:focus {
  outline: none;
}
#output {
  height: 500px;
  width: 828px;
  border: 1px solid #0086b3;
  margin-top: 10px;
  overflow: scroll;
  padding: 5px;
}
</style>

<form>
<p>Enter a date in yyyy-mm-dd format or leave blank to request today's menu.</p>
<code>middmenuapi.herokuapp.com/<input type="text" name="date" placeholder="Click to enter date"></code>
<input type="submit" value="Make Request">
</form>
<pre id="output"></pre>

<script>
function requestMenu(date) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", "//middmenuapi.herokuapp.com/" + date);
  xhr.onload = loadMenu;
  xhr.send();
}

function loadMenu(response) {
  var string = response.target.responseText,
  json = JSON.parse(string),
  formattedString = JSON.stringify(json, null, 2)

  document.getElementById("output").innerHTML = formattedString;
}

var form = document.querySelector("form");
form.addEventListener("submit", function(e) {
  e.preventDefault();
  var date = document.querySelector("input[name='date']").value;

  if (/^\d{4}-\d{2}-\d{2}$/.test(date) || date === "") {
    requestMenu(date)
  }
  else {
    var errorMessage = "Proper date format is yyyy-mm-dd."
    document.getElementById("output").innerHTML = errorMessage;
  }
}, true);

requestMenu("");
</script>

### Development

#### Clone the repo and install the [npm] dependencies

The project also depends on [node.js] and [MongoDB], which you will need to install for development.

```sh
$ git clone https://github.com/danasilver/midd-menu-api.git
$ npm install
```

#### Start MongoDB and the node.js server

You can execute these two commands in different windows of your terminal or use `&` to detach the `mongod` process and run `node app.js` in the same window.

```sh
$ mongod &
$ node app.js
```

[npm]: https://npmjs.org/
[node.js]: http://nodejs.org/
[MongoDB]: http://www.mongodb.org/