// background.js

// Called when the user clicks on the browser action (extension icon).
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab, saying clicked_browser_action
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    console.log('message sent to active tab');
    chrome.tabs.sendMessage(activeTab.id, {"message": "scan_page"});
    console.log('sent scan_page message');
  });
});

// listem for message to filter images
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "parse_image_with_url")  {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {



        var activeTab = tabs[0];
        console.log('recieved parse_image_with_url message from content: img_src = ', request.img_src);

        var img_src = request.img_src;

        endpoint = 'http://127.0.0.1:5000/';
        method = 'POST';
        $.ajax({
            type: method,
            url: endpoint,
            data: { 'url': img_src },
            success: function(response)
            {
                 message = JSON.parse(response).message;
                 status = JSON.parse(response).status;
                 console.log(img_src + message + status);

                 data = JSON.parse(response).data;
                 console.log(data);
                 if (data) {
                      marked_up_data = "<div class=\"alert alert-success\" role=\"alert\" style='margin: auto'>\n<p>" + data + "</p></div>";
                      chrome.tabs.sendMessage(activeTab.id, {"message":"inject_description",
                                                             "marked_up_data": marked_up_data,
                                                             "rel_src": request.rel_src });
                      console.log('sent inject_description message: marked_up_data = ', marked_up_data);
                 }
            },
            failure: function(f_response) {
                console.log('failed :(');
            },
            dataType: 'html'
         });
        });
      }
  }
);



