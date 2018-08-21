var iframe = document.createElement("iframe");
iframe.setAttribute("style", "width: 100%; height: 80px; position: fixed; z-index: 10000;")
iframe.setAttribute("src", "https://7df0191b.ngrok.io/music-player/")
iframe.setAttribute("scrolling", "no");
iframe.setAttribute("frameborder", "0");
iframe.setAttribute("id", "iframe-music-player");

var elementExists = document.getElementById("iframe-music-player");

if (!elementExists) {
    document.body.insertBefore(iframe, document.body.firstChild)
}