var resourceBaseURI = '';
if (typeof(safari) !== 'undefined') {
  resourceBaseURI = safari.extension.baseURI;
  safari.self.tab.dispatchMessage("getSettingValue", "quick_inventory");
}
else if (typeof(chrome) !== 'undefined') {
  resourceBaseURI = chrome.extension.getURL('');
}

var sizeSortOrder = ["0", "P", "XXS", "XSMALL", "S", "SMALL", "M", "MEDIUM", "L", "LARGE", "XL", "XXL", "XXXL", "TWIN", "FULL", "FULL/QUEEN", "QUEEN", "KING"];
var lookCache = {}; // each lookId contains an array of [sku, status] pairs
var lookToProductMap = {}; // each lookId maps to a productId
var skuToSizeMap = {};

if (typeof(safari) !== 'undefined') {
  safari.self.addEventListener("message", function(msgEvent) {
    if (msgEvent.name == "settingValueFor_quick_inventory" && msgEvent.message == true)
      showQuickInventory();
  }, false);
}

if (typeof(chrome) !== 'undefined') {
  showQuickInventory();
}

function getInventory(el) {
  var lookId = el.attr('id').replace(/^product_look_/, '');
  var saleId = $("#omniture_sale_id").text();
  var url = el.find('a.product_image').attr('href');

  $.get(url, function(data) {
    var skuStrings = data.match(/registerSku\([^\)]+\)/mg)
    if(skuStrings.length > 1) {

      function registerSku(a,b,c,d,e,f) {
        if(f) {
          return [a,b,c,d,e];
        } else {
          var sku = c,
          size = b;
          skuToSizeMap[c] = b;
        }
      }

      var productIds = [];

      for(var i = 0; i < skuStrings.length; i++) {
        if(!skuStrings[i].match(/(\d|')\)$/)) { skuStrings[i] += "')"; }

        var skuData = eval(skuStrings[i]);
        if(!skuData) { continue; }

        var productId = skuData[2];
        var sku = skuData[1];
        var size = skuData[4];
        lookToProductMap[lookId] = productId;
        skuToSizeMap[sku] = skuToSizeMap[sku] || size || "N/A";
        if(!productIds.join(' ').match(productId)) { productIds.push("product_id=" + productId); }
      }

      el.data('product-ids', productIds);

      var url = "/inventory_service/product_status?" + productIds.join('&');
      $.getJSON(url, function(data) {
        var looks = data.data.products[0].looks;

        // Put the looks into a map for reuse later
        for(var i = 0; i < looks.length; i++) {
          lookCache[looks[i].look_id] = looks[i];
        }

        var look = lookCache[lookId];

        var sizesDiv = $(el).find('div.sizes');
        sizesDiv.html('');
        var sizeLinks = [];

        for(var i = 0; i < look.skus.length; i++) {
          var sku = look.skus[i];
          var size = skuToSizeMap[sku.sku_id];
          if(sku.stat == 'F') {
            var link = $("<a href='#' class='size' onclick='Gilt.Cart.addSku(\"" + saleId + "\", \"" + lookToProductMap[lookId] + "\", \"" + sku.sku_id + "\"); return false;'></a>");
            if(size) {
              link.text(size);
            } else {
              link.text("single size");
            }
            link.attr('data-sku', sku.sku_id);
            sizeLinks.push([size, link]);
          }
        }

        var sortedLinks = sizeLinks.sort(function(a, b) {
          function valueForSize(size) {
            if(parseFloat(size) > 0) {
              return parseFloat(size);
            }

            return sizeSortOrder.indexOf(size.toUpperCase());
          }

          return (valueForSize(a[0] || '') > valueForSize(b[0] || '')) ? 1 : -1;
        });

        for(var i = 0; i < sortedLinks.length; i++) {
          sizesDiv.append(sortedLinks[i][1]);
        }

        if(sortedLinks.length > 0) {
          el.find('div.available_sizes').addClass('fetched').find('p').text('Available Sizes');
        } else {
          el.find('div.available_sizes').addClass('fetched').find('p').text('Out of Stock');
        }

        el.find('a.refresh_inventory').text('Refresh Inventory');
      });
    }
  });
};

function addInventoryContainers(el) {
  var availableSizeDiv = $("<div class='available_sizes'></div>");
  availableSizeDiv.append("<p>Available Sizes</p>");

  var sizeDiv = $("<div class='sizes'><div class='size_container'><div class='size_ruler'></div></div></div><div class='clear'></div>");
  sizeDiv.appendTo(availableSizeDiv);

  el.find('a.product_image').append(availableSizeDiv);
};

function addInventoryUpdateButtons(el) {
  $("#catalog div.product").mouseover(function() {
    if($(this).find('a.refresh_inventory').length == 0) {
      $(this).prepend("<a class='refresh_inventory' href='#'>Refresh inventory</a>");
    }
  });
}

function showQuickInventory() {
  if(document.getElementById('catalog')) {

    addInventoryContainers($("#catalog div.product"));
    addInventoryUpdateButtons($("#catalog div.product"));

    $("#catalog div.product  a.refresh_inventory").live('click', function(e) {
      e.preventDefault();
      $(this).append("&nbsp; <img src='" + safari.extension.baseURI + "img/loader.gif' />");

      getInventory($(this).parent());
    });

  }
}