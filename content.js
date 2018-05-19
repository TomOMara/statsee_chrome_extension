// handlers for background js' messages. only this file can interact with window
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // listen for clicked_browser_action_message
    if(request.message === "scan_page") {
      // grab the url and fire a message back with the url for processing
      console.log('recieved scan_page message');
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      // grab all images on page
      $("img").each(function(idx) {
        var img_src = $("img")[idx].src;
        var rel_src = $($("img")[idx]).attr("src");

        chrome.runtime.sendMessage({ message:"parse_image_with_url",
                                     img_src: img_src,
                                     rel_src: rel_src});
        console.log('sent parse_image_with_url message from content: img_src = ', img_src);
      }
      );
    }

    if ( request.message === "inject_description") {
      var marked_up_data = request.marked_up_data;

      var selector = "img[src$=".concat('\'', request.rel_src, '\'', "]");
      console.log('selector = ', selector);


      $(marked_up_data).insertAfter($(selector));
      console.log('inserted_data into' + request.place_to_inject);
    }
  }
);
