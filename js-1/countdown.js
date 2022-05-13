$(document).ready(function () {
  if ($('.js-countdown').length && typeof moment != 'undefined') {
    var converNumber = function converNumber(number) {
      return number > 9 ? number : number <= 0 ? "00" : "0" + number;
    };

    $('.js-countdown').each(function () {
      var endIn = $(this).data('end-in');
      var countDownDate = moment(endIn).format('x');
      var now = moment().format('x');
      var distance = countDownDate - now;
      var countdown = $(this);
      var days = countdown.find('.js-days');
      var hours = countdown.find('.js-hours');
      var minutes = countdown.find('.js-minutes');
      var seconds = countdown.find('.js-seconds'); // Update the count down every 1 second

      var play = setInterval(function () {
        if (distance < 0) {
          clearInterval(play);
        } // Time calculations for days, hours, minutes and seconds


        var day = converNumber(Math.floor(distance / (1000 * 60 * 60 * 24)));
        var hour = converNumber(Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
        var minute = converNumber(Math.floor(distance % (1000 * 60 * 60) / (1000 * 60)));
        var second = converNumber(Math.floor(distance % (1000 * 60) / 1000)); // Output the result in an element

        days.text(day);
        hours.text(hour);
        minutes.text(minute);
        seconds.text(second);
        distance -= 1000;
      }, 1000);
    });
  }
});
