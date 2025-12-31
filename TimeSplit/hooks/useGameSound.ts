
import { useState, useEffect, useRef, useCallback } from 'react';

// --- UTILITY: NOISE GENERATION ---
const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'pink' | 'brown'): AudioBuffer => {
  const bufferSize = 2 * ctx.sampleRate; // 2 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // (roughly) compensate for gain
      b6 = white * 0.115926;
    }
  } else if (type === 'brown') {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // compensate for gain
    }
  }
  return buffer;
};

export const useGameSound = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeAmbienceRef = useRef<{ stop: () => void } | null>(null);
  const noiseBuffersRef = useRef<Record<string, AudioBuffer>>({});
  
  // References for continuous sounds to allow stopping them
  const chargeOscRef = useRef<OscillatorNode | null>(null);
  const chargeGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context & Noise Buffers
  useEffect(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;
        
        // Pre-generate noise buffers
        noiseBuffersRef.current = {
            white: createNoiseBuffer(ctx, 'white'),
            pink: createNoiseBuffer(ctx, 'pink'),
            brown: createNoiseBuffer(ctx, 'brown'),
        };
      }
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }

    const storedMute = localStorage.getItem('timeSplitMute');
    if (storedMute) setIsMuted(storedMute === 'true');

    return () => {
        // Cleanup
        if (activeAmbienceRef.current) activeAmbienceRef.current.stop();
        if (chargeOscRef.current) {
            try { chargeOscRef.current.stop(); } catch(e) {}
        }
        audioContextRef.current?.close();
    };
  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    localStorage.setItem('timeSplitMute', String(newState));
    
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (newState) {
        ctx.suspend();
    } else {
        ctx.resume();
    }
  };

  const ensureContext = () => {
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === 'suspended' && !isMuted) {
          ctx.resume();
      }
      return ctx;
  };

  // --- AMBIENCE ENGINE ---
  const playAmbient = useCallback((theme: string) => {
      if (isMuted) return;
      const ctx = ensureContext();
      if (!ctx) return;

      if (activeAmbienceRef.current) {
          activeAmbienceRef.current.stop();
          activeAmbienceRef.current = null;
      }

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0; 
      masterGain.connect(ctx.destination);
      masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 2);

      const nodes: AudioNode[] = []; 

      if (theme === 'theme_ocean') {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffersRef.current.pink;
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.Q.value = 1;
          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.15; 
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 400; 
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          filter.frequency.value = 600; 
          src.connect(filter);
          filter.connect(masterGain);
          src.start();
          lfo.start();
          nodes.push(src, lfo, lfoGain, filter);
      } 
      else if (theme === 'theme_lava') {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffersRef.current.brown;
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 200; 
          src.connect(filter);
          filter.connect(masterGain);
          src.start();
          nodes.push(src, filter);
      }
      else if (theme === 'theme_cyber') {
          const osc1 = ctx.createOscillator();
          osc1.type = 'sawtooth';
          osc1.frequency.value = 55; 
          const osc2 = ctx.createOscillator();
          osc2.type = 'sawtooth';
          osc2.frequency.value = 55.5; 
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 400;
          filter.Q.value = 2;
          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(masterGain);
          osc1.start();
          osc2.start();
          nodes.push(osc1, osc2, filter);
      }
      else if (theme === 'theme_forest') {
          const src = ctx.createBufferSource();
          src.buffer = noiseBuffersRef.current.white;
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 600;
          filter.Q.value = 1;
          const lfo = ctx.createOscillator();
          lfo.frequency.value = 0.2;
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 200;
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          src.connect(filter);
          filter.connect(masterGain);
          src.start();
          lfo.start();
          nodes.push(src, filter, lfo, lfoGain);
      }
      else {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = 110;
          const gain = ctx.createGain();
          gain.gain.value = 0.02; 
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          nodes.push(osc, gain);
      }

      nodes.push(masterGain);

      activeAmbienceRef.current = {
          stop: () => {
              if (ctx.state !== 'closed') {
                  masterGain.gain.cancelScheduledValues(ctx.currentTime);
                  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
                  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
                  setTimeout(() => {
                      nodes.forEach(n => {
                          try { 
                              if (n instanceof AudioBufferSourceNode || n instanceof OscillatorNode) n.stop(); 
                              n.disconnect(); 
                          } catch(e) {} 
                      });
                  }, 1100);
              }
          }
      };

  }, [isMuted]);

  const stopAmbient = useCallback(() => {
      if (activeAmbienceRef.current) {
          activeAmbienceRef.current.stop();
          activeAmbienceRef.current = null;
      }
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) => {
    if (isMuted) return;
    const ctx = ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  }, [isMuted]);

  // --- NEW JUICE SOUNDS ---

  const playChargeUp = useCallback(() => {
      if (isMuted) return;
      const ctx = ensureContext();
      if (!ctx) return;

      if (chargeOscRef.current) return; // Already playing

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 3); // Rise over 3s

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1); // Quick fade in

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      chargeOscRef.current = osc;
      chargeGainRef.current = gain;
  }, [isMuted]);

  const stopChargeUp = useCallback(() => {
      if (chargeOscRef.current) {
          const ctx = audioContextRef.current;
          if (ctx && chargeGainRef.current) {
              const now = ctx.currentTime;
              chargeGainRef.current.gain.cancelScheduledValues(now);
              chargeGainRef.current.gain.setValueAtTime(chargeGainRef.current.gain.value, now);
              chargeGainRef.current.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
              chargeOscRef.current.stop(now + 0.1);
          } else {
              try { chargeOscRef.current.stop(); } catch(e){}
          }
          chargeOscRef.current = null;
          chargeGainRef.current = null;
      }
  }, []);

  const playCoinFlight = useCallback(() => {
      if (isMuted) return;
      const ctx = ensureContext();
      if (!ctx) return;

      // Burst of rapid high notes
      const now = ctx.currentTime;
      for(let i=0; i<8; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          // Pentatonic-ish random high notes
          const freq = 1200 + (Math.random() * 800);
          
          osc.frequency.setValueAtTime(freq, now + (i * 0.08));
          gain.gain.setValueAtTime(0.05, now + (i * 0.08));
          gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.08) + 0.1);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.08));
          osc.stop(now + (i * 0.08) + 0.1);
      }
  }, [isMuted]);

  const playChainBreak = useCallback(() => {
      if (isMuted) return;
      const ctx = ensureContext();
      if (!ctx) return;

      // Heavy metallic impact
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      // Noise burst for "shatter"
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffersRef.current.white;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      noise.start();
      noise.stop(ctx.currentTime + 0.3);
  }, [isMuted]);

  const playLaser = useCallback(() => {
      if (isMuted) return;
      const ctx = ensureContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15); // Fast drop

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
  }, [isMuted]);

  // --- EXISTING SFX ---
  const playCorrect = useCallback((trailVariant: string = 'trail_default') => {
      if (isMuted) return;
      const ctx = ensureContext();
      if (!ctx) return;

      playTone(523.25, 'sine', 0.1, 0, 0.1); 
      playTone(659.25, 'sine', 0.1, 0.08, 0.1);

      if (trailVariant === 'trail_fire') {
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffersRef.current.white;
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'lowpass';
          noiseFilter.frequency.setValueAtTime(800, ctx.currentTime);
          noiseFilter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noise.start();
          noise.stop(ctx.currentTime + 0.3);
      } 
      else if (trailVariant === 'trail_ice') {
          playTone(2000, 'triangle', 0.1, 0, 0.05);
          playTone(3500, 'sine', 0.05, 0.05, 0.03);
      }
      else if (trailVariant === 'trail_matrix') {
          const osc = ctx.createOscillator();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.05);
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
      }
      else if (trailVariant === 'trail_rainbow') {
           playTone(1046.50, 'sine', 0.2, 0.05, 0.05); 
      }
  }, [playTone, isMuted]);

  const playCombo = useCallback((streak: number) => {
    if (streak >= 5) {
       playTone(523.25, 'triangle', 0.2, 0, 0.1); 
       playTone(659.25, 'triangle', 0.2, 0.05, 0.1); 
       playTone(783.99, 'triangle', 0.3, 0.1, 0.1); 
       playTone(1046.50, 'sine', 0.4, 0.15, 0.15); 
       return;
    }
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    const freq = freqs[Math.min(streak - 1, 3)];
    playTone(freq, 'sine', 0.15, 0, 0.15);
    if (streak > 2) {
        playTone(freq / 2, 'triangle', 0.15, 0, 0.05);
    }
  }, [playTone]);

  const playWrong = useCallback(() => {
      playTone(150, 'sawtooth', 0.2, 0, 0.08);
      playTone(110, 'sawtooth', 0.4, 0.1, 0.08);
  }, [playTone]);

  const playDamage = useCallback(() => {
     if (isMuted) return;
     const ctx = ensureContext();
     if (!ctx) return;
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.type = 'sawtooth';
     osc.frequency.setValueAtTime(150, ctx.currentTime);
     osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
     gain.gain.setValueAtTime(0.3, ctx.currentTime);
     gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.start();
     osc.stop(ctx.currentTime + 0.3);
  }, [isMuted]);

  const playGameOver = useCallback(() => {
     if (isMuted) return;
     const ctx = ensureContext();
     if (!ctx) return;
     const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
     };
     playNote(392.00, 0, 0.4); 
     playNote(369.99, 0.4, 0.4); 
     playNote(349.23, 0.8, 0.4); 
     playNote(311.13, 1.2, 1.0); 
  }, [isMuted]);
  
  const playAttack = useCallback(() => {
     if (isMuted) return;
     const ctx = ensureContext();
     if (!ctx) return;
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.type = 'square';
     osc.frequency.setValueAtTime(800, ctx.currentTime);
     osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
     gain.gain.setValueAtTime(0.05, ctx.currentTime);
     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.start();
     osc.stop(ctx.currentTime + 0.15);
  }, [isMuted]);

  const playWin = useCallback(() => {
     const noteLen = 0.12;
     const vol = 0.1;
     playTone(523.25, 'square', noteLen, 0, vol); 
     playTone(659.25, 'square', noteLen, noteLen, vol); 
     playTone(783.99, 'square', noteLen, noteLen*2, vol); 
     playTone(1046.50, 'square', 0.8, noteLen*3, vol); 
     playTone(523.25, 'sine', 0.8, noteLen*3, vol); 
  }, [playTone]);

  return { 
      isMuted, 
      toggleMute, 
      playCorrect, 
      playCombo, 
      playWrong, 
      playDamage, 
      playGameOver, 
      playAttack, 
      playWin, 
      playAmbient, 
      stopAmbient,
      playChargeUp,
      stopChargeUp,
      playCoinFlight,
      playChainBreak,
      playLaser
  };
};
