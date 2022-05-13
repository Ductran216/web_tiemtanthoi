$(document).ready(function () {
  $('.js-select').each(function () {
    var current = $(this).find('.js-current');
    var options = $(this).find('.js-option');

    if ($(this).find('.active').length > 0) {
      var active = $(this).find('.active'); // var value = active.attr('value');

      if (active.find('.js-option-label').length > 0) {
        var text = active.find('.js-option-label').text();
        current.find('.js-current-label').text(text);
      } else {
        var text = active.text();
        current.text(text);
      }
    }

    options.click(function () {
      // var value = $(this).attr('value');
      // current.attr('value', value);
      if ($(this).find('.js-option-label').length > 0) {
        var text = $(this).find('.js-option-label').text();
        current.find('.js-current-label').text(text);
      } else {
        var text = $(this).text();
        current.text(text);
      }

      options.removeClass('active');
      $(this).addClass('active');
    });
  });
});
