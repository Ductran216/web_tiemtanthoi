$(document).ready(function () {
  dropdown_menu_language(); //Thực hiện thay đổi ngôn ngữ 

  $(".js-change-language").click(function () {
    var name_language = "language";
    var value_language = $(this).data('language');
    var link_image = $(this).find('.js-img-language-flag').attr('src');
    show_language_current(link_image); //Set ngôn ngữ được chọn vào cookies

    setCookie(name_language, value_language, 365);
    window.location.href = "/change-language/" + value_language;
  });
}); //Set cookies cho hành động thay đổi ngôn ngư

function setCookie(name, value, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
} //Hiển thị ngôn ngữ hiện tại


function show_language_current(link_image) {
  $('.js-img-current-language-flag').attr('src', link_image);
}

function dropdown_menu_language() {
  $(".js_dropdown__current").click(function (e) {
    e.preventDefault();
    var dropdown_list = $(".dropdown__list");
    dropdown_list.fadeToggle(300);
    $(".dropdown__list").not(dropdown_list).hide();
    return false;
  });
}
