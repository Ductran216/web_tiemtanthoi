$(document).ready(function () {
  $('.js-searchbar').each(function (index) {
    var _this = this;

    // Set width for search list
    var input = $(this).find('.js-searchbar-input');
    var list = $(this).find('.js-searchbar-list');
    var searchBarHeader = list.find('.js-searchbar-list-header');
    var withInput = input.width();
    var focusClass = 'tickid-searchbar--focus';
    var btnSubmit = $(this).find('.js-submit-search-bar');

    if ($(window).innerWidth() < 576) {
      list.css({
        'width': '100%'
      });
    } else {
      list.css({
        'width': input.width() + 'px'
      });
    }

    input.focus(function () {
      $(_this).addClass(focusClass);
    }).focusout(function (e) {
      $(_this).removeClass(focusClass);
    });
    $(window).resize(function (e) {
      if ($(window).innerWidth() < 576) {
        list.css({
          'width': '100%'
        });
      } else {
        list.css({
          'width': input.width() + 'px'
        });
      }
    });
    var form = $(this).find('form');
    var history = localStorage.getItem('search-history');
    var historyItem = "<a class=\"tickid-searchbar-hints__history-entry\" href=\"{history_item_link}\">\n\t\t\t<div class=\"tickid-searchbar-hints__history-entry__text\">\n\t\t\t\t<span class=\"tickid-searchbar-hints__history-entry__typed-text\"></span>\n\t\t\t\t<span class=\"\">{history_item_title}</span>\n\t\t\t</div>\n\t\t</a>";

    if (!history) {
      history = [];
    } else {
      history = JSON.parse(history); // Set history search

      var html = '';
      history.forEach(function (content) {
        var link = '/all' + jQuery.query.set('s', content);
        html += historyItem.replace('{history_item_link}', link).replace('{history_item_title}', content);
      });
      searchBarHeader.after(html);
    }

    btnSubmit.click(function () {
      form.trigger('submit');
    }); // Submit form save search history

    form.submit(function () {
      event.preventDefault();
      var search = $.trim($('.js-searchbar-input').val());
      search = $(search).text();

      if (search) {
        var index = history.indexOf(search);

        if (index > -1) {
          history.splice(index, 1);
          history.unshift(search);
        } else {
          if (history.length >= 5) {
            history.shift();
          }

          history.unshift(search);
        } // Add facebook pixel


        if (window.facebook_pixel_code) {
          fbq('track', 'Search', {
            search: search
          });
        }
      }

      localStorage.setItem('search-history', JSON.stringify(history));
      $(this).unbind('submit').submit();
    });
    $('.js-option').click(function (event) {
      var link = $(this).hasClass('js-searchbar-option-category') ? location.href : '/all';
      $(".tickid-searchbar-input").attr('action', link);
    });
  });
});
