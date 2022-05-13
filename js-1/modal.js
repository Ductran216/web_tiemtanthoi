$(document).ready(function () {
  $('.js-modal-open').click(function () {
    var modal = $(this).attr('target');
    $('#' + modal).trigger('open');
  });
  $('.js-modal-close').click(function () {
    var modal = $(this).attr('target');
    var inputWrapper = $('.js-modal-voucher').find('.js-input-voucher-wrapper');
    $('#' + modal).trigger('close');
    $('#voucher-code').val('');
    $(inputWrapper).find('.input-with-validator__error-message').remove();
    $("div").removeClass("input-with-validator--error");
  });
  $(this).on('disable-btn-close', function () {
    $(this).find('.js-modal-close').remove();
  });
  $('.js-modal').on('open', function (event) {
    $(this).addClass('active');
  }).on('close', function () {
    $(this).removeClass('active');
  });
  $('.card-link .js-modal-open').click(function (event) {
    event.preventDefault();
  }); // Modal message

  var stautusModalMessage = false;
  $('#modal-message').on('open', function (event, message) {
    stautusModalMessage = true;
    var modal = $(this);
    $(this).find('.js-message-content').html(message);
    $(this).removeClass('fading');
    setTimeout(function () {
      modal.addClass('fading');
      stautusModalMessage = false;
    }, 1500);
    setTimeout(function () {
      if (!stautusModalMessage) {
        modal.removeClass('fading active');
      }
    }, 3000);
  });
});
