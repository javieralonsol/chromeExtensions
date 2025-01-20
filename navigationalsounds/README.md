## Overview

Overview
Navigational Sounds is a Chrome extension that plays specific sounds to enhance your browsing experience. It provides auditory cues to indicate events like the start and completion of webpage navigation, downloads, or other interactions.

https://chrome.google.com/webstore/detail/sonidos-de-navegaci%C3%B3n/plhoioliblcddpmljieonfdndcmjmkpd

Features:
 - Plays sounds when navigation starts and completes (only activates sounds if the tab is not muted by the user).
 - Plays sounds for the start, completion, or cancellation of a download.
 - Plays a sound when typing in a text field.

## Note on automatic sound playback:

Due to Chrome’s policies, extensions that play sounds automatically may not work properly. The best solution I’ve tested is to launch the browser with this configuration:

chrome.exe --autoplay-policy=no-user-gesture-required

This allows any page, including this extension, to play sounds automatically. However, keep in mind that this setting removes restrictions for all websites, which could lead to unexpected experiences on sites with unwanted sound content.

For more information, check Chrome’s official documentation:
https://developer.chrome.com/blog/autoplay#developer_switches

##
## Installation Instructions

Installation Instructions
To install and set up the Navigational Sounds Chrome Extension, follow these steps:

1. **Clone the Repository**
   ```shell
   git clone https://github.com/javieralonsol/chromeExtensions.git
   ```
2. **Navigate to the Extension Directory**
   ```shell
   cd chromeExtensions/navigationalsounds/1.1
   ```
3. **Open Chrome and Navigate to the Extensions Page**
   Go to `chrome://extensions/` in your browser.
4. **Enable Developer Mode**
   At the top right, toggle the switch to enable Developer Mode.
5. **Load Unpacked Extension**
   Click the "Load unpacked" button and select the `1.1` directory you navigated to earlier.

The extension should now be installed and active in your Chrome browser.

##
## Usage Examples

Usage Examples
### Example 1: Playing a Sound on Navigation Start
When a user starts navigating to a new page, a sound will play if the tab is not muted by the user.

### Example 2: Playing a Sound on Navigation Completion
When a user completes navigating to a new page, another sound will play if the tab is not muted by the user.

### Code Snippet
```javascript
"use strict";

function soundIfNotMuted(tab, sound) {
    if (tab.frameId === 0) {
        chrome.tabs.get(tab.tabId, function (dos) {
            if (
                !dos ||
                !dos.mutedInfo ||
                !dos.mutedInfo.muted ||
                dos.mutedInfo.reason !== "user"
            ) {
                new Audio(sound).play();
            }
        });
    }
}

chrome.webNavigation.onBeforeNavigate.addListener(function (tab) {
    soundIfNotMuted(tab, "navigationStart.wav");
});

chrome.webNavigation.onCompleted.addListener(function (tab) {
    soundIfNotMuted(tab, "navigationComplete.wav");
});
```

##
## Code Summary

Code Summary
The key files in this project include:

- `background.js`:
  - This file contains the main logic for determining whether to play a sound when navigation starts or completes.
  - The function `soundIfNotMuted` checks if the tab is not muted by the user and then plays the appropriate sound.

##
## License

License
This project is licensed under the MIT License. For more details, please refer to the `LICENSE` file in the repository.

---

Thank you for using Navigational Sounds Chrome Extension! If you encounter any issues or have any feedback, please consider opening an issue in the [GitHub repository](https://github.com/javieralonsol/chromeExtensions).
```
