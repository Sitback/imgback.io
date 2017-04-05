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

      $('#test_link').on('click', function() {
        window.location = '/img/2L9A2117-High.jpg';
      });


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
    } else {
      ga('send', 'event', 'devices', 'off', $this.data('device'));
      $(e.data.device).css({
        'display': 'none'
      });
    }
  };

  function triggerDevice(e) {
    var target = $(e.target);
    var dev = target.data('device');
    var device = $('#checkbox-' + dev);
    device.trigger('click');
    if (!!device.prop('checked')) {
      target.removeClass('btn-default').addClass('btn-primary').removeClass('outline');
      target.find("span.fa").removeClass("hidden");
    } else {
      target.addClass('btn-default').removeClass('btn-primary').addClass('outline');      
      target.find("span.fa").addClass("hidden");
    }
  }

  $('.start-button').on('click', triggerDevice);

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

  function CalculateAndTransform(){
    var device = $(".device.custom");
    var customParent = $("div#custom.device-wrapper");
    var width = customParent.width() - 80;
    var scale = width / $(device).width();
    var height = customParent.height() * scale;

    if(scale < 1.0){
        var translateX = (($(device).width() - width) / 2) * 100 / width;
        var translateY = (($(device).height() - height) / 2) * 100 / height;
        $(device).css('transform', "scale(" + scale + ") translate(-" + translateX + "%, -" + translateY + "%)");
    }
  }  

  $(customHeightClear).on('click', function () {
    $(customWidth).css('width', '');
    $(customHeight).css('height', '');
    $(inputCustomWidth).val('');
    $(inputCustomHeight).val('');
  });

  $('[data-toggle="popover"]').popover();
});
