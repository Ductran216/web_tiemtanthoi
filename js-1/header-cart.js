$(document).ready(function () {
  var breakpointM = 576;
  var breakpointSM = 800;
  $('.js-header-cart').each(function () {
    var headerHeight = $('.js-header').height();
    var self = $(this);

    if (!$('body').hasClass('theme-header-fixed')) {
      $(window).on('scroll', function () {
        if ($(window).scrollTop() > headerHeight) {
          self.addClass('fixed');
        } else {
          self.removeClass('fixed');
        }
      });
    } else {
      // Trigger Active header cart
      $(this).on('active', function () {
        if ($(window).innerWidth() < breakpointSM) {} else {
          var heightHeader = $('.js-header').innerHeight();
          var positionHeader = $('.js-header').position();
          $(this).find('.js-header-cart-list-content').css('top', heightHeader + positionHeader.top);
          $(this).find('.js-header-cart-list-content').css('height', 'calc(100vh - ' + (heightHeader + positionHeader.top) + 'px)');
        }

        $(this).addClass('active');
      });
    } // Trigger Active header cart


    $(this).on('deactive', function () {
      $(this).removeClass('active');
    }); // Add facebook pixel

    if (window.facebook_pixel_code) {
      $(this).mouseenter(function () {
        fbq('track', 'QuickViewCart');
      });
    }

    $(this).find('.js-header-cart-wrapper').click(function () {
      self.trigger('deactive');
    });
  });
  $('.js-header-cart-list-content').each(function () {
    $(this).on('update-data', function (event, html) {
      if ($(this).hasClass('js-header-cart-list-content--checkout')) {
        $('.js-header-cart').trigger('active');
      }

      if (html) {
        $(this).html(html);
        initialHeaderCart();
      }
    });
    initialHeaderCart();
  });

  function initialHeaderCart() {
    headerCartContent = $('.js-header-cart-list-content');
    headerCartContent.find('.js-header-cart-item-product').each(function () {
      initialHeaderProductCart($(this));
    });
    var btnCheckout = headerCartContent.find('.js-btn-cart-checkout');
    btnCheckout.click(function () {
      $(this).attr("disabled", true);
      var order = {};
      order.products = [];
      headerCartContent.find('.js-header-cart-item-product').each(function () {
        var model = $(this).attr("data-model");
        var quantity = $(this).find('.js-plus-minus .js-current').val();
        var productId = $(this).attr('data-product');
        product = {
          'product_id': productId,
          'quantity': quantity
        };

        if (model !== "" && model !== undefined) {
          product.model = model;
        }

        order.products.push(product);
      });
      var data = {
        order: order
      };
      return $.ajax({
        type: "POST",
        url: '/cart/confirm',
        data: data,
        dataType: "json",
        success: function success(response) {
          // console.log(response);
          if (response.status == 200) {
            updateCartHeader(response.data);
            location.href = '/cart/checkout?state=' + response.data.state;
          }

          btnCheckout.attr("disabled", false);
        },
        error: function error(_error) {
          btnCheckout.attr("disabled", false);
        }
      });
    }); // Button close 

    headerCartContent.find('.js-btn-close-header-cart').click(function () {
      $('.js-header-cart').trigger('deactive');
    });
  }

  function initialHeaderProductCart(el) {
    var productId = $(el).attr('data-product');
    var btnRemove = $(el).find('.js-header-cart-btn-remove-product');
    var model = $(el).attr('data-model');
    var plus_minus = $(el).find('.js-plus-minus');
    var inputUpdateCart = $(el).find('.js-input-update-cart');
    initRemoveProductHeaderCart(btnRemove, productId, model);
    initChangeProductHeaderCart(plus_minus); // initUpdateProductInCart(inputUpdateCart);

    if (inputUpdateCart.length > 0) {
      inputUpdateCart.change(function () {
        var quantity = $(this).val();
        var data = {
          product_id: productId,
          quantity: quantity
        };

        if (model !== "" && model !== undefined) {
          data.model = model;
        }

        if (parseInt(quantity) <= 0) {
          if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng ? ")) {
            var products = [];
            products.push(data);
            updateCart('/cart/update_product', {
              order: {
                products: products
              }
            }).done(function (res) {
              if (res.status == 200) {
                // Add facebook pixel
                if (window.facebook_pixel_code) {
                  fbq('track', 'CustomizeProductRemove', {
                    quantity: 0,
                    productId: productId
                  });
                }
              } // location.href = '/cart';

            });
          } else {// Không reload cart khi confirm cancel
            // location.href = '/cart';
          }
        } else {
          updateCart('/cart/update', data).done(function (res) {
            if (res.status !== 200 && res.data.type == 'error' && res.data.quantity) {
              productCart.find('.js-plus-minus').find('.js-current').val(res.data.quantity);
            }

            if (res.status == 200) {
              // Add facebook pixel
              if (window.facebook_pixel_code) {
                fbq('track', 'CustomizeProductUpdate', {
                  quantity: quantity,
                  productId: productId
                });
              }
            }
          });
        }
      });
    }
  }

  function initChangeProductHeaderCart(el) {
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

  function initRemoveProductHeaderCart(el, productId, model) {
    el.click(function () {
      var products = [];
      var product = {
        product_id: productId,
        quantity: 0
      };

      if (model !== "" && model !== undefined) {
        product.model = model;
      }

      products.push(product);
      updateCart('/cart/update_product', {
        order: {
          products: products
        }
      });
    });
  }

  function updateCart(url, data) {
    return $.ajax({
      type: "POST",
      url: url,
      data: data,
      dataType: "json",
      success: function success(response) {
        if (response.status == 200) {
          updateCartHeader(response.data);
        }

        $('#modal-message').trigger('open', response.message);
      },
      error: function error(_error2) {
        console.log('error'); // cartNotification(response.message);
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

  $('.js-header-cart-drawer-button').click(function () {
    if ($('.js-header-cart').hasClass('active')) {
      // console.log('deactive');
      $('.js-header-cart').trigger('deactive');
    } else {
      // console.log('active');
      $('.js-header-cart').trigger('active');
    }
  });

  function updateValue(el, value) {
    return el.val(value);
  }
});
