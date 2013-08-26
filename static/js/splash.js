var Splash = {
  imgs: document.getElementsByClassName("splash-img"),
  currentImgIndex: 0,
  init: function() {
    document.addEventListener("keydown", Splash.handleKeys, false);
  },
  nextImg: function() {
    var imgs = Splash.imgs;
    Splash.addClass(imgs[Splash.currentImgIndex].id, "hide");
    if (imgs[Splash.currentImgIndex] != imgs[imgs.length - 1]) {
      Splash.currentImgIndex ++;
    }
    else {
      Splash.currentImgIndex = 0;
    }
    Splash.removeClass(imgs[Splash.currentImgIndex].id, "hide");
  },
  prevImg: function() {
    var imgs = Splash.imgs;
    Splash.addClass(imgs[Splash.currentImgIndex].id, "hide");
    if (imgs[Splash.currentImgIndex] != imgs[0]) {
      Splash.currentImgIndex --;
    }
    else {
      Splash.currentImgIndex = imgs.length - 1;
    }
    Splash.removeClass(imgs[Splash.currentImgIndex].id, "hide");
  },
  addClass: function(id, _class) {
    el = document.getElementById(id);
    if (!el.className.match(/(?:^|\s)_class(?!\S)/)) {
      el.className += " ";
      el.className += _class;
    }
  },
  removeClass: function(id, _class) {
    el = document.getElementById(id);
    if (el.className.indexOf(_class) > -1) {
      el.className = el.className.replace(_class, '');
    }
  },
  handleKeys: function(event) {
    key = event.keyCode || event.which;
    if (key == 39) Splash.nextImg();
    if (key == 37) Splash.prevImg();
  }
}

Splash.init();