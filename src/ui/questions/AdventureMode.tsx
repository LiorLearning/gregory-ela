import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStory } from '../story/StoryStore';
import bg1Url from '../../../bg2.png';
import { audioManager } from '../audioManager';

type Props = {
  onAdventureMessage?: (userMessage: string) => void;
  onStoryUpdate?: (storyUpdate: string) => void;
  adventureMessages?: Array<{ role: 'ai' | 'student'; text: string; isImage?: boolean; isLoading?: boolean; imageUrl?: string }>;
  onAdventureMessagesUpdate?: (messages: Array<{ role: 'ai' | 'student'; text: string; isImage?: boolean; isLoading?: boolean; imageUrl?: string }>) => void;
};

export function AdventureMode({ onAdventureMessage, onStoryUpdate, adventureMessages: propAdventureMessages, onAdventureMessagesUpdate }: Props): JSX.Element {
  const { state: storyState, appendMessage: appendStoryMessage, reset: resetStory, consumePendingAdventureChat, setMetadata } = useStory();
  // Use parent-provided messages or default/local persisted
  const defaultMessages: Array<{ role: 'ai' | 'student'; text: string; isImage?: boolean; isLoading?: boolean; imageUrl?: string }> = [
    { role: 'ai' as const, text: "📚✨ Gregory! I'm thrilled to continue our mystical adventure in the Library of Time! Kaida just solved the diphthong puzzles and safely landed after falling through the glowing hole. The wise owl awaits with a new riddle, and the swirling timelines in your cloak pulse with ancient magic! 🦉⏳ What mysterious knowledge should we seek next in these echoing halls?" }
  ];
  const [localAdventureMessages, setLocalAdventureMessages] = useState<Array<{ role: 'ai' | 'student'; text: string; isImage?: boolean; isLoading?: boolean; imageUrl?: string }>>(
    (storyState?.adventureMessages?.length ?? 0) > 0
      ? (storyState.adventureMessages as any)
      : defaultMessages
  );
  const adventureMessages = propAdventureMessages || localAdventureMessages;
  
  // Helper to update messages (functional to avoid stale snapshots)
  const updateAdventureMessages = (updater: (prev: typeof adventureMessages) => typeof adventureMessages) => {
    setLocalAdventureMessages(prev => {
      const base = propAdventureMessages ?? prev;
      const next = updater(base as any);
      if (onAdventureMessagesUpdate) onAdventureMessagesUpdate(next);
      return next as any;
    });
  };
  const [adventureInput, setAdventureInput] = useState('');
  const [isAdventureRecording, setIsAdventureRecording] = useState(false);
  const [adventureSpeechRecognition, setAdventureSpeechRecognition] = useState<any>(null);
  // Keep accumulated transcript across interim/final events and potential auto-restarts
  const adventureAccumulatedRef = useRef<string>('');
  const adventureRecordingRef = useRef<boolean>(false);
  
  // Adventure state management
  const [adventureState, setAdventureState] = useState<'new' | 'ongoing' | 'character_creation'>('ongoing');
  const [currentAdventure, setCurrentAdventure] = useState<{
    type?: string;
    protagonist?: string;
    sidekick?: string;
    teammates?: string;
    villain?: string;
    goal?: string;
    setting?: string;
    recentEvent?: string;
  }>({
    type: 'mystical library adventure with time magic and ancient knowledge',
    protagonist: 'Kaida Stormscroll (boy, male librarian\'s apprentice with dark hair, cloak of swirling past timelines, and floating spellbooks)',
    sidekick: 'None introduced yet',
    teammates: 'None included in this adventure',
    setting: 'Library of Time – misty, ancient structure with glowing books, echoing halls, and time-bent magic',
    goal: 'escape the cursed fate and unravel the mysteries of time magic while solving puzzles and riddles',
    villain: 'The Archivillain – a corrupted book spirit twisting stories to trap heroes in doomed fates',
    recentEvent: 'Kaida discovered a cursed book bearing his name predicting his end by sunset, cut its spine, entered a shadowy world, faced a boy version of himself, solved diphthong word puzzles, fell into a glowing hole, and landed safely as a glowing owl offered a new riddle'
  });
  const ADVENTURE_IMAGE_OVERLAY_OPACITY = 0.45;
  const adventureScrollRef = useRef<HTMLDivElement | null>(null);

  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(null);

  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState<number | null>(null);
  const [autoPlayedMessages, setAutoPlayedMessages] = useState<Set<number>>(new Set());
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUserGestureRef = useRef<boolean>(false);
  // Track which message text the current audio corresponds to for reliable toggling
  const currentAdventureAudioLabelRef = useRef<string | null>(null);

  // Sync adventure context with story metadata for QuestionPanel image generation
  useEffect(() => {
    setMetadata({
      protagonist: currentAdventure.protagonist,
      sidekick: currentAdventure.sidekick,
      setting: currentAdventure.setting,
      goal: currentAdventure.goal
    });
  }, [currentAdventure, setMetadata]);

  // Helper function to analyze responses and update adventure state
  const updateAdventureContext = (userMessage: string, aiResponse: string) => {
    const lowerUser = userMessage.toLowerCase();
    const lowerAI = aiResponse.toLowerCase();
    
    // Check for interest-based adventure selection
    const interests = ['anime', 'pokemon', 'gaming', 'smash bros', 'magic', 'library', 'time', 'books', 'dragons', 'ninjas', 'heroes', 'battles', 'adventure', 'mystical'];
    const selectedInterest = interests.find(interest => lowerUser.includes(interest));
    
    if (selectedInterest && adventureState === 'new') {
      setCurrentAdventure(prev => ({ ...prev, type: selectedInterest }));
      setAdventureState('ongoing');
    }
    
    // Check for character creation keywords
    if (lowerUser.includes('create') && (lowerUser.includes('character') || lowerUser.includes('sidekick'))) {
      setAdventureState('character_creation');
    }
    
    // Check for adventure progression
    if (adventureState === 'new' && lowerUser.length > 10) {
      setAdventureState('ongoing');
    }
    
    // Parse potential character/adventure elements from user input
    if (lowerUser.includes('name') && adventureState === 'character_creation') {
      // Extract potential names or update sidekick name
      const words = userMessage.split(' ');
      const nameIndex = words.findIndex(w => w.toLowerCase() === 'name');
      if (nameIndex >= 0 && nameIndex < words.length - 1) {
        setCurrentAdventure(prev => ({ ...prev, sidekick: words[nameIndex + 1] }));
      }
    }
  };

  useEffect(() => {
    const node = adventureScrollRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
    });
  }, [adventureMessages]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const markGesture = () => { hasUserGestureRef.current = true; };
    window.addEventListener('pointerdown', markGesture, { once: true });
    window.addEventListener('keydown', markGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', markGesture as () => void);
      window.removeEventListener('keydown', markGesture as () => void);
      // Ensure audio stops when component unmounts
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch {}
      try { audioManager.stopAll(); } catch {}
    };
  }, []);

  useEffect(() => {
    // If arriving from Step 4 with a pending chat, inject it once
    const pending = consumePendingAdventureChat?.();
    if (pending && pending.text) {
      // Drive the normal send path to avoid duplicate appends
      setAdventureInput(pending.text);
      setTimeout(() => { void sendAdventureMessage(); }, 50);
    }

    const latestMessage = adventureMessages[adventureMessages.length - 1];
    const latestIndex = adventureMessages.length - 1;
    if (
      latestMessage &&
      latestMessage.role === 'ai' &&
      !latestMessage.isLoading &&
      !latestMessage.isImage &&
      !autoPlayedMessages.has(latestIndex) &&
      latestMessage.text.trim()
    ) {
      setAutoPlayedMessages(prev => new Set([...prev, latestIndex]));
      setTimeout(() => {
        void playAIResponse(latestIndex, latestMessage.text);
      }, 500);
    }
  }, [adventureMessages, autoPlayedMessages]);

  const generateAdventureImage = async () => {
    const text = adventureInput.trim();
    if (!text) return;

    updateAdventureMessages(prev => [...prev, { role: 'student', text: `🌄 Create image: ${text}` }]);
    appendStoryMessage({ role: 'student', text: `🌄 Create image: ${text}` });
    setAdventureInput('');
    updateAdventureMessages(prev => [...prev, { role: 'ai', text: 'Creating your adventure image...', isLoading: true }]);

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const data = await response.json();
      if (response.ok && data.imageUrl) {
        updateAdventureMessages(prev => {
          const newMessages = [...prev];
          const loadingIndex = newMessages.findIndex(m => m.isLoading);
          if (loadingIndex !== -1) {
            newMessages[loadingIndex] = {
              role: 'ai',
              text: "Here's your adventure image! 🌄✨",
              isImage: true,
              imageUrl: data.imageUrl,
              isLoading: false
            };
          }
          return newMessages;
        });
        setFullscreenImageUrl(data.imageUrl);
        appendStoryMessage({ role: 'ai', text: "Here's your adventure image! 🌄✨", isImage: true, imageUrl: data.imageUrl });
        setShowFullscreenImage(true);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      updateAdventureMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            role: 'ai',
            text: "Sorry, I couldn't create that image. Please try again with a different description! 🌄",
            isLoading: false
          };
        }
        return newMessages;
      });
      appendStoryMessage({ role: 'ai', text: "Sorry, I couldn't create that image. Please try again with a different description! 🌄" });
    }
  };

  const playAIResponse = async (messageIndex: number, text: string) => {
    try {
      const cleanText = text.replace(/[🎉🚀🌙🌄✨😊]/g, '').trim();
      // If this same message is already playing, treat this call as a toggle to stop
      const active = audioManager.getActive?.() as HTMLAudioElement | null;
      if (active && currentAdventureAudioLabelRef.current === cleanText && !active.paused && !active.ended) {
        try { active.pause(); active.currentTime = 0; } catch {}
        currentAdventureAudioLabelRef.current = null;
        setPlayingAudio(prev => prev === messageIndex ? null : prev);
        return;
      }
      // Ensure only one audio plays at a time globally
      audioManager.stopAll();
      setAudioLoading(messageIndex);
      if (!cleanText) {
        setAudioLoading(null);
        return;
      }
      let audioUrl = audioCacheRef.current.get(cleanText);
      if (!audioUrl) {
        const response = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, speed: 1.0 }) // Normal speed for adventure content
        });
        if (!response.ok) {
          let upstream = 'unknown';
          try { upstream = await response.text(); } catch {}
          throw new Error(`TTS API error: ${response.status} ${upstream}`);
        }
        const data = await response.json();
        audioUrl = data.audioUrl as string | undefined;
        if (audioUrl) audioCacheRef.current.set(cleanText, audioUrl);
      }
      if (audioUrl) {
        setAudioLoading(null);
        setPlayingAudio(messageIndex);
        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.src = audioUrl;
        currentAdventureAudioLabelRef.current = cleanText;
        audio.onended = () => {
          setPlayingAudio(prev => prev === messageIndex ? null : prev);
          if (currentAdventureAudioLabelRef.current === cleanText) currentAdventureAudioLabelRef.current = null;
        };
        audio.onerror = () => {
          setPlayingAudio(prev => prev === messageIndex ? null : prev);
          if (currentAdventureAudioLabelRef.current === cleanText) currentAdventureAudioLabelRef.current = null;
        };
        audio.onabort = () => {
          setPlayingAudio(prev => prev === messageIndex ? null : prev);
          if (currentAdventureAudioLabelRef.current === cleanText) currentAdventureAudioLabelRef.current = null;
        };
        audio.onpause = () => {
          setPlayingAudio(prev => prev === messageIndex ? null : prev);
          if (currentAdventureAudioLabelRef.current === cleanText) currentAdventureAudioLabelRef.current = null;
        };
        // Register as the active audio; this will stop any other playing audio
        audioManager.setActive(audio);
        try {
          if (!hasUserGestureRef.current) {
            const resumeOnGesture = () => {
              hasUserGestureRef.current = true;
              window.removeEventListener('pointerdown', resumeOnGesture);
              window.removeEventListener('keydown', resumeOnGesture);
              void audio.play().catch(err => {
                console.error('Deferred audio play failed:', err);
                setPlayingAudio(prev => prev === messageIndex ? null : prev);
                if (currentAdventureAudioLabelRef.current === cleanText) currentAdventureAudioLabelRef.current = null;
              });
            };
            window.addEventListener('pointerdown', resumeOnGesture, { once: true });
            window.addEventListener('keydown', resumeOnGesture, { once: true });
          } else {
            await audio.play();
          }
        } catch (playError) {
          console.error('Audio play failed:', playError);
          setPlayingAudio(prev => prev === messageIndex ? null : prev);
          if (currentAdventureAudioLabelRef.current === cleanText) currentAdventureAudioLabelRef.current = null;
        }
      } else {
        throw new Error('No audio URL returned');
      }
    } catch (error) {
      console.error('Error playing AI response:', error);
      setAudioLoading(prev => prev === messageIndex ? null : prev);
      setPlayingAudio(prev => prev === messageIndex ? null : prev);
    }
  };

  const toggleAIResponse = async (messageIndex: number, text: string) => {
    const cleanText = text.replace(/[🎉🚀🌙🌄✨😊]/g, '').trim();
    const el = audioRef.current;
    const active = audioManager.getActive?.() as HTMLAudioElement | null;
    const isGlobalActiveThis = !!active && active === el && !active.paused && !active.ended;
    const isThisMessageActive = isGlobalActiveThis || currentAdventureAudioLabelRef.current === cleanText || (!!el && !el.paused && !el.ended && currentAdventureAudioLabelRef.current === cleanText);
    // If this exact message's audio is currently playing, stop it
    if (isThisMessageActive || playingAudio === messageIndex) {
      try {
        const toStop = active && active === el ? active : el;
        if (toStop) {
          toStop.pause();
          toStop.currentTime = 0;
          try { toStop.src = ''; toStop.load(); } catch {}
        }
      } catch {}
      currentAdventureAudioLabelRef.current = null;
      setPlayingAudio(null);
      audioManager.stopAll();
      return;
    }
    // Otherwise, play this message (will stop any other audio via audioManager)
    await playAIResponse(messageIndex, text);
  };

  const sendAdventureMessage = async () => {
    const text = adventureInput.trim();
    console.log('sendAdventureMessage called with text:', text);
    if (!text) return;
    if (text.toLowerCase() === 'image' || text.toLowerCase() === 'create image' || text.toLowerCase().startsWith('create image')) {
      const imagePrompt = text.toLowerCase() === 'image' || text.toLowerCase() === 'create image'
        ? 'Kaida Stormscroll (boy) in librarian robes with dark hair and cloak of swirling timelines, surrounded by floating spellbooks in the mystical Library of Time with golden magical light and ancient atmosphere'
        : text.replace(/^create image\s*/i, '').trim() || 'Kaida Stormscroll (boy) in librarian robes with dark hair and cloak of swirling timelines, surrounded by floating spellbooks in the mystical Library of Time with golden magical light and ancient atmosphere';
      updateAdventureMessages(prev => [...prev, { role: 'student', text: `🌄 ${text}` }]);
      onAdventureMessage?.(text);
      setAdventureInput('');
      // Reset accumulated speech recognition text after submission
      adventureAccumulatedRef.current = '';
      updateAdventureMessages(prev => [...prev, { role: 'ai', text: 'Creating your adventure image...', isLoading: true }]);
      try {
        const response = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: imagePrompt })
        });
        const data = await response.json();
        if (response.ok && data.imageUrl) {
          updateAdventureMessages(prev => {
            const newMessages = [...prev];
            const loadingIndex = newMessages.findIndex(m => m.isLoading);
            if (loadingIndex !== -1) {
              newMessages[loadingIndex] = {
                role: 'ai',
                text: "Here's your adventure image! 🌄✨",
                isImage: true,
                imageUrl: data.imageUrl,
                isLoading: false
              };
            }
            return newMessages;
          });
          setFullscreenImageUrl(data.imageUrl);
          setShowFullscreenImage(true);
        } else {
          throw new Error(data.error || 'Failed to generate image');
        }
      } catch (error) {
        console.error('Error generating image:', error);
        updateAdventureMessages(prev => {
          const newMessages = [...prev];
          const loadingIndex = newMessages.findIndex(m => m.isLoading);
          if (loadingIndex !== -1) {
            newMessages[loadingIndex] = {
              role: 'ai',
              text: "Sorry, I couldn't create that image. Please try again with a different description! 🌄",
              isLoading: false
            };
          }
          return newMessages;
        });
      }
      return;
    }

    updateAdventureMessages(prev => [...prev, { role: 'student', text }]);
    appendStoryMessage({ role: 'student', text });
    onAdventureMessage?.(text);
    setAdventureInput('');
    // Reset accumulated speech recognition text after submission
    adventureAccumulatedRef.current = '';
    updateAdventureMessages(prev => [...prev, { role: 'ai', text: 'Thinking about your adventure...', isLoading: true }]);
    try {
      const currentMessages = adventureMessages.filter(m => !m.isLoading && !m.isImage);
      
      // Include story events (like continuation messages from questions) for better context
      const storyEventsContext = storyState?.storyEvents?.length > 0 
        ? `\n\nPrevious Story Events:\n${storyState.storyEvents.slice(-10).join('\n')}`
        : '';
      
      const conversationMessages = [
        {
          role: 'system',
          content: `Role & Perspective: Be my loyal sidekick in an imaginative adventure for children aged 8–14. Speak in the first person as my companion.

Tone: Friendly, encouraging, and light-hearted, with humor and kid-friendly language. Ask only one question at a time. Keep responses under 80 words. Keep the output to exactly 2–3 short lines, using explicit newline characters (\n) at natural pauses for clean formatting.

Goal: Create fast-paced, mission-oriented adventures with lovable characters, thrilling twists, and cliffhangers. Keep me eager for the next scene and encourage multiple missions to inspire a love for storytelling.

Ongoing Adventure: Show excitement, prompt me for what happens next, and occasionally suggest 1–2 creative ideas to spark the next turn.

New Adventure: Ask about my interests (anime, gaming, mystical adventures, time magic, etc.). Offer:
- Interest-based adventure (protagonist + villain + clear goal)
- Another interest-based adventure
- "Create-your-own" adventure (I invent the setting, sidekick, and villain)

Use rich plots, lovable characters, and suspenseful cliffhangers.

Adventure State: ${adventureState === 'new' ? 'NEW_ADVENTURE' : adventureState === 'character_creation' ? 'CHARACTER_CREATION' : 'ONGOING_ADVENTURE'}

Current Adventure Context: ${JSON.stringify(currentAdventure)}${storyEventsContext}

Student Profile (Gregory): Loves Super Smash Bros. Ultimate, Pokémon, anime (One Piece, Naruto, Dragon Ball, My Hero Academia, Demon Slayer, Jujutsu Kaisen), and Avatar: The Last Airbender. Prefers realistic cartoon-anime fusion art with glowing effects, soft shadows, and dramatic lighting. Enjoys mystical library adventures with time magic and ancient knowledge themes.

Character Creation: When creating sidekicks/characters, let me choose names with suggestions, offer trait lists (funny, optimistic, resilient, etc.), and ask me to describe appearance for image creation.

Remember: I'm your loyal companion - speak as "I" and refer to the student as "you" or Gregory. Always end with excitement and either a cliffhanger or a single engaging question. Keep responses mystical and dramatic to match Gregory's interests in anime, gaming, and magical library adventures with time manipulation themes.`
        },
        ...currentMessages
          .slice(-30)
          .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
        { role: 'user', content: text }
      ];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationMessages })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const aiReply = data.reply || 'That sounds like an amazing adventure! What happens next?';
      updateAdventureMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) newMessages[loadingIndex] = { role: 'ai', text: aiReply, isLoading: false } as any;
        return newMessages;
      });
      appendStoryMessage({ role: 'ai', text: aiReply });
      
      // Update adventure context based on conversation
      updateAdventureContext(text, aiReply);
      
      // Pass story update to parent component for use in other steps
      const storyUpdate = `User: ${text} | AI: ${aiReply}`;
      onStoryUpdate?.(storyUpdate);
    } catch (error) {
      console.error('Error calling GPT-4o API:', error);
      updateAdventureMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(m => m.isLoading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            role: 'ai',
            text: 'Wow, that sounds like an exciting adventure! ✨ Tell me more about what Kaida should do next!',
            isLoading: false
          } as any;
        }
        return newMessages;
      });
      appendStoryMessage({ role: 'ai', text: 'Wow, that sounds like an exciting adventure! ✨ Tell me more about what Kaida should do next!' });
    }
  };

  const toggleAdventureMic = () => {
    if (isAdventureRecording) {
      setIsAdventureRecording(false);
      adventureRecordingRef.current = false;
      if (adventureSpeechRecognition) {
        adventureSpeechRecognition.stop();
        setAdventureSpeechRecognition(null);
      }
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    // Initialize accumulator with any existing typed input so we never "reset"
    adventureAccumulatedRef.current = adventureInput ? (adventureInput.trim() + ' ') : '';
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let newFinalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          newFinalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      if (newFinalTranscript) {
        adventureAccumulatedRef.current += newFinalTranscript;
      }
      const displayTranscript = (adventureAccumulatedRef.current + interimTranscript).trim();
      setAdventureInput(displayTranscript);
    };
    recognition.onend = () => {
      // Auto-restart if user hasn't explicitly stopped, to avoid losing context on long pauses
      if (adventureRecordingRef.current) {
        try { recognition.start(); } catch {}
      } else {
        setIsAdventureRecording(false);
        setAdventureSpeechRecognition(null);
      }
    };
    recognition.onerror = () => {
      // Attempt to recover from transient errors while recording is intended to continue
      if (adventureRecordingRef.current) {
        try { recognition.start(); } catch {}
      }
    };
    recognition.start();
    setAdventureSpeechRecognition(recognition);
    setIsAdventureRecording(true);
    adventureRecordingRef.current = true;
  };

  return (
    <>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        @keyframes sparkle { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7;} 50% { transform: scale(1.2) rotate(180deg); opacity: 1;} }
        .speech-bubble-ai::before { content: ''; position: absolute; left: -6px; bottom: 12px; width: 0; height: 0; border-style: solid; border-width: 0 0 12px 12px; border-color: transparent transparent rgba(255,255,255,0.98) transparent; transform: rotate(45deg);} 
        .speech-bubble-ai::after { content: ''; position: absolute; left: -5px; bottom: 13px; width: 0; height: 0; border-style: solid; border-width: 0 0 10px 10px; border-color: transparent transparent rgba(255,255,255,0.9) transparent; transform: rotate(45deg); z-index: 1; }
        .speech-bubble-student::before { content: ''; position: absolute; right: -6px; bottom: 12px; width: 0; height: 0; border-style: solid; border-width: 12px 12px 0 0; border-color: #FFFADB transparent transparent transparent; transform: rotate(45deg);} 
        .speech-bubble-student::after { content: ''; position: absolute; right: -5px; bottom: 13px; width: 0; height: 0; border-style: solid; border-width: 10px 10px 0 0; border-color: rgba(255,245,205,0.9) transparent transparent transparent; transform: rotate(45deg); z-index: 1; }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 80px'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '840px', height: '560px', borderRadius: 32, overflow: 'hidden', boxShadow: '9.6px 14.4px 0 rgba(156, 126, 172, 0.25), 0 22.4px 64px rgba(0,0,0,0.08)' }}>
          <div style={{ position: 'absolute', inset: 0 as any, backgroundImage: `url(${bg1Url})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.75 }} />
          <div style={{ position: 'absolute', inset: 0 as any, background: `rgba(0,0,0,${ADVENTURE_IMAGE_OVERLAY_OPACITY})` }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', height: '100%' }}>
            <div ref={adventureScrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 6, paddingBottom: 16 }}>
              {adventureMessages.map((m, i) => (
                <div key={i} className={`${m.role === 'student' ? 'speech-bubble-student' : 'speech-bubble-ai'} ${(m.isImage || m.isLoading) ? 'has-image' : ''}`}
                  style={{ alignSelf: m.role === 'student' ? 'flex-end' : 'flex-start', background: m.role === 'student' ? '#FFFADB' : 'rgba(255,255,255,0.98)', color: m.role === 'student' ? '#000000' : '#111827', padding: (m.isImage || m.isLoading) ? '8px' : '10px 26px 10px 14px', borderRadius: 18, maxWidth: (m.isImage || m.isLoading) ? '60%' : '80%', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', position: 'relative', border: m.role === 'student' ? '1px solid rgba(255,245,205,0.8)' : '1px solid rgba(255,255,255,0.9)', marginLeft: m.role === 'student' ? '0' : '12px', marginRight: m.role === 'student' ? '12px' : '0', marginBottom: '8px' }}>
                  {m.isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16, gap: 12 }}>
                      <div style={{ width: 40, height: 40, border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#6b7280', textAlign: 'center', fontFamily: 'Quicksand, sans-serif' }}>{m.text}</div>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: 'sparkle 1.5s ease-in-out infinite' }} />
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: 'sparkle 1.5s ease-in-out infinite 0.3s' }} />
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: 'sparkle 1.5s ease-in-out infinite 0.6s' }} />
                      </div>
                    </div>
                  ) : m.isImage ? (
                    <div style={{ position: 'relative' }}>
                      {m.text && m.text !== 'IMAGE_GENERATED' && (
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', textAlign: 'center', fontFamily: 'Quicksand, sans-serif', marginBottom: 8 }}>{m.text}</div>
                      )}
                      <img src={m.imageUrl || bg1Url} alt={m.imageUrl ? 'Generated adventure image' : 'Adventure Scene'}
                        onClick={() => { if (m.imageUrl) { setFullscreenImageUrl(m.imageUrl); setShowFullscreenImage(true); } else { setShowFullscreenImage(true); } }}
                        style={{ width: '100%', height: 'auto', maxHeight: 200, objectFit: 'cover', borderRadius: 12, border: '2px solid rgba(255,255,255,0.9)', cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLImageElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLImageElement).style.boxShadow = 'none'; }}
                      />
                      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500, }}>🔍 {m.imageUrl ? 'Click to open' : 'Click to expand'}</div>
                    </div>
                  ) : (
                    <span style={{ fontFamily: 'Quicksand, sans-serif', fontSize: 17, fontWeight: 500, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.text}</span>
                  )}
                  {m.role === 'ai' && !m.isLoading && !m.isImage ? (
                    <button onClick={() => void toggleAIResponse(i, m.text)} disabled={audioLoading === i}
                      style={{ position: 'absolute', right: 8, bottom: 6, width: 20, height: 20, borderRadius: 10, border: 'none', background: playingAudio === i ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', cursor: audioLoading === i ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.2)', transition: 'all 0.2s ease', opacity: audioLoading === i ? 0.6 : 1 }}
                      title={audioLoading === i ? 'Loading audio...' : playingAudio === i ? 'Stop' : 'Listen to story'}
                      onMouseEnter={(e) => { if (audioLoading !== i) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                    >{audioLoading === i ? '⋯' : playingAudio === i ? '🔴' : '🔊'}</button>
                  ) : (
                    <span style={{ position: 'absolute', right: 8, bottom: 6, fontSize: 12, color: '#4b5563' }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick adventure options - show when starting new adventure */}
            {adventureState === 'new' && adventureMessages.length <= 2 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12, justifyContent: 'center' }}>
                {['🦁 Animals', '🌿 Jungles', '💖 Barbies', '🐅 Tigers', '✨ Magic', '🚀 Space'].map((option) => (
                  <button key={option} onClick={() => {
                    const interest = option.split(' ')[1]?.toLowerCase() || option.toLowerCase();
                    setAdventureInput(`I love ${interest} adventures!`);
                    setTimeout(() => void sendAdventureMessage(), 100);
                  }}
                    style={{ padding: '8px 12px', borderRadius: 16, border: 'none', background: 'rgba(255,255,255,0.9)', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.95)', padding: '8px 12px', borderRadius: 20, gap: 10, border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <input value={adventureInput} onChange={(e) => setAdventureInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void sendAdventureMessage(); }} placeholder="Message..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#111827', fontSize: 17, fontWeight: 400, fontFamily: 'Quicksand, sans-serif' }} />
                <button onClick={() => void generateAdventureImage()} aria-label="Generate Image" style={{ width: 32, height: 32, borderRadius: 16, border: '2px solid rgba(16,185,129,0.3)', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }} title="Generate image from your message">🌄</button>
                {adventureState !== 'new' && (
                  <button onClick={() => {
                    setAdventureState('new');
                    setCurrentAdventure({});
                    const greeting = "🎉 Hey there, brave adventurer! I'm your loyal sidekick, ready for an epic quest! What kind of adventure gets you excited - anime battles, mystical libraries, time magic, or something totally different? Let's create an amazing story together! ✨📚";
                    updateAdventureMessages(prev => [...prev, { role: 'ai', text: greeting }]);
                    appendStoryMessage({ role: 'ai', text: greeting });
                  }} aria-label="New Adventure" style={{ width: 32, height: 32, borderRadius: 16, border: '2px solid rgba(245,158,11,0.3)', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }} title="Start a new adventure">🎪</button>
                )}
                <button onClick={() => void sendAdventureMessage()} aria-label="Send" style={{ width: 32, height: 32, borderRadius: 16, border: '2px solid rgba(139,92,246,0.3)', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▲</button>
              </div>
              <button onClick={toggleAdventureMic} aria-label="Record" style={{ width: 48, height: 48, borderRadius: 24, border: 'none', cursor: 'pointer', background: isAdventureRecording ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: isAdventureRecording ? '0 6px 18px rgba(239, 68, 68, 0.3)' : '0 6px 18px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isAdventureRecording ? (<div style={{ width: 14, height: 14, background: 'white', borderRadius: 3 }} />) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="white"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="white"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFullscreenImage && (
        <div style={{ position: 'fixed', inset: 0 as any, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowFullscreenImage(false); setFullscreenImageUrl(null); } }}
          onKeyDown={(e) => { if ((e as any).key === 'Escape') { setShowFullscreenImage(false); setFullscreenImageUrl(null); } }}
          tabIndex={0}
        >
          <button onClick={() => { setShowFullscreenImage(false); setFullscreenImageUrl(null); }}
            style={{ position: 'absolute', top: 24, right: 24, width: 56, height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#374151', boxShadow: '0 6px 20px rgba(0,0,0,0.4)', transition: 'all 0.2s ease', zIndex: 1002, fontWeight: 'bold' }}
            title="Close fullscreen image"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.95)'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)'; }}
          >
            ✕
          </button>
          <img src={fullscreenImageUrl || bg1Url} alt={fullscreenImageUrl ? 'Generated Adventure Image' : 'Adventure Scene'}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
          {fullscreenImageUrl && (
            <div style={{ position: 'absolute', bottom: 24, left: 24, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: 'Quicksand, sans-serif' }}>🌄 Generated by DALL-E 3</div>
          )}
        </div>
      )}
    </>
  );
}


