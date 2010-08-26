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

  var noteLink = $("#better_sizing_link");
  var notes = $("#size_guide div.size_notes div");
  noteLink.before(notes.css({marginBottom: '1em'}));

  window.addEventListener("resize", resizeImage);
}

var accountText = $("#carousel-nav-top-bar a:not(:has(span)):last");
var dropdown = $("<div class='account_dropdown'><p>" + accountText.text() + " <small>&#9660;</small></p><div class='items'></div></div>");
accountText.remove();

var items = dropdown.find('div.items');
$("#carousel-nav-top-bar a:hidden").appendTo(items);
$("body").append(dropdown);
dropdown.find('p').click(function() { $("div.account_dropdown div.items").slideToggle(300); });

$("#images div.product_other_views > dl").text("Click to see other views:");