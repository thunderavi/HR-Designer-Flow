import React, { useState, useEffect } from 'react';
import { Layers, MousePointer2, Settings, PlayCircle, X } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    icon: <Layers size={48} color="var(--accent-primary)" />,
    title: "Welcome to HR Component",
    description: "Visually design, map, and simulate your entire HR workflow infrastructure securely in your browser."
  },
  {
    icon: <MousePointer2 size={48} color="#38bdf8" />,
    title: "Drag & Drop Canvas",
    description: "Grab components from the Sidebar hierarchy and drag them onto the canvas. Connect nodes smoothly by dragging from their external dots."
  },
  {
    icon: <Settings size={48} color="#c084fc" />,
    title: "Dynamic Properties",
    description: "Click any node on your canvas to instantly configure its rules, adjust parameters, or tie internal logic together inside the right-hand Panel."
  },
  {
    icon: <PlayCircle size={48} color="#10b981" />,
    title: "Run Simulations",
    description: "When your flowchart is ready, open the Sandbox Panel to run an algorithmic trace and verify your logic structural paths before deploying!"
  }
];

const OnboardingModal = () => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('has_seen_tutorial');
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleComplete = () => {
    localStorage.setItem('has_seen_tutorial', 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const currentInfo = TUTORIAL_STEPS[step];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{
        background: 'var(--panel-bg)', color: 'var(--text-primary)',
        width: '450px', padding: '32px', borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        position: 'relative', border: '1px solid var(--border-color)'
      }}>
        <button onClick={handleComplete} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
          <X size={20} />
        </button>
        
        <div style={{ marginBottom: '24px', background: 'var(--bg-canvas)', borderRadius: '50%', padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {currentInfo.icon}
        </div>
        
        <h2 style={{ marginBottom: '12px', fontSize: '1.4rem' }}>{currentInfo.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '32px' }}>
          {currentInfo.description}
        </p>

        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={handleComplete} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, padding: '8px' }}>
            Skip
          </button>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            {TUTORIAL_STEPS.map((_, i) => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === step ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'background 0.3s' }} />
            ))}
          </div>

          <button onClick={handleNext} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
            {step === TUTORIAL_STEPS.length - 1 ? "Let's Go!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
