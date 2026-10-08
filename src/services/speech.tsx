import {NativeModules, Platform} from 'react-native';

let ttsModule;
let readyPromise;
let utteranceId = 0;

const loadTts = () => {
  if (ttsModule !== undefined) {
    return ttsModule;
  }
  if (!NativeModules.TextToSpeech) {
    ttsModule = null;
    return null;
  }
  try {
    ttsModule = require('react-native-tts').default;
  } catch (error) {
    ttsModule = null;
  }
  return ttsModule;
};

const ensureReady = () => {
  if (!readyPromise) {
    readyPromise = (async () => {
      const tts = loadTts();
      if (!tts) {
        return false;
      }
      try {
        await tts.getInitStatus();
      } catch (error) {
        if (error?.code === 'no_engine') {
          try {
            await tts.requestInstallEngine();
          } catch (installError) {
            return false;
          }
        }
      }
      try {
        await tts.setDefaultLanguage('hi-IN');
      } catch (error) {
        try {
          await tts.setDefaultLanguage('en-IN');
        } catch (fallbackError) {
          // Device voice list can omit both; speak still uses the system default.
        }
      }
      try {
        tts.setDefaultPitch(1);
        tts.setDefaultRate(0.48);
      } catch (error) {
        // Rate and pitch are optional.
      }
      if (Platform.OS === 'ios') {
        try {
          await tts.setIgnoreSilentSwitch('ignore');
        } catch (error) {
          // Silent-switch control is iOS-only.
        }
      }
      return true;
    })();
  }
  return readyPromise;
};

export const speak = text => {
  if (!text) {
    return;
  }
  const id = ++utteranceId;
  ensureReady().then(ok => {
    if (!ok || id !== utteranceId) {
      return;
    }
    const tts = loadTts();
    if (!tts) {
      return;
    }
    try {
      tts.stop();
    } catch (error) {
      // Ignore stop failures before a fresh utterance.
    }
    if (id !== utteranceId) {
      return;
    }
    try {
      tts.speak(text);
    } catch (error) {
      // Tour UI still works if speech is unavailable.
    }
  });
};

export const stopSpeech = () => {
  utteranceId += 1;
  const tts = loadTts();
  if (!tts) {
    return;
  }
  try {
    tts.stop();
  } catch (error) {
    // Nothing to stop.
  }
};
