/************************
 *   Utility Functions  *
 ************************/

function addClass(el, _class) {
  if (!el.classList.contains(_class)) {
    el.classList.add(_class);
  }
}

function removeClass(el, _class) {
  if (el.classList.contains(_class)) {
    el.classList.remove(_class);
  }
}

/************************
 *  Navigation Dropdown *
 ************************/

var dropdownNode = document.getElementById("navigation-mobile-dropdown"),
    dropdownButton = document.getElementById("navigation-mobile"),
    toggleNavDropdown = function () {
      if (dropdownNode.classList.contains("hide")) {
        dropdownNode.classList.remove("hide");
      }
      else {
        dropdownNode.classList.add("hide");
      }
      return false;
    };

dropdownButton.addEventListener("click", toggleNavDropdown, false);