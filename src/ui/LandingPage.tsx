import React from 'react';
import { Button } from './components/Button';

type Props = {
  onSelectStory?: (storyId: string) => void;
  onCreateNewStory?: () => void;
};

export function LandingPage({ onSelectStory, onCreateNewStory }: Props): JSX.Element {
  const handleStorySelect = (storyId: string) => {
    onSelectStory?.(storyId);
  };

  const handleCreateNew = () => {
    onCreateNewStory?.();
  };

  const handlePublishStory = (storyId: string) => {
    console.log('Publishing story:', storyId);
    // Add your publish logic here
    alert('🎉 Story published successfully!');
  };

  const continueStories = [
    {
      id: 'create-new',
      title: 'Create New Story',
      emoji: '✨',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      isCreateNew: true,
      imageUrl: undefined,
      pages: undefined
    },
    {
      id: 'echo-library',
      title: 'Echo in the Library of Time',
      author: 'by Gregory, 3rd grade',
      pages: '3 pages',
      emoji: '📚',
      imageUrl: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252F106-Gregory%252F20250819_152705.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN',
      color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      isCreateNew: false
    }
  ];

  const topPicksStories = [
    {
      id: 'stella-tiny-frog',
      title: 'Stella and the Tiny Frog',
      author: 'by Irene Logue, 2nd grade',
      pages: '15 pages',
      badge: '❤️ "Best Friendship!"',
      imageUrl: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fdubeus2fv4wzz.cloudfront.net%252Fimages%252F20250819_154510_image.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN',
      emoji: '🐸',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'captain-asher-time-stranglers',
      title: 'Captain Asher and the Time Stranglers',
      author: 'by Asher Elliman, 3rd grade',
      pages: '65 pages',
      badge: '🌟 "Epic Twist!"',
      imageUrl: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FAsherE%252F20250815_174915.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN',
      emoji: '🚀',
      color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    }
  ];

  const StoryCard = ({ 
    title, 
    emoji, 
    color, 
    onClick, 
    isCreateNew = false,
    imageUrl,
    author,
    pages,
    badge,
    showPublishButton = false,
    onPublish
  }: { 
    title: string; 
    emoji: string; 
    color: string; 
    onClick: () => void;
    isCreateNew?: boolean;
    imageUrl?: string;
    author?: string;
    pages?: string;
    badge?: string;
    showPublishButton?: boolean;
    onPublish?: () => void;
  }) => (
    <div
      onClick={onClick}
      style={{
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px) scale(1)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
      }}
    >
      {imageUrl ? (
        /* Portrait book cover style */
        <>
          <div style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '3px solid rgba(255,255,255,0.9)',
            width: isCreateNew ? 240 : 280,
            flexShrink: 0
          }}>
            <img 
              src={imageUrl} 
              alt={title}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
          {/* Title and info below image */}
          <div style={{
            marginTop: 16,
            textAlign: 'center',
            maxWidth: isCreateNew ? 240 : 280
          }}>
            <h3 style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: '#1f2937',
              fontFamily: 'Quicksand, system-ui, sans-serif',
              lineHeight: 1.3,
              marginBottom: author ? 8 : 0
            }}>
              {title}
            </h3>
            {author && (
              <p style={{
                margin: 0,
                fontSize: 14,
                color: '#6b7280',
                fontWeight: 500,
                marginBottom: pages ? 4 : 0
              }}>
                {author}
              </p>
            )}
            {pages && (
              <p style={{
                margin: 0,
                fontSize: 12,
                color: '#9ca3af',
                fontWeight: 500,
                marginBottom: badge ? 8 : 0
              }}>
                {pages}
              </p>
            )}
            {badge && (
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '2px solid #f59e0b',
                borderRadius: 20,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                color: '#92400e',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
                marginBottom: showPublishButton ? 16 : 0
              }}>
                {badge}
              </div>
            )}
            {showPublishButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPublish?.();
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 200ms ease',
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                  marginTop: badge ? 0 : (pages ? 16 : (author ? 16 : 12))
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px) scale(0.95)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                }}
              >
                📚 Publish Story
              </button>
            )}
          </div>
        </>
      ) : (
        /* Traditional card style for non-image items */
        <div style={{
          background: color,
          borderRadius: 20,
          padding: '40px 32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: '2px solid rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: isCreateNew ? 240 : 180,
          width: isCreateNew ? 240 : '100%',
          maxWidth: isCreateNew ? 240 : 280,
          flexShrink: isCreateNew ? 0 : 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            gap: 12
          }}>
            <div style={{
              fontSize: isCreateNew ? 64 : 56,
              lineHeight: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              marginBottom: 12
            }}>
              {emoji}
            </div>
            <h3 style={{
              margin: 0,
              fontSize: isCreateNew ? 22 : 20,
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              {title}
            </h3>
            {isCreateNew && (
              <div style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                marginTop: 8
              }}>
                Start your adventure
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 24px',
      fontFamily: 'Quicksand, system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 48
      }}>
        {/* Welcome Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 20
        }}>
          <h1 style={{
            fontSize: 42,
            fontWeight: 700,
            color: '#1f2937',
            margin: 0,
            fontFamily: 'Quicksand, system-ui, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            📚 Welcome back, Gregory the author!
          </h1>
        </div>

        {/* Continue Your Story Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24
          }}>
            <span style={{ fontSize: 28 }}>📖</span>
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#1f2937',
              margin: 0,
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              Continue Your Story
            </h2>
          </div>
          
          <div style={{
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}>
            {continueStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                emoji={story.emoji}
                color={story.color}
                isCreateNew={story.isCreateNew}
                imageUrl={story.imageUrl}
                author={story.author}
                pages={story.pages}
                showPublishButton={story.id === 'echo-library'}
                onPublish={() => handlePublishStory(story.id)}
                onClick={() => story.isCreateNew ? handleCreateNew() : handleStorySelect(story.id)}
              />
            ))}
          </div>
        </div>

        {/* Top Picks Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24
          }}>
            <span style={{ fontSize: 28 }}>🔥</span>
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#1f2937',
              margin: 0,
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              Top Picks of the Week
            </h2>
          </div>
          
          <div style={{
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start'
          }}>
            {topPicksStories.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                emoji={story.emoji}
                color={story.color}
                imageUrl={story.imageUrl}
                author={story.author}
                pages={story.pages}
                badge={story.badge}
                onClick={() => handleStorySelect(story.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer spacing */}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
