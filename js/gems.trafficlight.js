/*jslint browser: true*/
/*global jQuery */

// Utility functions        
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 7776000); // 90 dagen  
    document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
    return keyValue ? keyValue[2] : null;
}

function getURLParameter(url, name) {
    return (RegExp("/" + name + "/" + "(.+?)(/|$)").exec(url) || [, null])[1];
}
// End utility functions

// Make sure the last clicked track id is remembered
jQuery(".traject .panel-heading h3 span.title").click(function () {
    var headerObj = jQuery(this).parent().parent();
    // As this function is called before the item is made visible, check for not visivle 
    if (! headerObj.next().is(":visible")) {
        // Save the opened track for later
        var url = $(this).parent().find('a').attr("href");
        var idx = getURLParameter(url, "rt");
        setCookie("track_idx", idx);
        // console.log(idx);
    }    
});

// Click day
$(".object h5").click(function () {
    if ($(this).parent().find(".actor h6 span").first().hasClass("fa-minus-square")) {
        // First is open, now close first and all others
        $(this).parent().find(".actor h6 span").each(function () {
            if ($(this).hasClass("fa-minus-square")) {
                $(this).parent().click();
            }
        });
    } else {
        // First is closed, now open first and all others
        $(this).parent().find(".actor h6 span").each(function () {
            if ($(this).hasClass("fa-plus-square")) {
                $(this).parent().click();
            }
        });
    }
});

// Click actor
$(".actor h6").click(function () {
    if ($(this).find("span").first().hasClass("fa-plus-square")) {
        $(this).find("span").removeClass("fa-plus-square").addClass("fa-minus-square");
        $(this).parent().find(".zplegenda").toggle(false);
        $(this).parent().find(".zpitems").toggle(true);
        
        var href = $(this).parent().find('.tokenwrapper .tools a').first().attr('href');

        setCookie("last_token_id", getURLParameter(href, 'id'));
    } else {
        $(this).find("span").addClass("fa-plus-square").removeClass("fa-minus-square");
        $(this).parent().find(".zplegenda").toggle(true);
        $(this).parent().find(".zpitems").toggle(false);
    }
});

// Click legend
$(".actor .zplegenda").click(function () {
    // delegate to actor
    $(this).parent().find("h6").click();
});

// Initially hide all zpitems so only zplegende remains visible
$(".object .actor").children(".zpitems").toggle(false);

var lastToken = getCookie("last_token_id");
if (lastToken) {
    $(".actor .tokenwrapper .tools a").each(function () {
        if(lastToken == getURLParameter(this.href, 'id')) {
            $(this).parents().eq(5).find('h6').click();
        }
    });
}
