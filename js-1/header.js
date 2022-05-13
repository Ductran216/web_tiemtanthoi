$(document).ready(function () {
  var breakpointM = 576;
  var breakpointSM = 800;
  $('.js-toggle-header-menu').each(function () {
    var target = "#" + $(this).attr('data-target');
    $(this).click(function () {
      if ($(target).hasClass('active')) {
        $(target).removeClass('active');
      } else {
        $('.js-header-menu').removeClass('active');
        $(target).addClass('active');
      }
    });
    $(target).find('.js-header-menu-overlay').click(function () {
      $(target).removeClass('active');
    });
  });
  $('.js-toggle-header-search').each(function () {
    var target = "#" + $(this).attr('data-target');
    $(this).click(function () {
      $(target).toggleClass('active');
    });
  });
  $(window).on('resize', function () {
    var widthWindows = $(window).innerWidth();
    var heightWindows = $(window).innerHeight();
    var breakpoint = $('.js-header-menu').data('break-point') ? $('.js-header-search').data('break-point') : breakpointM;

    if (widthWindows >= breakpointM) {
      $('.js-header-search').removeClass('active');
    }

    if (widthWindows >= breakpoint) {
      $('.js-header-menu').removeClass('active');
    }
  });
  $('.js-header-menu').each(function () {
    var menu = $(this);
    var category = $(this).find('.category');
    var categoryHasChildrend = $(this).find('.category.category--has-children');
    var icon = $(this).find('.js-category-link-icon');
    icon.click(function (e) {
      e.preventDefault();
      var categories = $(this).parent().next('.js-categories');
      var category = $(this).parent().parent();

      if (category.hasClass('category--active')) {
        categories.slideUp(500, function () {});
        category.removeClass('category--active');
      } else {
        categories.slideDown(500, function () {});
        category.addClass('category--active');
      }
    });
  }); // Fixed header 

  $('.js-header').each(function () {
    var header = $(this);
    var heightHeader = $(this).innerHeight();

    if ($('body').hasClass('theme-header-fixed')) {
      if ($(window).innerWidth() < breakpointSM) {
        var heightHeaderTop = $('.js-header-top').innerHeight();
        $(window).scroll(function () {
          var scroll = $(window).scrollTop();
          var top = scroll >= heightHeaderTop ? -heightHeaderTop : -scroll;
          header.css('top', top + 'px');
          $('.js-main').css('padding-top', heightHeader + top + 'px');
        });
        $('.js-main').css('padding-top', heightHeader + 'px');
      } else {
        $('.js-main').css('padding-top', heightHeader + 'px');
      }
    }
  });
  $('.tickid-filter-mobile').each(function () {
    var filterMobile = $(this);

    if ($('body').hasClass('theme-header-fixed') && $(window).innerWidth() < breakpointSM) {
      var heightHeaderTop = $('.js-header-top').innerHeight();
      $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        var top = 94 + (scroll >= heightHeaderTop ? -heightHeaderTop : -scroll);
        filterMobile.css('top', top + 'px');
      });
    }
  });
});
