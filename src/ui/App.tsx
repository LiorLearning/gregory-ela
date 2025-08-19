import React, { useCallback, useMemo, useState } from 'react';
import { ChatPanel } from './ChatPanel';
import { ImagePanel } from './ImagePanel';
import { QuestionPanel } from './QuestionPanel';
import { LandingPage } from './LandingPage';
import { Button } from './components/Button';

export function App(): JSX.Element {
  // Landing page state
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Practice loop state (placeholder assets, no DALL·E)
  const [chapter, setChapter] = useState<1 | 2>(1);
  const [progress, setProgress] = useState(0); // 0..3
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWin, setShowWin] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // collapsed by default

  const chapterImages = useMemo(() => {
    // Four states per chapter: 0 start, 1, 2, 3 complete
    const ch1 = [
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop'
    ];
    const ch2 = [
      'https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop'
    ];
    return chapter === 1 ? ch1 : ch2;
  }, [chapter]);

  const questions = useMemo(() => {
    if (chapter === 1) {
      return [
        { id: 'q1', type: 'mc', prompt: 'Where are Captain Asher and his team?', options: ['A snowy mountain', 'A futuristic jungle on Ragonia 7\'s moon', 'Under the ocean'], correct: 1 },
        { id: 'q2', type: 'spelling', prompt: 'Fix the word from the story:', target: 'portal', options: ['portel', 'portal', 'protale'], correct: 1 },
        { id: 'bonus', type: 'micro', prompt: 'Who is Asher\'s winged robo-dino?', options: ['Clay', 'Shracker'], correct: 0 }
      ] as const;
    }
    return [
      { id: 'q1', type: 'mc', prompt: 'Why does Asher use robot clones?', options: ['To confuse enemies', 'To build a camp', 'To plant trees'], correct: 0 },
      { id: 'q2', type: 'order', prompt: 'Arrange the sentence:', fragments: ['Shracker scans', 'the portal', 'for clues'], order: [0,1,2] },
      { id: 'bonus', type: 'micro', prompt: 'Which bird-like sidekick helps scan?', options: ['Shracker', 'Clay'], correct: 0 }
    ] as const;
  }, [chapter]);

  const [questionIndex, setQuestionIndex] = useState(0); // 0..1 -> main questions, then bonus if needed
  const [selected, setSelected] = useState<number | null>(null);
  const [fragmentsOrder, setFragmentsOrder] = useState<number[]>([]);

  const startChapter = useCallback(() => {
    setError(null);
    setShowWin(false);
    setVideoUrl(null);
    setProgress(0);
    setQuestionIndex(0);
    setSelected(null);
    setFragmentsOrder([]);
    setImageUrl(chapterImages[0] ?? null);
  }, [chapterImages]);

  const handleGenerate = useCallback((_: string) => {
    // repurpose Create Image button to start or advance chapter
    if (!imageUrl || showWin) {
      startChapter();
    } else {
      // If chapter is in progress and user clicks button again, re-show current state
      setImageUrl(chapterImages[Math.min(progress, 3)] ?? null);
    }
  }, [imageUrl, showWin, startChapter, chapterImages, progress]);

  // Landing page handlers
  const handleSelectStory = useCallback((storyId: string) => {
    console.log('Selected story:', storyId);
    setSelectedStoryId(storyId);
    setShowLandingPage(false);
  }, []);

  const handleCreateNewStory = useCallback(() => {
    console.log('Creating new story');
    setSelectedStoryId('new-story');
    setShowLandingPage(false);
  }, []);

  function onAnswer(): void {
    const q = questions[questionIndex];
    if (!q) return;
    let correct = false;
    if (q.type === 'mc' || q.type === 'spelling' || q.type === 'micro') {
      correct = selected === q.correct;
    } else if (q.type === 'order') {
      correct = JSON.stringify(fragmentsOrder) === JSON.stringify(q.order);
    }
    if (!correct) return;

    const newProgress = Math.min(progress + 1, 3);
    setProgress(newProgress);
    setImageUrl(chapterImages[newProgress] ?? null);

    // Advance to next question or bonus
    if (newProgress >= 3) {
      setShowWin(true);
      // Kick off video creation in background
      setVideoLoading(true);
      void (async () => {
        try {
          const res = await fetch('/api/video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: 'Captain Asher\'s progress through the jungle: portal stabilizes, clones appear, bridge restored.', durationSeconds: 8, aspectRatio: '16:9' }) });
          const data = await res.json();
          setVideoUrl(data?.url ?? null);
        } catch {
          setVideoUrl(null);
        } finally {
          setVideoLoading(false);
        }
      })();
    } else {
      setQuestionIndex(prev => {
        if (prev === 0) return 1; // second question
        // after two main questions, use bonus until reach 3
        return 2; // bonus index
      });
      setSelected(null);
    }
  }

  // Show landing page first
  if (showLandingPage) {
    return (
      <LandingPage 
        onSelectStory={handleSelectStory}
        onCreateNewStory={handleCreateNewStory}
      />
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `${isChatOpen ? '420px' : '0px'} 1fr`,
      gridTemplateRows: '100%',
      height: '100%',
      width: '100%',
      transition: 'grid-template-columns 200ms ease'
    }}>
      {/* Chat column */}
      <div
        id="chat-panel"
        aria-hidden={!isChatOpen}
        style={{
          borderRight: isChatOpen ? '1px solid #E5E7EB' : 'none',
          background: '#FFFFFF',
          overflow: 'hidden',
          pointerEvents: isChatOpen ? 'auto' : 'none'
        }}
      >
        {isChatOpen && <ChatPanel onGenerateImage={handleGenerate} />}
      </div>
      {/* Main column */}
      <div style={{ position: 'relative' }}>
        {/* Toggle chat arrow */}
        <button
          onClick={() => setIsChatOpen(v => !v)}
          aria-controls="chat-panel"
          aria-expanded={isChatOpen}
          style={{
            position: 'absolute',
            top: '50%',
            left: 8,
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: 44,
            height: 44,
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(0.95)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          title={isChatOpen ? 'Collapse chat' : 'Expand chat'}
          aria-label={isChatOpen ? 'Collapse chat' : 'Expand chat'}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>
            {isChatOpen ? '◀' : '▶'}
          </span>
        </button>

        <QuestionPanel
          onComplete={() => {
            console.log('All questions completed!');
            // Handle completion logic here
          }}
        />
      </div>
    </div>
  );
}
