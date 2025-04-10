import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const SoundContext = createContext(null);

// Define sound file paths
const SOUND_FILES = {
  click: '/sounds/click.wav',
  select: '/sounds/select.wav',
  placeSelect: '/sounds/place-select.wav',
  ambient: '/sounds/ambient.wav'
};

// Singleton sound manager (completely outside React lifecycle)
// This prevents any possibility of duplicate sound instances
const SoundManager = (() => {
  // Private variables
  let _ambientSound = null;
  let _isMuted = false;
  let _isInitialized = false;
  let _activeListeners = new Set();
  
  // Create ambient sound only once
  const _createAmbientSound = () => {
    if (_ambientSound) return;
    
    try {
      _ambientSound = new Audio(SOUND_FILES.ambient);
      _ambientSound.loop = true;
      _ambientSound.volume = 0.5;
      console.log('Ambient sound created by singleton');
      
      // Auto-pause on page visibility change
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
  
  // Play ambient sound with error handling
  const _playAmbient = () => {
    if (!_ambientSound || _isMuted) return;
    
    try {
      const playPromise = _ambientSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Autoplay prevented:', error);
          
          // Only add the listener once
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
  
  // Public interface
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
  
  // Initialize sound manager once
  useEffect(() => {
    console.log('SoundProvider initializing');
    SoundManager.initialize();
    
    if (!isMuted) {
      SoundManager.playAmbient();
    }
    
    return () => {
      // We don't clean up on unmount anymore since the sound manager is a singleton
      // SoundManager will maintain its state across component mounts/unmounts
    };
  }, []);
  
  // Sync mute state with sound manager
  useEffect(() => {
    SoundManager.setMuted(isMuted);
  }, [isMuted]);
  
  // Sound functions
  const soundClick = () => {
    console.log('Playing click sound');
    SoundManager.playSound(SOUND_FILES.click, 1.0);
  };
  
  const soundSelect = () => {
    console.log('Playing select sound');
    SoundManager.playSound(SOUND_FILES.select, 1.0);
  };
  
  const soundPlaceSelect = () => {
    console.log('Playing place select sound');
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

// Custom hook for using sound context
export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    console.warn('useSoundContext must be used within a SoundProvider');
    // Return dummy functions so app doesn't break
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