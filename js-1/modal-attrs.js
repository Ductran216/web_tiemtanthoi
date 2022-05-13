$(document).ready(function () {
  $('.js-modal-attrs').each(function () {
    $(this).on('open', function (event, html, variations) {
      $(this).html(html);
      $(this).trigger('init', variations);
    });
    $(this).on('init', function (e, variations) {
      var self = $(this);
      $(this).find('.js-product-attr').addClass('active');
      var productAttr = $(this).find('.js-product-attr');
      var btnClose = $(productAttr).find('.js-btn-close');
      var overlay = $(productAttr).find('.js-overlay');
      btnClose.click(function () {
        productAttr.removeClass('active');
      });
      overlay.click(function () {
        productAttr.removeClass('active');
      }); // Variation action

      var productBox = $(this).find('.js-product-attr');
      var productId = $(productBox).attr('data-product');
      var productVariationClass = 'js-product-variation';
      var btnVariationClass = 'js-btn-product-variation';
      var btnVariationSelectedClass = 'product-variation--selected';
      var btnVariationDisableClass = 'product-variation--disabled';
      var btnVariationDeactiveClass = 'product-variation--deactive';
      var productVariations = $(productBox).find('.' + productVariationClass);
      var btnProductVariations = $(productBox).find('.' + btnVariationClass);
      btnProductVariations.each(function () {
        var value = $(this).attr('value');

        if (variations[value] && variations[value]['inventory'] == 0) {
          $(this).addClass(btnVariationDisableClass);
        }
      });
      btnProductVariations.click(function () {
        if (!$(this).hasClass(btnVariationDeactiveClass)) {
          var index = $(this).data('row');
          var value = $(this).attr('value');

          if (!$(this).hasClass(btnVariationSelectedClass)) {
            $(productBox).find('.' + productVariationClass + '[data-index="' + index + '"]').addClass('active');
            $(productBox).find('.' + productVariationClass + '[data-index="' + index + '"]').find('.' + btnVariationSelectedClass).removeClass(btnVariationSelectedClass);
            $(productBox).find('.' + btnVariationClass + '[value="' + value + '"]').addClass(btnVariationSelectedClass);
          } else {
            $(productBox).find('.' + productVariationClass + '[data-index="' + index + '"]').removeClass('active');
            $(productBox).find('.' + btnVariationClass + '[value="' + value + '"]').removeClass(btnVariationSelectedClass);
          }

          checkVariation(productBox, variations);
        }
      }); // Add Cart and Buy Now

      var btnAddCart = $(productBox).find('.js-product-add-cart');
      var btnBuyNow = $(productBox).find('.js-product-buy-now');
      var plus_minus = $(productBox).find('.js-plus-minus');
      plusMinusInit(plus_minus);
      btnAddCart.on('click', function () {
        var model = productBox.attr('model');
        var quantity = parseInt(plus_minus.find('.js-current').val());
        var data = {
          product_id: productId,
          quantity: quantity
        };

        if (model) {
          data.model = model;
        }

        updateCart('/cart/add', data).done(function (response) {
          if (response.status == 200) {
            productAttr.removeClass('active');
            var cart = response.data; // Add facebook pixel

            if (window.facebook_pixel_code) {
              var cart_product = 'cart-' + productId;

              if (model) {
                cart_product += '-' + model;
              }

              var price = '';

              if (cart.products[cart_product]) {
                price = cart.products[cart_product].price;
              }

              fbq('track', 'AddToCart', {
                num_items: quantity,
                content_type: 'product',
                content_ids: [productId],
                currency: 'VND',
                value: price
              });
            }
          }
        }).fail(function (error) {
          console.log(error);
        });
      });
      btnBuyNow.on('click', function () {
        var model = productBox.attr('model');
        var quantity = parseInt(plus_minus.find('.js-current').val());
        var data = {
          product_id: productId,
          quantity: quantity
        };

        if (model) {
          data.model = model;
        }

        updateCart('/cart/add', data, true).done(function (res) {
          if (res.status == 200 || res.data.type == 'error' && res.data.quantity) {
            location.href = '/cart';
            productAttr.removeClass('active'); // Add facebook pixel

            if (res.status == 200 && window.facebook_pixel_code) {
              var cart = res.data;
              var cart_product = 'cart-' + productId;

              if (model) {
                cart_product += '-' + model;
              }

              var price = '';

              if (cart.products[cart_product]) {
                price = cart.products[cart_product].price;
              }

              fbq('track', 'AddToCart', {
                num_items: quantity,
                content_type: 'product',
                content_ids: [productId],
                currency: 'VND',
                value: price
              });
            }
          }
        });
      });
    });
  });
});

function checkVariation(box, variation) {
  var btnVariationClass = 'js-btn-product-variation';
  var btnVariationSelectedClass = 'product-variation--selected';
  var btnVariationDeactiveClass = 'product-variation--deactive';
  var productVariationClass = 'js-product-variation';
  var btnVariationSelected = $(box).find('.' + btnVariationSelectedClass);
  var productVariation = $(box).find('.js-product-variation');
  var countAttr = variation['count_attrs'];
  var new_variation = variation;
  var values = [];
  btnVariationSelected.each(function () {
    var value = $(this).attr('value');

    if (!values.includes(value)) {
      values.push($(this).attr('value'));
    }
  });
  new_variation = get_variation(values, variation);

  if (values.length + 1 == countAttr) {
    $(box).removeAttr('model');
    $(box).find('.js-btn-product-variation').removeClass(btnVariationDeactiveClass);
    productVariation.each(function () {
      var index = $(this).data('index') - 1;

      if (!$(this).hasClass('active')) {
        $(this).find('.js-btn-product-variation:not(' + btnVariationSelectedClass + ')').each(function () {
          var value = $(this).attr('value');
          var check_values = [].concat(values);
          check_values.splice(index, 0, value);
          var check_variation = get_variation(check_values, variation);

          if (check_variation && typeof check_variation['inventory'] !== 'undefined' && check_variation['inventory'] == 0) {
            $(this).addClass(btnVariationDeactiveClass);
          } else {
            $(this).removeClass(btnVariationDeactiveClass);
          }
        });
      }
    });
  } else if (values.length == countAttr) {
    var model = [];
    values.forEach(function (value) {
      var attr = value.split(":");
      model.push(attr[1]);
    });
    $(box).attr('model', model.join('-'));
    productVariation.each(function () {
      var index = $(this).data('index') - 1;
      $(this).find('.js-btn-product-variation:not(' + btnVariationSelectedClass + ')').each(function () {
        var value = $(this).attr('value');
        var check_values = [].concat(values);
        check_values[index] = value;
        var check_variation = get_variation(check_values, variation);

        if (typeof check_variation['inventory'] !== 'undefined' && check_variation['inventory'] == 0) {
          $(this).addClass(btnVariationDeactiveClass);
        } else {
          $(this).removeClass(btnVariationDeactiveClass);
        }
      });
    });
  } else {
    $(box).removeAttr('model');
    $(box).find('.js-btn-product-variation').removeClass(btnVariationDeactiveClass);
  }

  $('.js-product-inventory').text(new_variation['inventory'] ? new_variation['inventory'] : "0");
  $('.js-plus-minus').data('max', new_variation['inventory']);

  if (new_variation['code']) {
    if (new_variation['price'] <= 0) {
      $('.js-product-price').text("Liên hệ");
      $('.js-product-discount').text("").removeClass('active');
      $('.js-product-discount-percent').text("").removeClass('active');
    } else {
      if (new_variation['price_view']) {
        $('.js-product-price').text(new_variation['price_view']);
      }

      if (new_variation['price'] < new_variation['price_before_discount'] && new_variation['discount_percent'] && new_variation['discount_percent'] != 0 && new_variation['price_discount_view']) {
        $('.js-product-discount').addClass('active').text(new_variation['price_discount_view']);
        $('.js-product-discount-percent').addClass('active').text(new_variation['discount_percent'] + "% giảm");
      }
    }
  } else {
    $('.js-product-discount').removeClass('active').text('');
    $('.js-product-discount-percent').removeClass('active').text('');

    if (new_variation['price_min_view'] && new_variation['price_max_view']) {
      $('.js-product-price').text(new_variation['price_view']);
    }
  }

  var selectCountProduct = $('.js-plus-minus').find('.js-current').val();

  if (selectCountProduct > new_variation['inventory']) {
    $('.js-plus-minus').find('.js-current').val(new_variation['inventory']);
    $('.js-plus-minus').find('.js-current').trigger('change');
  }
}

function get_variation(values, variation) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (index < values.length) {
    var value = values[index];
    index++;
    return index < values.length ? get_variation(values, variation[value], index) : variation[value];
  }

  return variation;
}

function updateCart(url, data) {
  var isBuyNow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return $.ajax({
    type: "POST",
    url: url,
    data: data,
    dataType: "json",
    success: function success(response) {
      if (response.status == 200) {
        $('.js-product-briefing-quantity-error').removeClass('active');
        updateCartHeader(response.data);
        $('#modal-message').trigger('open', response.message);
        $('.js-product-briefing-quantity').trigger('success');
      } else if (isBuyNow && response.data.type == 'error' && response.data.quantity) {
        $('.js-product-briefing-quantity').trigger('success');
      } else {
        $('.js-product-briefing-quantity').trigger('error', response.message);
        $('#modal-message').trigger('open', response.message);
      }
    },
    error: function error(_error) {// console.log(error);
      // cartNotification(response.message);
    }
  });
}

function updateCartHeader(data) {
  var total = data.total_count_selected;
  $('.js-header-cart-number-badge').text(total);

  if (total > 0) {
    $('.js-header-cart-number-badge').show();
  } else {
    $('.js-header-cart-number-badge').hide();
  }

  if (data.header_cart_html) {
    $('.js-header-cart-list-content').trigger('update-data', data.header_cart_html);
  }
}

function plusMinusInit(el) {
  var minus = $(el).find('.js-minus');
  var plus = $(el).find('.js-plus');
  var current = $(el).find('.js-current');
  var value = current.val();
  var self = $(el);
  $(minus).click(function () {
    var min_value = $(el).data('min') ? parseInt($(el).data('min')) : 1;

    if (value > min_value) {
      value--;
      updateValue(current, value);
      current.trigger('change');
    }
  });
  $(plus).click(function () {
    var max_value = $(el).data('max') ? parseInt($(el).data('max')) : 1000000000;

    if (value < max_value) {
      value++;
      updateValue(current, value);
      current.trigger('change');
    }
  });
  current.change(function () {
    var min_value = $(el).data('min') ? parseInt($(el).data('min')) : 1;
    var max_value = $(el).data('max') ? parseInt($(el).data('max')) : 1000000000;
    valueChange = parseInt($(this).val());

    if (valueChange <= max_value && valueChange >= min_value) {
      value = valueChange;
    } else {
      updateValue(current, value);
    }
  });
}

function updateValue(el, value) {
  return el.val(value);
}
