---
layout: project
title: Middlebury Menu Extension
date: 2014-01-14 00:40:34 EST
---

## A Chrome extension for the Middlebury menu.

![Middlebury Menu Extension Logo](/static/assets/middlebury-menu-extension/small-tile.png)

### Install

You can get the extension in the [Chrome Web Store](https://chrome.google.com/webstore/detail/middlebury-menu/hcmnnfdhfkhonkonabfebpkjggndbbno) or install it right here.

<style>
button {
  height: 40px;
  width: 150px;
  color: #fff;
  display: inline-block;
  padding: 2px 4px;
  font-size: 100%;
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  border: 1px solid #0086b3;
  border-radius: 4px;
  background-color: #37A8CE;
}
button:active,
button:focus {
  outline: none;
}
</style>

<p id="statusText"></p>

<button id="installBtn" onclick="installExtension()">Add to Chrome</button>

<script>
var installedText = document.getElementById("extensionInstalled")
  , statusText = document.getElementById("statusText")
  , installBtn = document.getElementById("installBtn")
  , isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

if (chrome.app.isInstalled) {
  // extension installed
  statusText.style.display = "none";
}
else if (isChrome) {
  // not installed but running chrome

}
else {
  // not running chrome
  statusText.innerHTML = "You'll need to download <a href='https://www.google.com/intl/en/chrome/browser/'>Google Chrome</a> before you can install."
  installBtn.style.display = "none";
}

if (chrome.app.isInstalled) {
  installedText.innerText = "You already have the Middlebury Menu Extension installed."
}
function installExtension() {
  chrome.webstore.install("https://chrome.google.com/webstore/detail/hcmnnfdhfkhonkonabfebpkjggndbbno");
}
</script>

### Features
 - Clean, easy to read dates.
 - One click buttons for the next and previous dates.
 - One click from the calendar popup to any date.

### Screenshots

<a href="/static/assets/middlebury-menu-extension/screenshot_1.png">![Screenshot of pretty header](/static/assets/middlebury-menu-extension/screenshot_1.png)</a>

<a href="/static/assets/middlebury-menu-extension/screenshot_2.png">![Screenshot with calendar widget](/static/assets/middlebury-menu-extension/screenshot_2.png)</a>

### Bugs and Features

Found a bug or have a feature request?

 - Open an issue on [Github](https://github.com/danasilver/midd-menu-extension/issues).
 - Contact [@danasilver](https://twitter.com/DanaRSilver) or [dsilver@middlebury.edu](mailto:dsilver@middlebury.edu).

### Open Source

This project is open source and released under the [MIT License](https://github.com/danasilver/midd-menu-extension/blob/master/LICENCE.txt).  The code can be found at [github.com/danasilver/midd-menu-extension](https://github.com/danasilver/midd-menu-extension).