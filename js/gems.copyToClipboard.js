/*jslint browser: true*/
/*global jQuery */

jQuery(document).ready(function() {
    var imageSource = (function() {
        var scripts = document.getElementsByTagName('script');

        for (i = 0; i < scripts.length; i++) {
            if (undefined !== scripts[i].getAttribute) {
                var src = scripts[i].getAttribute('src');
                if (src && src.includes('copyToClipboard.js')) {
                    // console.log(scripts[i].getAttribute('src', -1).split('/').slice(0,-2).join('/'));
                    return scripts[i].getAttribute('src', -1).split('/').slice(0,-2).join('/');
                }
            }
        }
    }());

    function copyToClipboard(html) 
    {
        var text = jQuery(html).text();

        if ('INPUT' == html.tagName) {
            text = html.getAttribute('value');
        }

        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        if (navigator.clipboard.write) {
            data = createClipboardItem({
                "text/html": '<html><body>' + jQuery(html)[0].outerHTML + '</body></html>',
                "text/plain": text
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
        navigator.clipboard.writeText(text).then(function() {
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

    function makeCopyButton(source, extraClass)
    {
        var alt = source.getAttribute('data-copy-title');
        if (! alt) {
            alt = source.getAttribute('title');
        }
        if (! alt) {
            alt = source.getAttribute('alt');
        }
        if (! alt) {
            alt = "Copy to clipboard";
        }
        if (! extraClass) {
            extraClass = '';
        }
        return '<img src="' + imageSource + '/images/copy.svg" width="20px" class="copier-to-clipboard ' + extraClass + '" data-clipboard-target-id="' + source.getAttribute('id') + '" alt="' + alt + '" title="' + alt + '"/>';
    }

    /**
     * Create image buttons for classes asking for buttons  
     **/
    jQuery('.copy-to-clipboard-after').after(function () {
        return makeCopyButton(this, 'copier-after');
    });
    jQuery('.copy-to-clipboard-before').before(function () {
        return makeCopyButton(this, 'copier-before');
    });
    jQuery('.copy-to-clipboard-inside').append(function () {
        return makeCopyButton(this, 'copier-inside');
    });

    // The actual copy object function
    jQuery('.copier-to-clipboard').click(function () {
        $self = this;
        if ('img' == $self.tagName) {
            // Animate image click
            $self.src = imageSource + '/images/copied.svg';
            
            setTimeout(function () {
                $self.src = imageSource + '/images/copy.svg';
            }, 1000); // Restore image after 1000 ms.
        } else {
            var origTitle = $self.getAttribute('title');
            var newTitle  = "Copied"

            if ($self.getAttribute('data-original-title')) {
                origTitle = $self.getAttribute('data-original-title');
            }
            if ($self.getAttribute('data-clipboard-after')) {
                newTitle = $self.getAttribute('data-clipboard-after');
            }
            $self.setAttribute('title', newTitle);
            jQuery($self).tooltip('fixTitle').tooltip('show');

            setTimeout(function () {
                $self.setAttribute('title', origTitle);
                jQuery($self).tooltip('fixTitle');
            }, 1000); // Restore tooltip after 1000 ms, newTitle will remain visible until mouseout
        }
        if ($self.getAttribute && $self.getAttribute('data-clipboard-text')) {
            // console.log($self.getAttribute('data-clipboard-text'));
            fallbackCopyTextToClipboard($self.getAttribute('data-clipboard-text'));
        } else {
            var target = document.getElementById($self.getAttribute('data-clipboard-target-id'));
            if (!target) {
                if ($self.getAttribute && $self.getAttribute('class').includes('copier-after')) {
                    target = $self.previousSibling;
                } else if ($self.getAttribute && $self.getAttribute('class').includes('copier-before')) {
                    target = $self.nextSibling;
                } else if ($self.getAttribute && $self.getAttribute('class').includes('copier-inside')) { 
                    target = $self.parentElement;
                }
            }
            // console.log(target);
            if (target) {
                copyToClipboard(target);
            }
        }
    });
}); // */
