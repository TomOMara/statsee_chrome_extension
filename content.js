// alert("Kynies gay lol")
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);

      // send message to background about opening a tab
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});

    }

    if ( request.message === "filter_images" ) {
        console.log('sending ' + document.images.length + ' images to filter');
        chrome.runtime.sendMessage({"message": "filter_images", "images": document.images})
    }

    if ( request.message === "filtered_images" ) {
        console.log('got ' + request.filtered_images.length + ' filtered_images');
    }
  }
);
