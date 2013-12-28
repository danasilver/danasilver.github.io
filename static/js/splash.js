var Splash = {
  imgs: document.getElementsByClassName("splash-img"),
  currentImgIndex: 0,
  init: function() {
    var splashElem = document.getElementsByClassName("splash")[0];
    document.addEventListener("keydown", Splash.handleKeys, false);
    splashElem.addEventListener("click", Splash.nextImg, false);
  },
  nextImg: function() {
    var imgs = Splash.imgs;
    addClass(imgs[Splash.currentImgIndex], "hide");
    if (imgs[Splash.currentImgIndex] != imgs[imgs.length - 1]) {
      Splash.currentImgIndex ++;
    }
    else {
      Splash.currentImgIndex = 0;
    }
    removeClass(imgs[Splash.currentImgIndex], "hide");
  },
  prevImg: function() {
    var imgs = Splash.imgs;
    addClass(imgs[Splash.currentImgIndex], "hide");
    if (imgs[Splash.currentImgIndex] != imgs[0]) {
      Splash.currentImgIndex --;
    }
    else {
      Splash.currentImgIndex = imgs.length - 1;
    }
    removeClass(imgs[Splash.currentImgIndex], "hide");
  },
  handleKeys: function(event) {
    key = event.keyCode || event.which;
    if (key == 39) Splash.nextImg();
    if (key == 37) Splash.prevImg();
  }
}

Splash.init();