$(document).ready(function () {
  $('.js-categories-menu').each(function () {
    var menu = $(this);
    var category = $(this).find('.js-category');
    var categoryHasChild = $(this).find('.js-category.category--has-children');
    categoryHasChild.hover(function () {
      var categoriesChild = $(this).find('.js-categories').first();
      var offset = $(this).offset();
      var top = offset.top - $(window).scrollTop();
      var left = offset.left + $(this).innerWidth();
      categoriesChild.addClass('children-active');
      categoriesChild.css({
        position: 'fixed',
        top: top,
        left: left
      });
    }); // .mouseleave(function () {
    // 	var categoriesChild = $(this).find('.js-categories').first();
    // 	categoriesChild.removeAttr('style');
    // 	categoriesChild.removeClass('children-active');
    // })
    // $(window).scroll(function(){
    // 	var categoriesActive = $('.js-categories.children-active').first();
    // 	if (categoriesActive.length > 0) {
    // 		var categoryParent = categoriesActive.parent();
    // 		var offset = $(categoryParent).offset();
    // 		var top = offset.top - $(window).scrollTop();
    // 		categoriesActive.css({
    // 			top: top,
    // 		})
    // 	}
    // })
  });
});
