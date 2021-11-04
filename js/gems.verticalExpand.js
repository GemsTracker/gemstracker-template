/*jslint browser: true*/
/*global jQuery */

jQuery(document).ready(function() {
    // jQuery(".verticalExpand .header").off("click");
    jQuery(".verticalExpand .header").on("click", function(e) {
        var clickedElement = jQuery(e.target);
        clickedElement.parent().toggleClass("expanded");
        if (clickedElement.closest(".no-expand", ".button").length === 0) {
            var caretContainer = jQuery(this).find("span.header-caret");
            if (caretContainer.hasClass("fa")) {
                caretContainer.toggleClass("fa-chevron-down fa-chevron-right");
            } else {
                caretContainer.toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s");
            }
            jQuery(this).next().slideToggle();
        }
    });
}); // */