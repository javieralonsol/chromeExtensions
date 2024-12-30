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
  soundIfNotMuted(tab, "navigationEnd.wav");
});

chrome.downloads.onCreated.addListener((delta) => {
  new Audio("downloadStart.wav").play();
});

chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === "complete") {
    new Audio("downloadEnd.wav").play();
  }

  if (delta.error && delta.error.current) {
    new Audio("downloadError.wav").play();
  }
});
