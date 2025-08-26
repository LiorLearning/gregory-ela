import React, { useState, useCallback } from 'react';

type ImageSlot = {
  id: string;
  label: string;
  imageUrl?: string;
  hasImage: boolean;
};

type Props = {
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function LondonPictureBook({ onBack, onNext, onPrevious }: Props): JSX.Element {
  // Character and scene image state
  const [characterImages, setCharacterImages] = useState<ImageSlot[]>([
    { id: 'london', label: 'London', hasImage: false },
    { id: 'sidekick-1', label: 'Blonde Sidekick', hasImage: true, imageUrl: 'https://d1ptidrpttdm41.cloudfront.net/AsherE/20250815_174915.png' },
    { id: 'sidekick-2', label: 'Sprinkle Beast', hasImage: false }
  ]);

  const [baseImages, setBaseImages] = useState<ImageSlot[]>([
    { id: 'home-base', label: 'Magical Bakery', hasImage: false }
  ]);

  const [villainImages, setVillainImages] = useState<ImageSlot[]>([
    { id: 'villain-1', label: 'Chaotic Forces', hasImage: false }
  ]);

  const [sceneImages, setSceneImages] = useState<ImageSlot[]>([
    { 
      id: 'scene-1', 
      label: 'Cupcake Day', 
      hasImage: true, 
      imageUrl: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FAsherE%252F20250815_172218.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN' 
    },
    { 
      id: 'scene-2', 
      label: 'Frosting Storm', 
      hasImage: true, 
      imageUrl: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FAsherE%252F20250815_173728.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN' 
    },
    { 
      id: 'scene-3', 
      label: 'Cake Day Prep', 
      hasImage: true, 
      imageUrl: 'https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FAsherE%252F20250815_174411.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN' 
    }
  ]);

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentGeneratingId, setCurrentGeneratingId] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Add slots functions
  const addCharacterSlot = useCallback(() => {
    const newId = `sidekick-${Date.now()}`;
    setCharacterImages(prev => [...prev, { 
      id: newId, 
      label: 'New Character', 
      hasImage: false 
    }]);
  }, []);

  const addBaseSlot = useCallback(() => {
    const newId = `home-base-${Date.now()}`;
    setBaseImages(prev => [...prev, { 
      id: newId, 
      label: 'New Location', 
      hasImage: false 
    }]);
  }, []);

  const addVillainSlot = useCallback(() => {
    const newId = `villain-${Date.now()}`;
    setVillainImages(prev => [...prev, { 
      id: newId, 
      label: 'New Villain', 
      hasImage: false 
    }]);
  }, []);

  const addSceneSlot = useCallback(() => {
    const newId = `scene-${Date.now()}`;
    setSceneImages(prev => [...prev, { 
      id: newId, 
      label: 'New Scene', 
      hasImage: false 
    }]);
  }, []);

  // Image generation function
  const generateImage = useCallback(async (id: string) => {
    setIsGeneratingImage(true);
    setCurrentGeneratingId(id);
    
    try {
      let prompt = '';
      
      // Define prompts based on character/scene
      if (id === 'london') {
        prompt = 'London, a teenage girl with blonde hair wearing sparkly star and heart dress, cheerful and imaginative, magical bakery adventure style, realistic art';
      } else if (id === 'sidekick-1') {
        prompt = 'Blonde teenage girl in sparkly star and heart dress, same age as London, best friend and baking companion, magical bakery setting, realistic art';
      } else if (id === 'sidekick-2') {
        prompt = 'Sprinkle Beast, giant cupcake monster with whipped cream hair and sprinkle eyes, friendly magical creature, bakery companion, realistic art';
      } else if (id.startsWith('sidekick-')) {
        prompt = 'New magical bakery character, whimsical and friendly, enchanted bakery setting, realistic art';
      } else if (id.startsWith('home-base')) {
        prompt = 'Magical enchanted bakery with glowing ovens, rainbow frosting shelves, floating spatulas, whipped cream clouds, sparkly magical atmosphere, realistic art';
      } else if (id.startsWith('villain-')) {
        prompt = 'Chaotic magical forces, swirling frosting storms, mischievous singing cupcakes, gumdrop traps, magical bakery chaos, whimsical but dramatic, realistic art';
      } else if (id.startsWith('scene-')) {
        const sceneNumber = id.split('-')[1];
        prompt = `London magical bakery adventure scene ${sceneNumber}, enchanted baking challenge, frosting storms, magical ingredients, whimsical bakery setting, realistic art`;
      }

      // Log image generation details for London PictureBook
      console.log('=== LONDON PICTURE BOOK IMAGE GENERATION ===');
      console.log('Function: LondonPictureBook.generateImage');
      console.log('ID:', id);
      console.log('Generated prompt:', prompt);
      console.log('============================================');

      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const newImageUrl = data.imageUrl;
      
      // Update the appropriate state based on ID
      if (id === 'london' || id.startsWith('sidekick-')) {
        setCharacterImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, hasImage: true, imageUrl: newImageUrl }
            : img
        ));
      } else if (id.startsWith('home-base') || id === 'home-base') {
        setBaseImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, hasImage: true, imageUrl: newImageUrl }
            : img
        ));
      } else if (id.startsWith('villain-')) {
        setVillainImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, hasImage: true, imageUrl: newImageUrl }
            : img
        ));
      } else if (id.startsWith('scene-')) {
        setSceneImages(prev => prev.map(img => 
          img.id === id 
            ? { ...img, hasImage: true, imageUrl: newImageUrl }
            : img
        ));
      }

    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
      setCurrentGeneratingId(null);
    }
  }, []);

  const handleEditName = useCallback((id: string, newName: string) => {
    if (id === 'london' || id.startsWith('sidekick-')) {
      setCharacterImages(prev => prev.map(img => 
        img.id === id ? { ...img, label: newName } : img
      ));
    } else if (id.startsWith('home-base') || id === 'home-base') {
      setBaseImages(prev => prev.map(img => 
        img.id === id ? { ...img, label: newName } : img
      ));
    } else if (id.startsWith('villain-')) {
      setVillainImages(prev => prev.map(img => 
        img.id === id ? { ...img, label: newName } : img
      ));
    } else if (id.startsWith('scene-')) {
      setSceneImages(prev => prev.map(img => 
        img.id === id ? { ...img, label: newName } : img
      ));
    }
    setEditingSlot(null);
    setEditingName('');
  }, []);

  const handleDeleteImage = useCallback((id: string) => {
    if (id === 'london' || id.startsWith('sidekick-')) {
      setCharacterImages(prev => prev.map(img => 
        img.id === id ? { ...img, hasImage: false, imageUrl: undefined } : img
      ));
    } else if (id.startsWith('home-base') || id === 'home-base') {
      setBaseImages(prev => prev.map(img => 
        img.id === id ? { ...img, hasImage: false, imageUrl: undefined } : img
      ));
    } else if (id.startsWith('villain-')) {
      setVillainImages(prev => prev.map(img => 
        img.id === id ? { ...img, hasImage: false, imageUrl: undefined } : img
      ));
    } else if (id.startsWith('scene-')) {
      setSceneImages(prev => prev.map(img => 
        img.id === id ? { ...img, hasImage: false, imageUrl: undefined } : img
      ));
    }
  }, []);

  const ImageSlotComponent = ({ slot, width, height }: { slot: ImageSlot; width: number; height: number }) => {
    const isGenerating = currentGeneratingId === slot.id;
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }}>
        <div style={{
          width,
          height,
          borderRadius: 16,
          background: slot.hasImage && slot.imageUrl 
            ? `url(${slot.imageUrl})` 
            : 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '2px solid #ec4899',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 200ms ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
        onClick={() => !isGenerating && generateImage(slot.id)}
        onMouseEnter={(e) => {
          if (!isGenerating) {
            e.currentTarget.style.borderColor = '#be185d';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#ec4899';
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        }}>
          
          {isGenerating && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              zIndex: 10
            }}>
              <div style={{
                width: 48,
                height: 48,
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}

          {!slot.hasImage && !isGenerating && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              color: '#be185d'
            }}>
              <div style={{ fontSize: 48, fontWeight: 300 }}>+</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Generate</div>
            </div>
          )}

          {slot.hasImage && slot.imageUrl && (
            <div style={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 4
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(slot.id);
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.9)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        <div style={{
          padding: '8px 16px',
          borderRadius: 8,
          background: slot.hasImage ? '#10b981' : 'transparent',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'Quicksand, system-ui, sans-serif',
          color: slot.hasImage ? 'white' : '#be185d'
        }}>
          {slot.hasImage ? 'Regenerate' : 'Generate'}
        </div>
        
        {editingSlot === slot.id ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditName(slot.id, editingName);
                } else if (e.key === 'Escape') {
                  setEditingSlot(null);
                  setEditingName('');
                }
              }}
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Quicksand, system-ui, sans-serif',
                textAlign: 'center',
                border: '2px solid #ec4899',
                borderRadius: 8,
                padding: '4px 8px',
                background: 'white',
                outline: 'none',
                minWidth: 120
              }}
              autoFocus
            />
            <button
              onClick={() => handleEditName(slot.id, editingName)}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#10b981',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}
            >
              ✓
            </button>
            <button
              onClick={() => {
                setEditingSlot(null);
                setEditingName('');
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <h3 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: '#374151',
            fontFamily: 'Quicksand, system-ui, sans-serif',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => {
            setEditingSlot(slot.id);
            setEditingName(slot.label);
          }}>
            {slot.label}
          </h3>
        )}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={{
        minHeight: '100vh',
        background: 'white',
        fontFamily: 'Quicksand, system-ui, sans-serif',
        position: 'relative'
      }}>
        {/* Colored Header Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
          padding: '32px',
          marginBottom: 32
        }}>
          <div style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              margin: 0,
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              Asher's World
            </h1>
            
            <div style={{ display: 'flex', gap: 16 }}>
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: 'Quicksand, system-ui, sans-serif',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 200ms ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                >
                  ← Previous
                </button>
              )}
              
              <button
                onClick={onBack}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 200ms ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
              >
                Back to Library
              </button>
              
              {onNext && (
                <button
                  onClick={onNext}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: 'Quicksand, system-ui, sans-serif',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 200ms ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 32px'
        }}>

          {/* Characters Section */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#be185d',
              margin: '0 0 32px 0',
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              Asher and Friends
            </h2>
            
            <div style={{
              display: 'flex',
              gap: 40,
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}>
              {characterImages.map((slot) => (
                <ImageSlotComponent 
                  key={slot.id} 
                  slot={slot} 
                  width={280} 
                  height={200} 
                />
              ))}
              
              {/* Add More Button */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16
              }}>
                <div style={{
                  width: 280,
                  height: 200,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                  border: '2px dashed #ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                onClick={addCharacterSlot}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#be185d';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ec4899';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
                }}>
                  <div style={{
                    fontSize: 48,
                    color: '#ec4899',
                    fontWeight: 300
                  }}>
                    +
                  </div>
                </div>
                
                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                  color: '#be185d'
                }}>
                  Add More
                </div>
              </div>
            </div>
          </div>

          {/* Base Section */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#be185d',
              margin: '0 0 32px 0',
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              Magical Bakery
            </h2>
            
            <div style={{
              display: 'flex',
              gap: 40,
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}>
              {baseImages.map((slot) => (
                <ImageSlotComponent 
                  key={slot.id} 
                  slot={slot} 
                  width={280} 
                  height={200} 
                />
              ))}
              
              {/* Add More Button */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16
              }}>
                <div style={{
                  width: 280,
                  height: 200,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                  border: '2px dashed #ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                onClick={addBaseSlot}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#be185d';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ec4899';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
                }}>
                  <div style={{
                    fontSize: 48,
                    color: '#ec4899',
                    fontWeight: 300
                  }}>
                    +
                  </div>
                </div>
                
                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                  color: '#be185d'
                }}>
                  Add More
                </div>
              </div>
            </div>
          </div>

          {/* Villains Section */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#be185d',
              margin: '0 0 32px 0',
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              Chaotic Forces
            </h2>
            
            <div style={{
              display: 'flex',
              gap: 40,
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}>
              {villainImages.map((slot) => (
                <ImageSlotComponent 
                  key={slot.id} 
                  slot={slot} 
                  width={280} 
                  height={200} 
                />
              ))}
              
              {/* Add More Button */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16
              }}>
                <div style={{
                  width: 280,
                  height: 200,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                  border: '2px dashed #ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                onClick={addVillainSlot}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#be185d';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ec4899';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
                }}>
                  <div style={{
                    fontSize: 48,
                    color: '#ec4899',
                    fontWeight: 300
                  }}>
                    +
                  </div>
                </div>
                
                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                  color: '#be185d'
                }}>
                  Add More
                </div>
              </div>
            </div>
          </div>

          {/* Adventure Scenes Section */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#be185d',
              margin: '0 0 32px 0',
              fontFamily: 'Quicksand, system-ui, sans-serif'
            }}>
              Adventure Scenes
            </h2>
            
            <div style={{
              display: 'flex',
              gap: 40,
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}>
              {sceneImages.map((slot) => (
                <ImageSlotComponent 
                  key={slot.id} 
                  slot={slot} 
                  width={280} 
                  height={200} 
                />
              ))}
              
              {/* Add More Button */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16
              }}>
                <div style={{
                  width: 280,
                  height: 200,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                  border: '2px dashed #ec4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
                onClick={addSceneSlot}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#be185d';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ec4899';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)';
                }}>
                  <div style={{
                    fontSize: 48,
                    color: '#ec4899',
                    fontWeight: 300
                  }}>
                    +
                  </div>
                </div>
                
                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'transparent',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                  color: '#be185d'
                }}>
                  Add More
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}