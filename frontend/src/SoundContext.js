import React, { createContext, useState, useContext, useEffect } from 'react';

const SoundContext = createContext(null);

const SOUND_FILES = {
  click: '/sounds/click.wav',
  select: '/sounds/select.wav',
  placeSelect: '/sounds/place-select.wav',
  ambient: '/sounds/ambient.wav'
};

const SoundManager = (() => {
  let _ambientSound = null;
  let _isMuted = false;
  let _isInitialized = false;
  let _activeListeners = new Set();

  const _createAmbientSound = () => {
    if (_ambientSound) return;

    try {
      _ambientSound = new Audio(SOUND_FILES.ambient);
      _ambientSound.loop = true;
      _ambientSound.volume = 0.5;

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && !_isMuted) {
          _ambientSound.pause();
        } else if (document.visibilityState === 'visible' && !_isMuted) {
          _playAmbient();
        }
      });

    } catch (error) {
      console.error('Error creating ambient sound:', error);
    }
  };

  const _playAmbient = () => {
    if (!_ambientSound || _isMuted) return;

    try {
      const playPromise = _ambientSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay prevented:', error);

          if (!_activeListeners.has('ambient_enabler')) {
            const enableAudio = () => {
              _ambientSound.play().catch(err => console.error('Still cannot play ambient:', err));
              document.removeEventListener('click', enableAudio);
              document.removeEventListener('touchstart', enableAudio);
              _activeListeners.delete('ambient_enabler');
            };

            document.addEventListener('click', enableAudio);
            document.addEventListener('touchstart', enableAudio);
            _activeListeners.add('ambient_enabler');
          }
        });
      }
    } catch (error) {
      console.error('Error playing ambient sound:', error);
    }
  };

  return {
    initialize: () => {
      if (_isInitialized) return;
      _createAmbientSound();
      _isInitialized = true;
    },

    playAmbient: () => {
      if (!_isInitialized) {
        _createAmbientSound();
        _isInitialized = true;
      }
      _playAmbient();
    },

    stopAmbient: () => {
      if (_ambientSound) {
        _ambientSound.pause();
      }
    },

    playSound: (soundFile, volume = 1.0) => {
      if (_isMuted) return;

      try {
        const audio = new Audio(soundFile);
        audio.volume = volume;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error(`Error playing sound ${soundFile}:`, error);
          });
        }
      } catch (error) {
        console.error(`Error creating audio for ${soundFile}:`, error);
      }
    },

    setMuted: (muted) => {
      _isMuted = muted;
      if (_ambientSound) {
        if (muted) {
          _ambientSound.pause();
        } else {
          _playAmbient();
        }
      }
    },

    getMuted: () => _isMuted,

    cleanup: () => {
      if (_ambientSound) {
        _ambientSound.pause();
        _ambientSound = null;
      }
      _isInitialized = false;
    }
  };
})();

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(SoundManager.getMuted());

  useEffect(() => {
    SoundManager.initialize();

    if (!isMuted) {
      SoundManager.playAmbient();
    }

    return () => {
    };
  }, []);

  useEffect(() => {
    SoundManager.setMuted(isMuted);
  }, [isMuted]);

  const soundClick = () => {
    SoundManager.playSound(SOUND_FILES.click, 1.0);
  };

  const soundSelect = () => {
    SoundManager.playSound(SOUND_FILES.select, 1.0);
  };

  const soundPlaceSelect = () => {
    SoundManager.playSound(SOUND_FILES.placeSelect, 1.0);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{
      isMuted,
      toggleMute,
      soundClick,
      soundSelect,
      soundPlaceSelect
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    console.warn('useSoundContext must be used within a SoundProvider');
    return {
      isMuted: false,
      toggleMute: () => {},
      soundClick: () => {},
      soundSelect: () => {},
      soundPlaceSelect: () => {}
    };
  }
  return context;
};