---
layout: project
title: Middlebury Menu API
date: 2013-12-28 02:00:00 EST
---

A REST API for menus.middlebury.edu.

_Updated 12/17/13_

## Endpoints

API base url: `middmenuapi.herokuapp.com`.

```
/
```
Returns the current day's menu.

```
/yyyy-mm-dd
```
Returns the menu for `yyyy-mm-dd`.  

## Development

Setup:

```sh
$ npm install
```

Run the server:

```sh
$ node app.js
```