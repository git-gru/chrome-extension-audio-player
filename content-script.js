var url = chrome.extension.getURL("")

var iframe = document.createElement("iframe");
iframe.setAttribute("style", "width: 100%; height: 80px; position: fixed; bottom: 0; z-index: 10000;")
iframe.setAttribute("src", "about:blank")
iframe.setAttribute("scrolling", "no");
iframe.setAttribute("frameborder", "0");
iframe.setAttribute("id", "iframe-music-player");

var container = document.createElement("div");
container.setAttribute("id", "container")
container.setAttribute("class", "disabled")
container.innerHTML = '<div id="wave"></div><div id="drop-message-panel"><p id="drop-message"><i class="fa fa-cloud-upload"></i> Drop Audio File</p></div><div id="track-details"><p id="track-time"><span id="current">-</span> / <span id="total">-</span></p></div><div id="control-bar"><div class="player-control"><div id="play-button" title="Play"><i class="fa fa-play"></i></div><div id="pause-button" title="Pause"><i class="fa fa-pause"></i></div><div id="stop-button" title="Stop"><i class="fa fa-stop"></i></div></div></div><div id="drop-zone" class="hidden">Drag &amp; Drop Files Here</div>'

var HTML = container.outerHTML

// List any CSS you want to reference within the iframe
var CSS = '<link rel="stylesheet" href="' + url + 'assets/css/styles.css" type="text/css"><link rel="stylesheet" href="' + url + 'assets/css/font-awesome-4.3.0/css/font-awesome.min.css">';
// List any JS you want to reference within the iframe
var JS = '<script src="' + url + 'assets/js/jquery-1.11.2.min.js"></script><script src="' + url + 'assets/js/id3-minimized.js"></script><script src="' + url + 'assets/js/wavesurfer.min.js"></script><script src="' + url + 'assets/js/script.js"></script>';
// Now sticch it all together into one thing to insert into the iframe
var myContent = '<!DOCTYPE html>' + '<html><head><meta charset="UTF-8"><title>HTML5 Music Player</title>' + CSS + '</head><body>' + HTML + JS + '</body></html>';

iframe.onload = function () {
    // contentWindow is set!
    iframe.contentWindow.document.open('text/html', 'replace');
    iframe.contentWindow.document.write(myContent);
    iframe.contentWindow.document.close();
};

var elementExists = document.getElementById("iframe-music-player");

if (!elementExists) {
    document.body.appendChild(iframe)
}