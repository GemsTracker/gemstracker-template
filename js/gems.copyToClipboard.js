/*jslint browser: true*/
/*global jQuery */

function enableCopyToClipboard() {
    var copyId = 1001;

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
    
    function copyToClipboard(element) 
    {
        var html = '<html><body>' + element.outerHTML + '</body></html>'
        var text = jQuery(element).text();
        

        if ('INPUT' == element.tagName) {
            text = html.getAttribute('value');
        }
        if ('TABLE' == element.tagName) {
            var text = "";
            jQuery('tr', element).each(function () {
                jQuery('td', this).each(function () {
                    text += jQuery(this).text().trim() + "\t";
                });
                text.trimEnd();
                text += "\n";
            });
        }
        
        // console.log(element, html, text);

        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(html, text);
            return;
        }
        if (navigator.clipboard.write) {
            data = createClipboardItem({
                "text/html": html,
                "text/plain": text
            });
            navigator.clipboard.write([data]).then(function() {
                console.log('Async: Copying to clipboard was successful!');
            }).catch(function(error) {
                console.error('Async: Could not copy text: ', error);

                // Try the fallback
                fallbackCopyTextToClipboard(html, text);
            });
            return;
        }
        fallbackCopyTextToClipboard(html, text);
        
        /* Alternative (fallback works in FireFox)
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying of text to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);

            // Try the fallback
            fallbackCopyTextToClipboard(html, text);
        });  // */
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

    function fallbackCopyTextToClipboard(html, text)
    {
        function listener(e) {
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", text);
            e.preventDefault();
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
        console.log('Copied to clipboard!');
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
        var id = source.getAttribute('id');
        if (null == id) {
            id = 'copyId' + copyId++;
            source.setAttribute('id', id);
        }
        return '<img src="' + imageSource + '/images/copy.svg" width="20px" class="copier-to-clipboard ' + extraClass + '" data-clipboard-target-id="' + id + '" alt="' + alt + '" title="' + alt + '"/>';
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
            // console.log($self, target);
            if (target) {
                copyToClipboard(target);
            }
        }
    });
}

jQuery(document).ready(enableCopyToClipboard());
