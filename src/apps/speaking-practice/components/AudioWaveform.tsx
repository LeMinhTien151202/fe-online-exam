import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isRecording: boolean;
  audioStream?: MediaStream | null;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording, audioStream }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Setup Web Audio API when stream is active
  useEffect(() => {
    if (isRecording && audioStream) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        
        const source = audioCtx.createMediaStreamSource(audioStream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
      } catch (err) {
        console.error('Failed to setup audio analyser:', err);
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      dataArrayRef.current = null;
    };
  }, [isRecording, audioStream]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // Clear with slight transparency to create trail effect
      ctx.clearRect(0, 0, width, height);

      if (!isRecording) {
        // Draw a flat static line when not recording
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      // Read volume level from mic, otherwise default to simulation
      let volumeMultiplier = 0.5;
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current as unknown as Uint8Array<ArrayBuffer>);
        // Average frequency volume
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        const avg = sum / dataArrayRef.current.length;
        volumeMultiplier = Math.min(1.5, avg / 45); // Scale appropriately
      }

      phase += 0.15;

      // Draw 3 layers of overlapping sine waves for premium fluid design
      const waves = [
        { amplitude: 22 * volumeMultiplier, frequency: 0.015, speed: 0.08, opacity: 0.25, color: '#3b82f6' },
        { amplitude: 15 * volumeMultiplier, frequency: 0.025, speed: -0.05, opacity: 0.4, color: '#60a5fa' },
        { amplitude: 8 * volumeMultiplier, frequency: 0.01, speed: 0.03, opacity: 0.8, color: '#3b5b8c' }
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x < width; x++) {
          // Sine wave formula: y = middle + sin(x * freq + phase) * amp
          // Apply fade at borders
          const borderFade = Math.sin((x / width) * Math.PI);
          const y = height / 2 + Math.sin(x * wave.frequency + phase * wave.speed) * wave.amplitude * borderFade;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = wave === waves[2] ? 3 : 1.5;
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0; // Reset
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '1rem 0' }}>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={80} 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          height: '80px', 
          background: 'transparent',
          borderRadius: '8px'
        }} 
      />
    </div>
  );
};
