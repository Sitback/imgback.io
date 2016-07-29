var EventArray = function() {
    var arr = [];
    arr.push = function() {
      $('body').trigger('EventArrayPush');
      return Array.prototype.push.apply(this, arguments);
    }
    return arr;
};

$(document).ready(function(){
  var $ = $ || jQuery,
      $deviceBackground = $('.image-background'),
      $source = $('#uploaderFile'),
      downloadImageTrigger = $('#getUnsplashImage'),
      $historyTrigger = $('#getImageHistory, #closeHistory'),
      $imageHistory = $('#imageHistory'),
      $attribution = $('#unsplashAttribution'),
      $overflowCheckboxVisible = $('#overflow-checkbox-wrap'),
      $inputHeight = $('#input-height'),
      $sectionHeightClear = $('#section-height-clear'),
      $toggleBackgroundFill = $('#toggle-bg-fill'),
      $deviceOverflow = $('.overflow'),
      $overflowVisible = $('#overflow-checkbox'),
      $inputBackgroundPosition = $('input[name=bg-position]'),
      $deviceRotate = $('.btn-device-rotate'),
      $inputCustomWidth = $('#custom-device-width'),
      $inputCustomHeight = $('#custom-device-height'),
      $customHeightClear = $('#device-custom-clear'),
      $customWidth = $('.custom, .custom .device-screen'),
      $customHeight = $('.custom, .custom .image-background'),
      $photog = $('#photographerLink'),
      $photo = $('#photoLink'),

      readImage = new FileReader(),
      imageHistoryList = new EventArray(),
      devices = {
        Iphone: {
          name: 'iphone',
          default: true
        },
        S7: {
          name: 's7',
          default: false
        },
        Ipad: {
          name: 'ipad',
          default: true
        },
        SmallDesktop: {
          name: 'small-desktop',
          default: true
        },
        Custom: {
          name: 'custom',
          default: true
        },
        Hdtv: {
          name: 'hdtv',
          default: false
        }
      };

  // Show uploaded image as section background on each device.
  $source.on('change', function () {
    $attribution.hide();
    readImage.onload = function (event) {
      $deviceBackground.css('background-image', 'url('+ event.target.result +')');
      imageHistoryList.push({
        type: 'internal',
        url: event.target.result
      });
    };
    readImage.readAsDataURL(this.files[0]);

    // Only show overlow checkbox if file has been uploaded.
    if ($source.val() != '') {
      $overflowCheckboxVisible.css('display', 'block');
    }
  });

  function checkImageHistory() {
    if (imageHistoryList.length > 0) {
      $historyTrigger.removeAttr('disabled');
    }
  }

  downloadImageTrigger.on('click', function(e) {
    var $target = $(e.target);
    e.preventDefault();

    // disable the button so we can't stack a huge number of downloads.
    $target.attr('disabled', 'true');

    function getUnsplash() { 
      var clientID = "49c7a10631e8603b517d9a263881fbf2f3e27f2a0c3eccceecc1cc3618d0473c",
          collection = "136095",
          width = 2000,
          height = 500;

      $.ajax({
        method: "GET",
        url: "https://api.unsplash.com/photos/random?",
        data: { client_id: clientID, collections: collection, w: width}
      })
      .done(function( img ) {
        $target.removeAttr('disabled').blur();
        $deviceBackground.css('background-image', 'url('+ img.urls.custom +')');
        $photog.attr('href', img.user.links.html).text(img.user.name);
        $attribution.show();
        $photo.attr('href', img.links.html);
        $overflowCheckboxVisible.css('display', 'block');
        imageHistoryList.push({
          type: 'external',
          url: img.urls.custom,
          photographer: {
            user: img.user.name,
            profile: img.user.links.html,
            photoURL: img.links.html
          }
        });
      });
    }
    getUnsplash();

    return false;
  });

  // Toggle Background fill type
  $toggleBackgroundFill.change(function() {
    if ($(this).val() === 'contain') {
      $deviceBackground.css({
        'background-size': 'contain',
        'max-width': '100%'
      });
    }
    else {
      $deviceBackground.css('background-size', 'cover');
      $deviceOverflow.css({
        'background-size': "auto 100%",
        'max-width': 'none',
        'max-height': '100%'
      });
    }
  });

  // Section height set.
  $inputHeight.on('change', function() {
    var newHeight = $inputHeight.val();
    $deviceBackground.css('height', newHeight + 'px');
  });
  $sectionHeightClear.on('click', function () {
    $deviceBackground.css('height', '');
    $inputHeight.val('');
  });

  // Set background position
  $inputBackgroundPosition.on('click', function() {
    var bgPosition = $(this).data('alignment');
    $deviceBackground.removeClass('top center bottom left right');
    $deviceBackground.toggleClass(bgPosition);
  });

  // Show image overflow.
  $overflowVisible.on('click', function() {
    if($(this).prop('checked') == true) {
      $deviceOverflow.css('display', 'block');
    } else  {
      $deviceOverflow.css('display', 'none');
    }
  });

  // Choose device
  function showDevice(e, t) {
    // e: event data
    // t: trigger data
    var $device = $('#' + e.data.device),
        $checkbox = $('#checkbox-' + e.data.device);

    if (!!t && !!t.default) {
      $checkbox.click();
    }
    ($checkbox.prop('checked')) ? $device.show() : $device.hide();
  };

  for (var i in devices) {
    if (devices.hasOwnProperty(i)) {
      $('#checkbox-' + devices[i].name).on('click', {device: devices[i].name},  showDevice).triggerHandler('click', {default: devices[i].default});
    }
  }

  $('body').on('EventArrayPush', function() {
    checkImageHistory();
    var lastImage = imageHistoryList.slice(-1),
        lastImageEl,
        timestamp;
    if (lastImage.length > 0) {
      timestamp = new Date().getTime();

      lastImageEl = lastImage[0];
      
      $img = $('<div id="history_' + timestamp + '_wrapper" class="history_image"><a id="history_' + timestamp + '" title="Reuse this image in the display" class="history_image_item"></a></div>');

      $imageHistory.find('.history_close').after($img);
      
      $('#history_' + timestamp).attr({
        "data-type": lastImageEl.type, 
        "data-url": lastImageEl.url
      }).css({
        "backgroundImage": "url('" + lastImageEl.url + "')"
      });

      if (lastImageEl.type === "external") {
        $('#history_' + timestamp).attr({        
          "data-photo-user": lastImageEl.photographer.user,
          "data-photo-profile": lastImageEl.photographer.profile,
          "data-photo-url": lastImageEl.photographer.photoURL
        });
      }
    }
  })

  $historyTrigger.on('click', function(e) {
    e.preventDefault();
    $imageHistory.toggleClass('inactive');
    return false;
  })

  $('body').on('click', '.history_image_item', function(e) {
    var $target = $(e.target);
    $deviceBackground.css('background-image', 'url('+ $target.data("url") +')');

    if ($target.data('type') === "external") {
      $photog.attr('href', $target.data("photoProfile")).text($target.data("photoUser"));
      $photo.attr('href', $target.data("photoUrl"));
      $attribution.show();
    } else {
      $attribution.hide();
    }
  });

  // Rotate Device
  $deviceRotate.on('click', function () {
    var deviceRotate = $(this).parent('.device-wrapper').find('.device');
    $deviceRotate.toggleClass('landscape');
  });

  // Custom device dimensions
  $inputCustomWidth.on('change', function () {
    var newDeviceWidth = $inputCustomWidth.val();
    $customWidth.css('width', newDeviceWidth + 'px');
  });
  $inputCustomHeight.on('change', function () {
    var newDeviceHeight = $inputCustomHeight.val();
    $(customHeight).css('height', newDeviceHeight + 'px');
  });
  $customHeightClear.on('click', function () {
    $customWidth.css('width', '');
    $customHeight.css('height', '');
    $inputCustomWidth.val('');
    $inputCustomHeight.val('');
  });

  $('[data-toggle="popover"]').popover();
});
