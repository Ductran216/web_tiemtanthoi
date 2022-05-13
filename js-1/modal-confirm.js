$(document).ready(function () {
  $('.js-modal-confirm').each(function () {
    var self = $(this);
    $(this).on('show', function (event, title, content) {
      if (title && content) {
        $(this).find('.js-title').text(title);
        $(this).find('.js-content').text(content);
        $(this).addClass('active');
      }
    });
    $(this).find('.js-btn-cancel').click(function () {
      self.removeClass('active');
      $('.js-confirm-show.waiting').trigger('confirm-cancel');
    });
    $(this).find('.js-btn-accept').click(function () {
      self.removeClass('active');
      $('.js-confirm-show.waiting').trigger('confirm-success');
    });
    $(this).find('.js-btn-close').click(function () {
      self.removeClass('active');
      $('.js-confirm-show.waiting').trigger('confirm-cancel');
    });
  });
  $('.js-confirm-show').click(function () {
    var title = $(this).attr('confirm-title');
    var content = $(this).attr('confirm-content');
    $('.js-confirm-show.waiting').removeClass('waiting');
    $(this).addClass('waiting');
    $('.js-modal-confirm').trigger('show', [title, content]);
  });
});
