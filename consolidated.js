// Hard to tell sale splash page apart from product page, so only show
// if we are on a consolidated sale page and if there are no products

if($("#c_sale #a_splash".length > 0) && $("div.product").length == 0) {

  $("#catalog").html('');

  $.eachDelay($("#brands a.brand_button"), function() {
    var name = $(this).text();
    var id = name.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    var url = $(this).attr('onclick').toString().match(/location = \'([^\']+)\'/)[1];
    var brandDiv = $("<div class='brand' style='width: 100%;'></div>");
    brandDiv.attr('id', id);

    $("#catalog").append(brandDiv);

    $(this).attr('href', '#' + id);

    $.get(url, function(data) {
      var title = $("<h2 class='brand_title'>" + name + "</h2>");
      brandDiv.append(title);

      var doc = $(data);
      var catalog = doc.find('#catalog');
      catalog.addClass("catalog").attr("id", "");
      brandDiv.hide();
      brandDiv.append(catalog.html());
      brandDiv.fadeIn();

      leftNavScroll();
    });
  }, 1000);

  // Get rid of 'anti-click-happy' behavior, since it's intra-page now
  // The original code is devious, so we have to nuke it from orbit...
  $.each($("#brands a.brand_button"), function() {
    var clone = $(this).clone();
    var parent = $(this).parent();
    var id = $(this).attr('id');
    $(this).remove();
    parent.append(clone);
    $(clone).attr('onclick', '').attr('id', id);
  });


 // $(document).bind("catalogchanged", function() { alert("changed!"); });

 // $("#catalog").height($(window).height()).append("<div id='temp_junk' class='product'></div>");
 // $(document).trigger("catalogchanged");


  function leftNavScroll() {
    var w = $(window);
    var wh = w.height();
    var ww = w.width();
    var mw = $("#main").width();
    var n = $("#sale_leftnav");
    var n_padding = parseInt(n.css("padding-top").replace("px","")) + parseInt(n.css("padding-bottom").replace("px",""));
    var n_top = 0;
    var visibleProducts = true;
    var max = 0;
    var firstProductTop = 0;
    var ch = $("#catalog").height() - 93;
    var f = function() {
      var wst = w.scrollTop();
      var nh = n.height() + n_padding;
      if (visibleProducts &&
          wst + 10 > firstProductTop &&
          nh < wh && mw <= ww && nh < ch) {
        if(wst + nh < max) {
          if (!n.hasClass("fixed")) {
            n.addClass("fixed").removeClass("relative").removeClass("absolute");
            n.css({top: 10});
          }
        } else {
          if (!n.hasClass("absolute")) {
            n.addClass("absolute").removeClass("relative").removeClass("fixed");
            n.css({top: n_top});
          }
          if (max - nh != n_top) {
            n_top = max - nh;
            n.css({top: n_top});
          }
        }
      } else {
        if (!n.hasClass("relative")) {
          n.addClass("relative").removeClass("fixed").removeClass("absolute");
          n.css({top: 0});
        }
      }
    };
    var f2 = function() {
      wh = w.height();
      ww = w.width();
      f();
    };
    var f3 = function() {
      visibleProducts = $(".product:visible").length > 0;
      max = $(".product:visible:last").offset().top + $(".product:visible:last").height();
      firstProductTop = $(".product:visible:first").offset().top;
      ch = $("#catalog").height() - 93;
      f2();
    };
    if (!$.browser.msie || parseInt($.browser.version) > 6) {
      $(window).scroll(f).resize(f2);
      $(document).bind("catalogchanged", f3);
      f3();
    }
  }
}
