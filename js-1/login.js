$(document).ready(function () {
  $('.js-single-sign-on').click(function (e) {
    e.preventDefault();
    window.location.href = '/auth/login';
  }); // Login Link

  var btnRegisterLink = $('.js-header').find('.js-register-link');
  var btnLoginLink = $('.js-header').find('.js-login-link');

  if (window.facebook_pixel_code) {
    btnRegisterLink.click(function () {
      fbq('track', 'LoginHeader');
    });
    btnLoginLink.click(function () {
      fbq('track', 'LoginHeader');
    });
    $('.js-footer-cashback-link').click(function () {
      fbq('track', 'LoginCartPage');
    });
    $('.js-footer-cashback-link').click(function () {
      fbq('track', 'LoginCartPage');
    });
    $('.js-cart-page-login').click(function () {
      fbq('track', 'LoginCartPage');
    });
    $('.js-checkout-page-login').click(function () {
      fbq('track', 'LoginInCheckoutPage');
    });
    $('.js-checkout-login-link').click(function () {
      fbq('track', 'LoginCartPage');
    });
  }
});
