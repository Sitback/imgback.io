$(document).ready(function(){
  var deviceBackground = '.image-background',
      source = '#uploaderFile',
      readImage = new FileReader(),
      inputHeight = '#input-height',
      sectionHeightClear = '#section-height-clear',
      toggleBackgroundFill = '[name="background-type"]',
      inputBackgroundPosition = 'input[name=bg-position]',
      deviceIphone = 'iphone',
      deviceS7 = 's7',
      deviceIpad = 'ipad',
      deviceSmallDesktop = 'small-desktop',
      deviceCustom = 'custom',
      deviceHdtv = 'hdtv',
      overflowCheckboxVisible = '#overflow-checkbox-wrap',
      overflowVisible = '#overflow-checkbox',
      deviceOverflow = '.overflow',
      deviceRotate = '.btn-device-rotate',
      inputCustomWidth = '#custom-device-width',
      inputCustomHeight = '#custom-device-height',
      customHeightClear = '#device-custom-clear',
      customWidth = '.custom, .custom .device-screen',
      customHeight = '.custom, .custom .image-background',
      helpIcon = '.icon.help';

  // Show uploaded image as section background on each device.
  $(source).on('change', function () {
    readImage.onload = function (event) {
      $(deviceBackground).css('background-image', 'url('+ event.target.result +')');
    };
    readImage.readAsDataURL(this.files[0]);

    // Only show overlow checkbox if file has been uploaded.
    if ($(source).val() != '') {
      $(overflowCheckboxVisible).css('display', 'block');
    }
  });

  $(helpIcon).on('click', function() {
    var $this = $(this);
    $this.toggleClass('active');
    $this.parents('.sidebar-item').find('.panel.help').toggleClass('active');
  });

  // Toggle Background fill type
  $(toggleBackgroundFill).click(function() {
    if ($(this).val() === 'contain') {
      $(deviceBackground).css({
        'background-size': 'contain',
        'max-width': '100%'
      });
    } else {
      $(deviceBackground).css('background-size', 'cover');
      $(deviceOverflow).css({
        'background-size': "auto 100%",
        'max-width': 'none',
        'max-height': '100%'
      });
    }
  });

  // Section height set.
  $(inputHeight).on('change', function() {
    var newHeight = $(inputHeight).val();
    ga('send', 'event', 'sectionHeight', 'changed', newHeight + 'px');
    $(deviceBackground).css('height', newHeight + 'px');
  });
  $(sectionHeightClear).on('click', function () {
    $(deviceBackground).css('height', '');
    $(inputHeight).val('');
  });

  // Set background position
  $(inputBackgroundPosition).on('click', function() {
    var bgPosition = $(this).data('alignment');
    ga('send', 'event', 'bgPosition', 'on', bgPosition);
    $(deviceBackground).removeClass('top center bottom left right');
    $(deviceBackground).toggleClass(bgPosition);
  });

  // Show image overflow.
  $(overflowVisible).on('click', function() {
    if($(this).prop('checked') == true) {
      $(deviceOverflow).css('display', 'block');
    } else  {
      $(deviceOverflow).css('display', 'none');
    }
  });

  // Choose device
  function showDevice(e) {
    var $this = $(this);
    if($this.prop('checked') == true) {
      ga('send', 'event', 'devices', 'on', $this.data('device'));
      $(e.data.device).css({
        'display': 'block'
      });
      CalculateAndTransform($(e.data.device).find(".device"));
    } else {
      resetTransform($(e.data.device).find(".device"));
      ga('send', 'event', 'devices', 'off', $this.data('device'));
      $(e.data.device).css({
        'display': 'none'
      });
    }
  };

  function triggerDevice(e) {
    // stop the event from bubbling if we click an element inside the target
    e.stopPropagation();

    var $target = $(e.target);
    var device;

    if (!$target.hasClass('start-button')) {
      // reset the target to be the container we want to act 
      // on if we click inside the target
      $target = $target.parents('.start-button');
    }

    device = $('#checkbox-' + $target.data('device'));

    device.trigger('click');

    if (device.prop('checked')) {
      $target.removeClass('outline').addClass('active');;
    } else {
      $target.addClass('outline').removeClass('active');;      
    }
  };

  $('.start-button, .start-button > *').on('click', triggerDevice);

  $('#checkbox-' + deviceIphone)
    .on('click init', {device: '#' + deviceIphone}, showDevice)
    .trigger('init');
  $('#checkbox-' + deviceS7)
    .on('click init', {device: '#' + deviceS7}, showDevice)
    .trigger('init');
  $('#checkbox-' + deviceIpad)
    .on('click init', {device: '#' + deviceIpad}, showDevice)
    .trigger('init');
  $('#checkbox-' + deviceSmallDesktop)
    .on('click init', {device: '#' + deviceSmallDesktop}, showDevice)
    .trigger('init');
  $('#checkbox-' + deviceHdtv)
    .on('click init', {device: '#' + deviceHdtv}, showDevice)
    .trigger('init');
  $('#checkbox-' + deviceCustom)
    .on('click init', {device: '#' + deviceCustom}, showDevice)
    .trigger('init');

  // Rotate Device
  $(deviceRotate).on('click', function () {
    var deviceRotate = $(this).parent('.device-wrapper').find('.device');
    $(deviceRotate).toggleClass('landscape');
    var $this = $(this);
    CalculateAndTransform($this.siblings(".device"));
  });

  // Custom device dimensions
  $(inputCustomWidth).on('change', function () {
    var newDeviceWidth = $(inputCustomWidth).val();
    $(customWidth).css('width', newDeviceWidth + 'px');
    //calculate transform
    CalculateAndTransform();
  });
  $(inputCustomHeight).on('change', function () {
    var newDeviceHeight = $(inputCustomHeight).val();
    $(customHeight).css('height', newDeviceHeight + 'px');
    //calculate transform
    CalculateAndTransform();
  });

  function fitToDevice(selector) {
    var element = selector.get(0);
    var scaleX = element.getBoundingClientRect().width / element.offsetWidth;
    var $parent = $(selector).parents('.device-wrapper');
    var $headerHeight = $parent.find('h4').height();

    $parent.css({
      height: ($parent.height() * scaleX) + $headerHeight
    })
    $parent.find('span.scaled-value').html('(scaled ' + scaleX.toFixed(2) + 'x)');
  }

  function resetTransform(device) {
    var device = device || '.device.custom';
    var $device = $(device);
    var transform = "scale(1) translate(0, 0)";
    $device.css('transform', transform);  
    $device.parents('.device-wrapper').css({
      height: 'auto'
    });
    $device.parents('.device-wrapper').find('span.scaled-value').empty();
  }

  function CalculateAndTransform(device){
    var device = device || $(".device.custom");
    resetTransform(device);
    var customParent = $(device).closest("div.device-wrapper");
    var width = customParent.width();
    var deviceWidth =  $(device).width() + parseInt($(device).css('borderLeft')) + parseInt($(device).css('borderRight'));
    if (width < deviceWidth) {
      var scale = width / deviceWidth;
      var height = customParent.height() * scale;

      var translateX = ((deviceWidth - width) / 2) * 100 / width;
//      var translateY = (($(device).height() - height) / 2) * 100 / height;
      var translateY = 0;
      var transform = "scale(" + scale + ") translate(" + ((-1) * translateX) + "%, " + ((-1) * translateY) + "%)";
      $(device).css('transform', transform);
      fitToDevice(device);    
    }
  }  

  $(customHeightClear).on('click', function () {
    $(customWidth).css('width', '');
    $(customHeight).css('height', '');
    $(inputCustomWidth).val('');
    $(inputCustomHeight).val('');
  });
});
