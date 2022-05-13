$(document).ready(function () {
  $('.js-btn-zalo').click(function () {
    // Add facebook pixel
    if (window.facebook_pixel_code) {
      fbq('track', 'ZaloContact');
    }
  });
  $('.js-btn-messenger').click(function () {
    // Add facebook pixel
    if (window.facebook_pixel_code) {
      fbq('track', 'MessengerContact');
    }
  });
  $('.js-btn-hotline').click(function () {
    // Add facebook pixel
    if (window.facebook_pixel_code) {
      fbq('track', 'CallHotline');
    }
  });
});
