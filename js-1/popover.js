$(document).ready(function () {
  $('.js-popover').each(function () {
    var toggle = $(this).find('.js-popover-toggle');
    var content = $(this).find('.js-popover-content');
    $(this).hover(function (e) {
      content.toggleClass('stardust-popover__popover--show active');
    });
  });
});
