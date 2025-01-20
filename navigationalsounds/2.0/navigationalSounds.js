// v2.0 alonso-lopez.com

const TYPE_SOUND_SRC = 'audio/inputKey.wav';

(function() {
	addBackgroundOnMessageListener();
	addInputListener();
}());

function addBackgroundOnMessageListener() {
	chrome.runtime.onMessage.addListener((message) => {
		playSound(message.sound);
	});
}

function addInputListener() {
	document.addEventListener('input', (event) => {
		if (event.isTrusted && event.target.closest('input:not([type="range"]), textarea')) {
			playSound(TYPE_SOUND_SRC);
		}
	});
}

function playSound(sound) {
	const audioUrl = chrome.runtime.getURL(sound);

	const audio = new Audio(audioUrl);
	audio.autoplay = true;
}
