function setupClickHandler(elementId, iframeId) {
    let element = document.getElementById(elementId);
    let iframe = document.getElementById(iframeId);
    let homeContent = document.getElementById('homecontent');
    if (element && iframe && homeContent) {
        element.addEventListener('click', function() {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.removeAttribute('hidden');
            homeContent.setAttribute('hidden', 'hidden');
            document.querySelectorAll('iframe').forEach(function(otherIframe) {
                if (otherIframe !== iframe) {
                    otherIframe.setAttribute('hidden', 'hidden');
                }
            });
        });
    }
}

setupClickHandler('info', 'info-iframe');
setupClickHandler('about', 'about-iframe');

let home = document.getElementById('home');
if (home) {
    home.addEventListener('click', function() {
        document.querySelectorAll('iframe').forEach(function(iframe) {
            iframe.setAttribute('hidden', 'hidden');
            iframe.style.width = '';
            iframe.style.height = '';
            iframe.style.border = 'none';
        });
        let homeContent = document.getElementById('homecontent');
        if (homeContent) {
            homeContent.removeAttribute('hidden');
        }
    });
}