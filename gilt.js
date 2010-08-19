if(document.getElementById("photo")) {
  var replaceImage = function() {
    var img = $("#photo").get(0);
    img.src = img.src.replace(/med/, 'orig');
  }

  var resizeImage = function() {
    var height = Math.min(Math.max(800, window.innerHeight - 150), 1400);
    var width = Math.floor(height * 0.75);

    giltPhotoHeight = height;
    giltPhotoWidth = width;

    var img = document.getElementById("photo");
    var imgContainer = document.getElementById("photoZoom");
    imgContainer.style.height = height + "px !important";
    imgContainer.style.width = width + "px !important";

    var container = document.getElementById("container");
    container.style.minWidth = width + 580 + "px !important";

    document.getElementById("images").style.width = width + 20 + "px !important";
  }

  var switchToImage = function(event) {
    event.preventDefault();

    var img = document.getElementById("photo");
    img.src = this.src.replace(/sm/, 'orig');
  };

  var makeImageHighRes = function(event) {
    event.preventDefault();

    var img = document.getElementById("photo");
    img.src = img.src.replace(/med/, 'orig');
  };

  var rebindThumbnails = function() {
    var imageLinks = document.getElementsByClassName("zoom");

    for(var i = 0; i < imageLinks.length; i++) {
      var link = imageLinks[i];
      var image = link.childNodes[0];

      $(image).unbind("mouseover");
      image.addEventListener("click", switchToImage, false);
      link.addEventListener("mouseover", function(e) { e.stopPropagation(); }, false);
    }
  };

  $("dd.imagecolor").bind("mouseover", makeImageHighRes).bind("mouseout", makeImageHighRes);

  rebindThumbnails();

  replaceImage();
  resizeImage();

  window.addEventListener("resize", resizeImage);
}

$("#footer").width(1050).prepend("<a href='/account'>My Account</a>");

$("#images div.product_other_views > dl").text("Click to see other views:");