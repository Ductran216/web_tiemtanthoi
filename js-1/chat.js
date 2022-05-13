$(document).ready(function () {
  var chatListScroll = true;
  $('.js-chat').each(function () {
    var chat = $(this);
    var chatHeader = $(this).find('.js-chat-header');
    var chatHeaderCollapse = chatHeader.find('.js-chat-header-collapse');
    var chatList = $(this).find('.js-chat-list');
    var first = true;
    var isLogged = chat.hasClass('js-chat-live');

    if (isLogged) {
      // Send Message
      initialSendMessage(chat); // Send image

      initialSendImage(chat); // Send product

      initialSendProduct(chat); // Send Order

      initialSendOrder(chat);
    } else {
      var form = chat.find('.js-conversation-form');
      form.submit(function (e) {
        e.preventDefault();
      });
    } // Show chat


    chatHeader.click(function (e) {
      if (!chatHeaderCollapse[0].contains(e.target) && !chat.hasClass('active')) {
        chat.addClass('active');
      }

      if (first && isLogged) {
        // Get Message
        initialGetMessage(chat);
        first = false; // Add facebook pixel

        if (window.facebook_pixel_code) {
          fbq('track', 'AppChatOpen');
        }
      }
    }); // Close Chat

    chatHeaderCollapse.click(function () {
      if (chat.hasClass('active')) {
        chat.removeClass('active');
      }
    });
  });

  function initialSendImage(chatBox) {
    var form = chatBox.find('.js-form-send-image');
    var inputImage = form.find('.js-input-get-image');
    var btnGetImage = form.find('.js-btn-get-image'); // Trigger input image

    btnGetImage.click(function () {
      inputImage.trigger('click');
    });
    inputImage.change(function () {
      form.submit();
    });
    form.submit(function (e) {
      e.preventDefault();
      var formData = new FormData($(this)[0]);
      send_message_with_formdata(formData, false, false);
      inputImage.val('');
    });
  }

  function initialSendProduct(chatBox) {
    var sendProduct = chatBox.find('.js-conversation-send-product');
    var btnShowPopup = sendProduct.find('.js-conversation-send-product-btn');
    var popup = sendProduct.find('.js-conversation-send-product-popup');
    var inputSearch = sendProduct.find('.js-conversation-input-search-product');
    var listProduct = sendProduct.find('.js-conversation-send-product-list');
    var popupOverlay = sendProduct.find('.js-conversation-send-product-popup-overlay'); // Show Popup

    btnShowPopup.click(function () {
      sendProduct.toggleClass('active');
    }); // Close Popup

    popupOverlay.click(function () {
      sendProduct.removeClass('active');
    });
  }

  function initialSendOrder(chatBox) {
    var sendOrder = chatBox.find('.js-conversation-send-order');
    var btnShowPopup = sendOrder.find('.js-conversation-send-order-btn');
    var popup = sendOrder.find('.js-conversation-send-order-popup');
    var inputSearch = sendOrder.find('.js-conversation-input-search-order');
    var listProduct = sendOrder.find('.js-conversation-send-order-list');
    var popupOverlay = sendOrder.find('.js-conversation-send-order-popup-overlay'); // Show Popup

    btnShowPopup.click(function () {
      sendOrder.toggleClass('active');
    }); // Close Popup

    popupOverlay.click(function () {
      sendOrder.removeClass('active');
    });
  }

  function initialSendMessage(chatBox) {
    var form = chatBox.find('.js-conversation-form');
    var textarea = form.find('.js-conversation-form-textarea');
    form.submit(function (e) {
      e.preventDefault();
      var data = {
        message: textarea.val()
      };
      send_message(data);
      textarea.val('');
    }); // Set height for textarea

    textarea.on('change keyup keydown paste cut', function () {
      $(this).height(0).height(this.scrollHeight);
    });
    textarea.keypress(function (e) {
      if (e.which == 13 && !e.shiftKey) {
        e.preventDefault();
        form.submit();
      }
    });
    textarea.keydown(function (e) {
      if (e.which == 13 && e.altKey) {
        this.value += "\n";
      }
    });
  }

  function initialGetMessage(chatBox) {
    var chatList = chatBox.find('.js-chat-list');
    var latest_message_id; // Get list first message

    var getListMessage = get_message();
    getListMessage.done(function (response) {
      if (response.status == 200) {
        if (response.data.group_message_html) {
          chatList.prepend(response.data.group_message_html).scrollTop(chatList[0].scrollHeight);
          latest_message_id = chatList.find('.js-conversation-message').last().attr('message-id');

          if (latest_message_id) {
            pollingMessage(chatList, latest_message_id);
          }
        } else {
          pollingMessage(chatList);
        }
      }
    });
    chatList.scroll($.debounce(500, function (e) {
      if (chatList.scrollTop() - 200 < 0) {
        // Get list first message
        var firstMessage = chatList.find('.js-conversation-message').first();
        var oldest_message_id = firstMessage.attr('message-id');
        var lastScrollHeight = chatList[0].scrollHeight;
        var data = {
          oldest_message_id: oldest_message_id
        };
        var getListMessage = get_message(data);
        getListMessage.done(function (response) {
          if (response.status == 200 && response.data.group_message_html) {
            chatList.prepend(response.data.group_message_html).scrollTop(chatList[0].scrollHeight - lastScrollHeight);
          }
        });
      }

      if (chatList[0].scrollHeight - chatList.scrollTop() > 200) {
        chatListScroll = true;
      }
    }));
  }

  function pollingMessage(chatList) {
    var latest_message_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var data = {};

    if (latest_message_id) {
      data.latest_message_id = latest_message_id;
    }

    var xhr = get_message(data).done(function (response) {
      if (response.status == 200) {
        if (response.data.group_message_html) {
          var scroll = chatList.scrollTop() + 100 >= chatList[0].scrollHeight;
          chatList.append(response.data.group_message_html);

          if (chatListScroll) {
            chatList.scrollTop(chatList[0].scrollHeight);
            chatListScroll = false;
          }
        }

        latest_message_id = chatList.find('.js-conversation-message').last().attr('message-id');

        if (latest_message_id) {
          setTimeout(function () {
            pollingMessage(chatList, latest_message_id);
          }, 1000);
        } else {
          setTimeout(function () {
            pollingMessage(chatList);
          }, 1000);
        }
      }
    });
    $(window).bind('beforeunload', function () {
      xhr.abort();
    });
  }

  function send_message(data) {
    return $.ajax({
      type: "POST",
      url: '/message/store',
      data: data,
      dataType: "json",
      success: function success(response) {
        chatListScroll = true;
        return true;
      },
      error: function error(_error) {
        console.log(_error);
      }
    });
  }

  function send_message_with_formdata(data) {
    return $.ajax({
      type: "POST",
      url: '/message/store',
      data: data,
      dataType: "json",
      contentType: false,
      processData: false,
      success: function success(response) {
        chatListScroll = true;
        return true;
      },
      error: function error(_error2) {
        console.log(_error2);
      }
    });
  }

  function get_message() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var latest_message_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return $.ajax({
      type: "GET",
      url: '/message/index' + (latest_message_id ? '/' + latest_message_id : ''),
      data: data,
      dataType: "json",
      success: function success(response) {},
      error: function error(_error3) {
        console.log(_error3);
      }
    });
  }
});
