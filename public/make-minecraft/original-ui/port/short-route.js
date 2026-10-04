// Keep fragment links on the current editor URL despite the legacy asset base.
document.addEventListener('click', function (event) {
    var anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var href = anchor.getAttribute('href');
    if (href && href.charAt(0) === '#') {
        event.preventDefault();
        location.hash = href;
    }
}, true);
