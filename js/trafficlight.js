 //http://bootstrap.ourjs.com/#dialog
 
 /* Extend string method */

/*
string.format, ref: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
*/
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

/*
Description: $.fn.dialog
Author: Kris Zhang
require: 
  string.format.js
*/
(function($) {

  $.fn.dialog = function(options) {

    var self    = this
      , $this   = $(self)
      , $body   = $(document.body)
      , $msgbox = $this.closest('.dialog')
      , parentDataName = 'dialog-parent'
      , arg1    = arguments[1]
      , arg2    = arguments[2]
      ;

    var create = function() {

      var msghtml
        = ''
        + '<div class="dialog modal fade">'
        + '<div class="modal-dialog">'
        +   '<div class="modal-content">'
        +     '<div class="modal-header">'
        +         '<button type="button" class="close">&times;</button>'
        +         '<h4 class="modal-title"></h4>'
        +     '</div>'
        +     '<div class="modal-body"></div>'
        +     '<div class="modal-footer"></div>'
        +   '</div>'
        + '</div>'
        + '</div>'
        ;


      $msgbox = $(msghtml);
      $(document.body).append($msgbox);
      $msgbox.find(".modal-body").append($this);
    };

    var createButton = function(_options) {
      var buttons = (_options || options || {}).buttons || {}
        , $btnrow = $msgbox.find(".modal-footer");

      //clear old buttons
      $btnrow.html('');

      for (var button in buttons) {
        var btnObj  = buttons[button]
          , id      = ""
          , text    = ""
          , classed = "btn-default"
          , click   = "";

        if (btnObj.constructor == Object) {
          id      = btnObj.id;
          text    = btnObj.text;
          classed = btnObj['class'] || btnObj.classed || classed;
          click   = btnObj.click;
        }

        if (btnObj.constructor == Function) {
          text  = button;
          click = btnObj;
        }

        //<button data-bb-handler="danger" type="button" class="btn btn-danger">Danger!</button>
        $button = $('<button type="button" class="btn {1}">{0}</button>'.format(text, classed));

        id && $button.attr("id", id);
        if (click) {
          (function(click) {
            $button.click(function() {
              click.call(self);
            });
          })(click);
        }

        $btnrow.append($button);
      }

      $btnrow.data('buttons', buttons);
    };

    var show = function() {
      // call the bootstrap modal to handle the show events (fade effects, body class and backdrop div)
      $msgbox.modal('show');
    };

    var close = function(destroy) {
      // call the bootstrap modal to handle the hide events and remove msgbox after the modal is hidden
      $msgbox.modal('hide').on('hidden.bs.modal', function() {
                if (destroy) {
                    $this.data(parentDataName).append($this);
                    $msgbox.remove();
                }
            });
    };

    if (options.constructor == Object) {
      !$this.data(parentDataName) && $this.data(parentDataName, $this.parent());

      if ($msgbox.size() < 1) {
        create();
      }
      createButton();
      $(".modal-title",  $msgbox).html(options.title || "");
      $(".modal-dialog", $msgbox).addClass(options.dialogClass || "");
      $(".modal-header .close", $msgbox).click(function() {
        var closeHandler = options.onClose || close;
        closeHandler.call(self);
      });
      (options['class'] || options.classed) && $msgbox.addClass(options['class'] || options.classed);
      options.autoOpen !== false && show();
    }

    if (options == "destroy") {
      close(true);
    }

    if (options == "close") {
      close();
    }

    if (options == "open") {
      show();
    }

    if (options == "option") {
      if (arg1 == 'buttons') {
        if (arg2) {
          createButton({ buttons: arg2 });
          show();
        } else {
          return $msgbox.find(".modal-footer").data('buttons');
        }
      }
    }

    return self;
  };

})(jQuery);


            
    // Utility functions        
    function setCookie(key, value) {  
        var expires = new Date();  
        expires.setTime(expires.getTime() + 31536000000); //1 year  
        document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();  
    }  
  
    function getCookie(key) {  
        var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");  
        return keyValue ? keyValue[2] : null;  
    }
    
    function getURLParameter(url, name) {
        return (RegExp("/" + name + "/" + "(.+?)(/|$)").exec(url)||[,null])[1];
    }
    // End utility functions

    // Click track
    $(".traject .panel-heading h3 span.title").click(function(){
        headerObj = $(this).parent().parent();
        headerObj.next().toggle();
        if(headerObj.next().is(":visible")) {
            // Save the opened track for later
            url = $(this).prev().attr("href"); 
            idx = getURLParameter(url, "rt");
            setCookie("track_idx", idx);
            $(this).find("span").removeClass("fa-chevron-right").addClass("fa-chevron-down");
            // Close all days
            headerObj.next().find(".actor").each(function(){if ( $(this).find(".zpitems").is(":visible") ) { $(this).find("h5").click(); }});
            // Scroll to today
            headerObj.next().find(".object.today").each(function(){
                // Open current day
                $(this).find(".actor h5 span").each(function(){
                    if ( $(this).hasClass("fa-plus-square")) {
                        $(this).parent().click();
                    }
                });
                $(this).children(".actor").each(function(){if ( $(this).find(".zplegenda").is(":visible") ) { $(this).find("h4").click(); }});
                // Scroll to today
                $(this).parent().parent().scrollTo($(this),0, { offset: $(this).outerWidth(true)-$(this).parent().parent().innerWidth()} );    /* today is rightmost block */
            });
        } else {
           $(this).find("span").addClass("fa-chevron-right").removeClass("fa-chevron-down");
        }
    });

    // Click day
    $(".object h4").click(function(){
        if ( $(this).parent().find(".actor h5 span").first().hasClass("fa-minus-square") ) {
            // First is open, now close first and all others
            $(this).parent().find(".actor h5 span").each(function(){
                if ( $(this).hasClass("fa-minus-square")) {
                    $(this).parent().click();
                }
            });
        } else {
            // First is closed, now open first and all others
            $(this).parent().find(".actor h5 span").each(function(){
                if ( $(this).hasClass("fa-plus-square")) {
                    $(this).parent().click();
                }
            });
        }
    });

    // Click actor
    $(".actor h5").click(function(){
        if ( $(this).find("span").first().hasClass("fa-plus-square") ) {
            $(this).find("span").removeClass("fa-plus-square").addClass("fa-minus-square");
            $(this).parent().find(".zplegenda").toggle(false);
            $(this).parent().find(".zpitems").toggle(true);
        } else {
            $(this).find("span").addClass("fa-plus-square").removeClass("fa-minus-square");
            $(this).parent().find(".zplegenda").toggle(true);
            $(this).parent().find(".zpitems").toggle(false);
        }
    });

    // Click legend
    $(".actor .zplegenda").click(function(){
        // delegate to actor
        $(this).parent().find("h5").click();
    });

    // Initially hide all zpitems so only zplegende remains visible
    $(".object .actor").children(".zpitems").toggle(false);

    // First close all tracks
    $(".traject .panel-heading h3 span.title").click();
    // and open the last one we opened
    idx = getCookie("track_idx");
    var found = false;
    if (idx !== null) {
        $(".traject .panel-heading h3 span.title").each(function(index) { 
            url = $(this).prev().attr("href"); 
            rtr = getURLParameter(url, "rt");
            if (rtr == idx) {
                $(".traject .panel-heading h3 span.title").eq(index).click();
                found = true;
                return false;
            }
        });
    }
    
    // Not found? open first
    if (!found) {
        $(".traject .panel-heading h3 span.title").first().click();
    }

    function loadInline(e, ctx) {
        e.preventDefault();
        // Now open a new div, not #menu and bring it to the front
        // Add a close button to it, maybe the available tooltip can help here
        $("div#modalpopup").html("<div class=\'loading\'></div>"); // Make sure we show no old information
        $("div#modalpopup").load(ctx.attr('href'),
        function( response, status, xhr ) {
            if ( status == "error" ) {
                var msg = "Sorry but there was an error: ";
                $(this).html( msg + xhr.status + " " + xhr.statusText );
            } else {
                $("div#modalpopup a.actionlink:not(:contains(\'PDF\'))").click(function(e){
                    loadInline(e, $(this));
                });
            }
        });
        $("div#modalpopup").dialog({
            modal: true,
            width: 500,
            position:{ my: "left top", at: "left top", of: "#main" },
            buttons: [
                {
                text: "Print",
                "class": "btn-primary",
                click: function() {
                        if ($(".modal").is(":visible")) {
                            var oldId = $(event.target).closest(".modal").attr("id");
                            var modalId = "modelprint";
                            $(event.target).closest(".modal").attr("id", modalId);
                            $("body").css("visibility", "hidden");
                            $("body #container").css("display", "none");
                            $("div#modalpopup").css("visibility", "visible");
                            $("#" + modalId).removeClass("modal");
                            window.print();
                            $("body").css("visibility", "visible");
                            $("body #container").css("display", "block");
                            $("#" + modalId).addClass("modal");
                            $(event.target).closest(".modal").attr("id", oldId);
                        } else {
                            window.print();
                        }
                    }
                }
                ]
        });
    }

    // Printing dialog
    $(".zpitem.success a[target=\'inline\']").click(function(e){
        loadInline(e, $(this));
    });

    // Tooltips
    $("[data-toggle=\'tooltip\']").tooltip()