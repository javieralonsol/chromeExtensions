'use strict';

const myAudio = new Audio();

function soundIfNotMuted(tab, sound) {
  if (tab.frameId === 0) {
    chrome.tabs.get(tab.tabId, function (dos) {
      if (!dos || !dos.mutedInfo || !dos.mutedInfo.muted || dos.mutedInfo.reason !== 'user') {
        playAudio(sound);
      }
    });
  }
}

function playAudio(src) {
  myAudio.load();
  fetch(src)
    .then(() => {
      myAudio.src = src;
      return myAudio.play();
    })
    .catch((e) => {});
}

chrome.webNavigation.onBeforeNavigate.addListener(function (tab) {
  if (tab.parentFrameId === -1) {
    soundIfNotMuted(tab, 'navigationStart.wav');
  }
});

chrome.webNavigation.onCompleted.addListener(function (tab) {
  if (tab.parentFrameId === -1) {
    soundIfNotMuted(tab, 'navigationEnd.wav');
  }
});

// chrome.downloads.onCreated.addListener((delta) => {
//   playAudio("downloadStart.wav");
// });

chrome.downloads.onChanged.addListener((delta) => {
  if (delta.filename) {
    playAudio('downloadStart.wav');
  }

  if (delta.state && delta.state.current === 'complete') {
    playAudio('downloadEnd.wav');
  }

  if (delta.error && delta.error.current) {
    playAudio('downloadError.wav');
  }
});
