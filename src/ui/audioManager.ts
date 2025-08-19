export type ManagedAudio = HTMLAudioElement | null;

let activeAudio: ManagedAudio = null;

export const audioManager = {
  stopAll: (): void => {
    try {
      if (activeAudio) {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      }
    } catch {}
    activeAudio = null;
    try {
      // Also stop Web Speech API if speaking
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch {}
  },
  setActive: (el: ManagedAudio): void => {
    if (activeAudio && activeAudio !== el) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch {}
    }
    activeAudio = el;
  },
  getActive: (): ManagedAudio => activeAudio
};


