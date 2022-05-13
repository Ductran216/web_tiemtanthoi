$(document).ready(function () {
  $(".js-btn-add-cart").click(function (event) {
    event.preventDefault();
    var product_id = $(this).data('product');
    $.ajax({
      type: "POST",
      url: "/cart/add/" + product_id,
      data: {
        quantity: 1,
        product_id: product_id
      },
      dataType: "json",
      success: function success(response) {
        var data = response.data;

        if (response.status == 200) {
          updateCartHeader(data);
          $('#modal-message').trigger('open', response.message); // Add facebook pixel

          var cart_product = 'cart-' + product_id;
          var price = '';

          if (data.products[cart_product]) {
            price = data.products[cart_product].price;
          }

          if (window.facebook_pixel_code) {
            fbq('track', 'AddToCart', {
              num_items: 1,
              content_type: 'product',
              content_ids: [product_id],
              currency: 'VND',
              value: price
            });
          }
        } else if (response.status == 402 && data.error == 'missing_attrs' && data.html && data.variations) {
          $('#model-attrs').trigger('open', [data.html, data.variations]);
        } else if (response.status == 401) {
          $('#modal-message').trigger('open', response.message);
          window.location.href = '/auth/login';
        } else {
          $('#modal-message').trigger('open', response.message);
        }
      }
    });
  });
});

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
