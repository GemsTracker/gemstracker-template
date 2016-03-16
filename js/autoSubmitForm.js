/*jslint browser: true*/
/*global jQuery */

// Creating the widget
jQuery.widget("ui.autoSubmitForm", {

    // default options
    options: {
        // targetId: the element whose content is replaced
        timeout: 2000,
        selective: false
        // submitUrl: the request url
    },

    _init: function () {
        "use strict";
        var self = this;

        /*
        console.log(this.element);            // Firebug console
        console.log(this.options.submitUrl);  // Firebug console
        console.log(this.options.targetId);   // Firebug console 
        console.log(this.options.selective);  // Firebug console */

        if (this.options.selective) {
            jQuery(this.element).on('keyup', 'input.autosubmit:text, textarea.autosubmit', function (e) {self.filter(); });
            jQuery(this.element).on('change', 'select.autosubmit', function (e) {self.filter(); });
            jQuery(this.element).on('click', 'input.autosubmit:checkbox, input.autosubmit:radio', function (e) {self.filter(); });
        } else {
            jQuery(this.element).on('keyup', 'input:text, textarea', function (e) {self.filter(); });
            jQuery(this.element).on('change', 'select', function (e) {self.filter(); });
            jQuery(this.element).on('click', 'input:checkbox, input:radio', function (e) {self.filter(); });
        }
        // Bind the events
        

        // Set the initial value
        this.lastQuery = this.value();
    },

    complete: function (request, status) {
        "use strict";
        this.request = null;

        // Check for changes
        // - if the input field was changed since the last request
        //   filter() will search on the new value
        // - if the input field has not changed, then no new request
        //   is made.
        this.filter();
    },

    destroy: function () {
        "use strict";
        if (this.request !== null) {
            this.request.abort();
            this.request = null;
        }
    },

    error: function (request, status) {
        "use strict";
        /*
        if (request.status === 401) {
            location.href = location.href;
        } // */
    },

    filter: function () {
        "use strict";
        var postData, self;

        //If we have a pending request and want to create a new one, cancel the first
        this.destroy();

        if (this.request === null) {

            // var name = this.options.elementName ? this.options.elementName : this.element.attr('name');

            postData = this.value();

            if (this.options.targetId && this.options.submitUrl) {
                // Prevent double dipping when e.g. the arrow keys were used.
                if (jQuery.param(postData) !== jQuery.param(this.lastQuery)) {
                    this.lastQuery = postData;
                    //console.log(postData);

                    //*
                    self = this;
                    this.request = jQuery.ajax({
                        url: this.options.submitUrl,
                        type: "POST",
                        dataType: "html",
                        data: postData,
                        error: function (request, status, error) {self.error(request, status); },
                        complete: function (request, status) {self.complete(request, status); },
                        success: function (data, status, request) {self.success(data, status, request); }
                    });
                    // */
                }
            }
        }
    },

    success: function (data, status, request) {
        "use strict";
        jQuery(this.options.targetId).html(data);
    },

    value: function () {
        "use strict";
        return jQuery(this.element[0]).serializeArray();
    },

    lastQuery: null,

    request: null

});