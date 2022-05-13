$(document).ready(function () {
  $(".js-card-favorite").click(function (event) {
    event.preventDefault();
    var product_id = $(this).data('product');
    var parent = $(this);
    var countFavorite = parseInt($(".js-product-total-favorite").html());
    var classFavorite = 'is-favorite';
    $.ajax({
      type: "POST",
      url: "/product/favorite/" + product_id,
      data: {
        product_id: product_id
      },
      dataType: "json",
      success: function success(response) {
        if (response.status == 200) {
          countFavorite = parent.hasClass(classFavorite) ? countFavorite - 1 : countFavorite + 1;
          parent.toggleClass(classFavorite);
          $(".js-product-total-favorite").text(countFavorite);
        }
      }
    });
  });
});
