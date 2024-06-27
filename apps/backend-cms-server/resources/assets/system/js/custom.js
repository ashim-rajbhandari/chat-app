$(document).ready(function () {
  removeForMutation();
  $('input:visible:enabled:first').focus();
  $("button").click(function () {
    $("#successMessage").hide();
    $("#errorMessage").hide();
  });
});

$(function () {
  'use strict'
    

  // ______________Main-navbar
  if (window.matchMedia('(min-width: 992px)').matches) {
    $('.main-navbar .active').removeClass('show');
    $('.main-header-menu .active').removeClass('show');
  }
  $('.main-header .dropdown > a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('show');
    $(this).parent().siblings().removeClass('show');
  });
  $('.mobile-main-header .dropdown > a').on('click', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('show');
    $(this).parent().siblings().removeClass('show');
  });
  $('.main-navbar .with-sub').on('click', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass('show');
    $(this).parent().siblings().removeClass('show');
  });
  $('.dropdown-menu .main-header-arrow').on('click', function (e) {
    e.preventDefault();
    $(this).closest('.dropdown').removeClass('show');
  });
  $('#mainNavShow').on('click', function (e) {
    e.preventDefault();
    $('body').toggleClass('main-navbar-show');
  });
  $('#mainContentLeftShow').on('click touch', function (e) {
    e.preventDefault();
    $('body').addClass('main-content-left-show');
  });
  $('#mainContentLeftHide').on('click touch', function (e) {
    e.preventDefault();
    $('body').removeClass('main-content-left-show');
  });
  $('#mainContentBodyHide').on('click touch', function (e) {
    e.preventDefault();
    $('body').removeClass('main-content-body-show');
  });
  $('body').append('<div class="main-navbar-backdrop"></div>');
  $('.main-navbar-backdrop').on('click touchstart', function () {
    $('body').removeClass('main-navbar-show');
  });


  // ______________Dropdown menu
  $(document).on("click touchstart", function (e) {
    (e.stopPropagation(),$(e.target).closest(".main-header .dropdown").length || $(".main-header .dropdown").removeClass("show"), window.matchMedia("(min-width: 992px)").matches) ? ($(e.target).closest(".main-navbar .nav-item").length || $(".main-navbar .show").removeClass("show"), $(e.target).closest(".main-header-menu .nav-item").length || $(".main-header-menu .show").removeClass("show"), $(e.target).hasClass("main-menu-sub-mega") && $(".main-header-menu .show").removeClass("show")) : $(e.target).closest("#mainMenuShow").length || $(e.target).closest(".main-header-menu").length || $("body").removeClass("main-header-menu-show");
  })
  $("#mainMenuShow").on("click", function (e) {
    e.preventDefault()
    $("body").toggleClass("main-header-menu-show");
  })
  $(".main-header-menu .with-sub").on("click", function (e) {
    e.preventDefault()
    $(this).parent().toggleClass("show")
    $(this).parent().siblings().removeClass("show");
  })
  $(".main-header-menu-header .close").on("click", function (e) {
    e.preventDefault()
    $("body").removeClass("main-header-menu-show");
  });

  // ______________Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // ______________Toast
  $(".toast").toast();

  // ______________Back-top-button
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 0) {
      $('#back-to-top').fadeIn('slow');
    } else {
      $('#back-to-top').fadeOut('slow');
    }
  });
  $(document).on("click", "#back-to-top", function () {
    $("html, body").animate({
      scrollTop: 0
    }, 600);
    return false;
  });
  // ______________Full screen
  $(document).on("click", ".fullscreen-button", function toggleFullScreen() {
    $('html').addClass('fullscreen');
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      $('html').removeClass('fullscreen');
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  });
  // ______________Cover Image
  $(".cover-image").each(function () {
    let attr = $(this).attr('data-image-src');
    if (typeof attr !== typeof undefined && attr !== false) {
      $(this).css('background', 'url(' + attr + ') center center');
    }
  });

  $('.select2').select2({
    width: '100%'
  });

  $('body').on("keyup", ".onlynum", function () {
    let $this = $(this);
    $this.val($this.val().replace(/[^\d.]/g, '')); 
  });

  $('body').on("change focusout", ".onlynumIncludeDash", function () {
    let value = this.value.replace(/[￥ ,]/g, '');
    if (!/^[0-9-]*$/.test(value)) {
      $(this).val('');
    }
  });


  $('body').on("change focusout", '.onlyDecimal', function () {
    let value = $(this).val().replace(/[￥ ,]/g, '');
    const regex = /^-?\d+([.]?\d{0,3})?$/g
    if (value.trim() === '-') {return;}
    if (Number.isNaN(Number(value)) || ! regex.test(value)) {
      $(this).val('');
      return false;
    }
  });

  $('body').on("change focusout", '.decimalNumber', function () {
    let value = $(this).val().replace(/[￥ ,]/g, '');
    if (Number.isNaN(Number(value)) || value.includes('-')) {
      $(this).val('');
      return false;
    }

  });
    

  $('body').on("change focusout", '.only2decimal2number', function () {
    $(this).val().replace(/[￥ ,]/g, '');
    let regex = /^((?!0)\d{1,2}|0|\.\d{1,2})($|\.$|\.\d{1,2}$)/g;
    if (!regex.test($(this).val())) {
      $(this).val('');
      return false;
    }
  });

  $('body').on("change focusout", ".onlyPositiveNum", function () {
    const val = this.value;
    if (!/^\d*$/.test(val)) {
      $(this).val('');
    }
    if (!$.isNumeric(val) && val.length > 1) {
      $(this).val('');
    }
  });

  $('body').on("change focusout", '.onlyKana', function () {
    let regex = (/[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g);
    if (!regex.test($(this).val())) {
      $(this).val('');
      return false;
    }
  });

  $('body').on("focusout change", '.datepicker-date', function () {
    let regex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/
    if (!regex.test($(this).val())) {
      $(this).val('');
    }
    if (/[^0-9\-]/g.test(this.value)) {
      this.value = this.value.replace(/[^0-9\-\/]/g, '');
    }
  });

  $('body').on("focusout change", '.datetimepicker', function () {
    let regex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\s[0-2]\d\:[0-6]\d$/
    if (/[^0-9\:\s\/]/g.test(this.value)) {
      this.value = '';
    }
    if (!regex.test($(this).val())) {
      $(this).val('');
      return false;
    }
  });
   
  $('body').on("focusout change", '.construction-date-format', function () {
    let regex = /^\d{4}\/(0[1-9]|1[0-2])$/
    if (!regex.test($(this).val())) {
      $(this).val('');
      return false;
    }
  });
    
  $(function () {
    $("form").submit(function () {
      $('[type="submit"], form button').attr('disabled', 'disabled');
    });

    $("#confirmDeleteModal").on("show.bs.modal", function (e) {
      let o = $(e.relatedTarget), t = o.data("href"), d = o.data("title") || "Confirm Delete",
        a = o.data("description") || "Are you sure you want to delete?";
      $("#confirmDeleteModal form").attr("action", t)
      $("#confirmDeleteModal  .modal-title").text(d)
      $("#confirmDeleteModal  .deleteDescription").text(a);
    }), $("#name").keyup(function () {
      let e = $(this).val();
      e = (e.toLowerCase()).replace(/\s+/g, "-")
      $("#slug").val(e);
    }), $(".module").change(function () {
      let e = $(this).data("module"), o = $("." + e);
      $(this).prop("checked") ? o.find(".permission").prop("checked", !0) : o.find(".permission").prop("checked", !1);
    }), $(".permission").change(function () {
      let e = $(this).data("module"), o = $("." + e);
      $("." + e).find(".permission:checked").length === o.length ? $(".module[data-module='" + e + "']").prop("checked", !0) : $(".module[data-module='" + e + "']").prop("checked", !1);
    });
    let mainPermissions = $(".module");
    if (mainPermissions.length > 0) {
      for (let i = mainPermissions.length - 1; i >= 0; i--) {
        let permission = mainPermissions[i];
        let moduleName = $(permission).data("module");
        let subPermissions = $("." + moduleName + " input.permission").length;
        let checkedSubPermissions = $("." + moduleName + " input.permission:checked").length;
        if (subPermissions == checkedSubPermissions) {
          $(permission).prop("checked", true);
        }
      }
    }
    let e = function () {
      let e = $("input[name=password_method]:checked").val();
      if("is_password" === e){
        $("#passwordField").removeClass("d-none")
        $("#password").attr("required", "required")
      }
      if("is_activation_link" === e){
        $("#passwordField").addClass("d-none")
        $("#password").removeAttr("required")
      }
    };
    e()
    $("input[name=password_method]").on("click", function () {
      e();
    });

    $("input[name=target]").on("change", function() {
      let target = $(this).val();
      if(target === "specific_dcs") {
        $("option#general_target").prop("disabled", true);
        $("option#all-system-shutdown_target").prop("disabled", false);
        $("option#no-light_target").prop("disabled", false);
        $("select[name=type]").select2();
        $("#notificationTargetMethod").removeClass("d-none");
        $("#dcs_id").attr("required", "required");
      } else if(target === "all_users") {
        $("option#all-system-shutdown_target").prop("disabled", true);
        $("option#no-light_target").prop("disabled", true);
        $("option#general_target").prop("disabled", false);
        $("select[name=type]").select2();
        $('#notificationTargetMethod').addClass("d-none");
        $("#dcs_id").removeAttr("required");
      } 
      //else {
      //     $("option#general_target").prop("disabled", false);
      //     $("option#all-system-shutdown_target").prop("disabled", false);
      //     $("option#no-light_target").prop("disabled", false);
      //     $("select[name=type]").select2();
      //     $('#notificationTargetMethod').addClass("d-none");
      //     $("#dcs_id").removeAttr("required");
      // }
    });
        
    const ckEditor = document.querySelectorAll(".ck_editor");
    $.each(ckEditor, function(){
      ClassicEditor.create(this).then({
      }).catch(err => {
        console.log(err);
      });
    })

    function tog(v) {
      return v ? "addClass" : "removeClass";
    }

    $(document).on("input", ".clearable", function () {
      $(this)[tog(this.value)]("x");
    }).on("mousemove", ".x", function (e) {
      $(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]("onX");
    }).on("touchstart click", ".onX", function (ev) {
      ev.preventDefault();
      $(this).removeClass("x onX").val("").change();
    });

  });
  document.querySelector('form-control')
    .addEventListener('keyup', function(event) {
      if (event.code === 'Enter')
      {
        // event.preventDefault();
        document.querySelector('form').submit();
      }
    });
  $('.datepicker-date, .datetimepicker').attr('autocomplete', 'off');

  $(document).on("keydown", ":input:not(textarea,.allow-enter input)", function(event) {
    return event.key != "Enter";
  });
});
// Initially remove modal target and toggle in edit page
function removeForMutation() {
  $('.mutation-check').attr('data-toggle', '');
  $('.mutation-check').attr('data-target', '');
}
