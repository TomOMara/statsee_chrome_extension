// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});

    //
    chrome.tabs.sendMessage(activeTab.id, {"message": "filter_images"});
  });
});

// listen for message from content.js about opening a new tab
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }
  }
);

// listem for message to filter images
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "filter_images")  {
      filtered_images = filter_images(request.images)
      send_message_to_active_tab({"message":"filtered_images",
                                  "filtered_images":filtered_images })
    }
  }
);

var send_message_to_active_tab = function(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, message);
  });
}
var image_is_translatable = function(image) {
  // hit API to determine if image is translatable
  console.log('image = ', image)
  return true; // stubbed logic
}

var filter_images = function(images) {
  console.log('got images within filter_images: ' + images)

  translatable_images = [];

  for (var image in images[images])  {
    if (image_is_translatable(image)) {
        translatable_images += image;
    }
  }

  return translatable_images
}
