/*jslint browser: true*/
/*global jQuery */

function activateLoadInline() {
    // Prevent 'double' click functions
    jQuery("a.inline-answers").unbind('click');
    // Inline answers + printing dialog
    jQuery("a.inline-answers").click(function(e) {
        doLoadInline(this, e);
    });
    // Remove the (possible) parent row onclick event because it triggers the function 
    jQuery("a.inline-answers").parents('tr').removeAttr('onclick');
    jQuery("a.inline-answers").parents('tr').unbind('click');
    jQuery("a.inline-answers").parents('tr').click(function(e) {
        doLoadInline(jQuery('td a.actionlink', this), e);
    });

    enableCopyToClipboard();   
}

function doLoadInline (currentItem, event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    var modal = jQuery("#modal");
    if (0 === modal.length) {
        var main = jQuery("#main");
        if (0 === main.length) {
            main = jQuery("body");
        }

        main.append(
            "<div id='modal' class='modal fade'>" +
            "   <div class='modal-dialog'>" +
            "       <div class='modal-content'>" +
            "           <div class='modal-header'>" +
            "               <button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
            "                   <span aria-hidden='true'>&times;</span>" +
            "               </button>" +
            "          </div>" +
            "          <div class='modal-body'></div>" +
            "       </div>" +
            "   </div>" +
            "</div>");
        modal = jQuery("#modal");
    }

    var modalDialog = modal.find(".modal-dialog");
    var modalBody = modalDialog.find(".modal-body");

    var documentWidth = jQuery(document).width();
    if (documentWidth > 900 && !modalDialog.hasClass("modal-lg")) {
        modalDialog.addClass("modal-lg");
    }

    modalBody.html("<div class='loading'>Loading...</div>");

    modal.modal();

    modalBody.load(jQuery(currentItem).attr("href"), function() {
        jQuery(this).append("<button id='print-button' class='actionlink btn print'>Print</button>");
        jQuery('a.actionlink.btn', this).addClass('inline-answers');
        activateLoadInline();
    });

    modal.on("click", ".btn.print", function() {
        var modalBody  = jQuery("#modal").find(".modal-body");
        var printContainerId = "print-answers";
        var body = jQuery("body");
        var bodyChildren = body.children(":visible");
        bodyChildren.css("visibility", "hidden");

        body.append("<div id='" + printContainerId + "' style='position: absolute; left: 0; top: 0; visibility: visible;'></div>");
        var printContainer = body.find("#" + printContainerId);

        printContainer.html(modalBody.html());

        body.css("visibility", "hidden");

        printContainer.find("#print-button").hide();

        window.print();

        printContainer.remove();
        body.css("visibility", "visible");
        bodyChildren.css("visibility", "visible");
    });
    
}

jQuery(document).ready(activateLoadInline);
