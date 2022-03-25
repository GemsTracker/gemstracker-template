/*jslint browser: true*/
/*global jQuery */

jQuery(document).ready(function() {
    var imageSource = (function(scripts) {
        var scripts = document.getElementsByTagName('script'),
            script = scripts[scripts.length - 1];

        if (script.getAttribute.length !== undefined) {
            return script.src.split('/').slice(0,-2).join('/');
        }

        return script.getAttribute('src', -1).split('/').slice(0,-2).join('/');
    }());

    function copyToClipboard(html) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(jQuery(html).text());
            return;
        }
        if (navigator.clipboard.write) {
            data = createClipboardItem({
                "text/html": '<html><body>' + jQuery(html)[0].outerHTML + '</body></html>',
                "text/plain": jQuery(html).text().trim()
            });
            navigator.clipboard.write([data]).then(function() {
                console.log('Async: Copying to clipboard was successful!');
            }, function(err) {
                console.error('Async: Could not copy text: ', err);

                // Try the fallback
                fallbackCopyTextToClipboard(jQuery(html).text().trim());
            });;
            return;
        }
        navigator.clipboard.writeText(jQuery(html).text().trim()).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);

            // Try the fallback
            fallbackCopyTextToClipboard(jQuery(html).text().trim());
        });
    }
    
    function createClipboardItem(type2data)
    {
        var output = {};
        for (typeName in type2data) {
            var blob = new Blob([type2data[typeName]], {'type': typeName});
            
            output[[typeName]] = blob;
        }
        
        return new ClipboardItem(output);
    }

    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    jQuery('.copy-to-clipboard').before(
        '<img src="' + imageSource + '/images/copy.svg" width="20px" class="copier-to-clipboard" />'
    );

    jQuery('.copier-to-clipboard').attr({'alt': "Copy to clipboard", 'title': "Copy to clipboard"});
    jQuery('.copier-to-clipboard').click(function () {
        $self = this;
        $self.src = imageSource + '/images/copied.svg';
        copyToClipboard(jQuery($self).next());
        setTimeout(function (){
            $self.src = imageSource + '/images/copy.svg';
        }, 1000); // Restore image after 1000 ms.
    });
}); // */
