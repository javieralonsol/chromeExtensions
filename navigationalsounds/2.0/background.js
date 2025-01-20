// v2.0 alonso-lopez.com

const DELTA_STATE_CURRENT_COMPLETE = 'complete';
const DOWNLOAD_END_SRC = 'audio/downloadEnd.wav';
const DOWNLOAD_ERROR_SRC = 'audio/downloadError.wav';
const DOWNLOAD_START_SRC = 'audio/downloadStart.wav';
const NAVIGATION_END_SRC = 'audio/navigationEnd.wav';
const NAVIGATION_START_SRC = 'audio/navigationStart.wav';
const TAB_MUTED_INFO_REASON_USER = 'user';

(function() {
	addOnExtensionInstalledListener();
}());

// Escucha la instalación de la extensión y añade los listeners
function addOnDownloadListener() {
	chrome.downloads.onChanged.addListener((delta) => {
		if (delta.filename) {
			playSound(DOWNLOAD_START_SRC);
		}

		if (delta.state && delta.state.current === DELTA_STATE_CURRENT_COMPLETE) {
			playSound(DOWNLOAD_END_SRC);
		}

		if (delta.error && delta.error.current) {
			playSound(DOWNLOAD_ERROR_SRC);
		}
	});
}

function addOnExtensionInstalledListener() {
	addOnWebNavigationStartListener();
	addOnWebNavigationEndListener();
	addOnDownloadListener();
}

function addOnWebNavigationEndListener() {
	chrome.webNavigation.onCompleted.addListener((details) => {
		playSoundIfMainFrameAndUnmuted(details.frameId, details.tabId, NAVIGATION_END_SRC);
	});
}

function addOnWebNavigationStartListener() {
	chrome.webNavigation.onBeforeNavigate.addListener((details) => {
		playSoundIfMainFrameAndUnmuted(details.frameId, details.tabId, NAVIGATION_START_SRC);
	});
}

function getActiveTab() {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const lastError = chrome.runtime.lastError;

			if (!lastError && tabs[0]) {
				resolve(tabs[0]);
			} else {
				reject(lastError || 'No se encontró la pestaña activa'); // Si hay un error, lo devuelve
			}
		});
	});
}

function getTab(tabId) {
	return new Promise((resolve, reject) => {
		chrome.tabs.get(tabId, (tab) => {
			const lastError = chrome.runtime.lastError;

			if (!lastError && tab) {
				resolve(tab);
			} else {
				reject(lastError || `No se encontró ninguna pestaña con el ID ${tabId}`); // Si hay un error, lo devuelve
			}
		});
	});
}

function getTabIsMuted(tabId) {
	return getTab(tabId)
		.then((tab) => {
			return tab.mutedInfo?.muted && tab.mutedInfo?.reason === TAB_MUTED_INFO_REASON_USER;
		})
		.catch((error) => {
			console.warn(`Error obteniendo el estado de mute: ${error.message || error}`);
		});
}

function playSound(sound) {
	getActiveTab()
		.then((tab) => {
			chrome.tabs.sendMessage(tab.id, { sound }, () => chrome.runtime.lastError);
		})
		.catch((error) => {
			console.warn('Error playSound obteniendo getActiveTab', error);
		});
}

function playSoundIfMainFrameAndUnmuted(frameId, tabId, sound) {
	// Sonar sólo si es el frame principal
	if (frameId === 0) {
		// Solo sonará si la tab que generó el evento no está silenciada
		getTabIsMuted(tabId)
			.then((isMuted) => {
				if (!isMuted) {
					playSound(sound);
				}
			})
			.catch((error) => {
				console.warn('Error playSound obteniendo getTabIsMuted', error);
			});
	}
}
