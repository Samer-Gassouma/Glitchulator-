import { useEffect, useRef } from 'react';

interface Note {
  note: string;
  duration: number;
  frequency: number;
}

interface MusicalSheetProps {
  notes: Note[];
  playing: boolean;
}

export function MusicalSheet({ notes, playing }: MusicalSheetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
        
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#666');
      gradient.addColorStop(0.5, '#888');
      gradient.addColorStop(1, '#666');

      const lineHeight = canvas.height / 12;
      for (let i = 3; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * lineHeight);
        ctx.lineTo(canvas.width, i * lineHeight);
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }

      const noteWidth = canvas.width / (notes.length || 1);
      notes.forEach((note, index) => {
        if (note.note === 'REST') return;

        const [noteName, octave] = note.note.split('');
        const notePosition = getNotePosition(noteName, parseInt(octave));
        const y = (notePosition * lineHeight / 2) + lineHeight;
        const x = index * noteWidth + noteWidth / 2;

        const noteAge = elapsed - (index * 300);
        const baseOpacity = playing ? 
          Math.min(noteAge / 1000, 1) : 1;
        
        const pulseFrequency = 2;
        const pulseDepth = 0.2;
        const pulse = playing ? 
          1 - (pulseDepth * Math.sin(noteAge * pulseFrequency / 1000)) : 1;
        
        const finalOpacity = baseOpacity * pulse;

        const glow = playing ? 20 : 0;
        ctx.shadowBlur = glow;
        ctx.shadowColor = playing ? '#4CAF50' : '#000';

        ctx.beginPath();
        ctx.ellipse(x, y, lineHeight/3, lineHeight/4, 0, 0, Math.PI * 2);
        ctx.fillStyle = playing ? 
          `rgba(76, 175, 80, ${finalOpacity})` : 
          `rgba(0, 0, 0, ${finalOpacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x + lineHeight/3, y);
        ctx.lineTo(x + lineHeight/3, y - lineHeight * 1.5);
        ctx.strokeStyle = playing ? 
          `rgba(76, 175, 80, ${finalOpacity})` : 
          `rgba(0, 0, 0, ${finalOpacity})`;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(100, 100, 100, ${finalOpacity})`;
        ctx.font = '10px monospace';
        const freqY = y + 20 + Math.sin(noteAge / 500) * 3;
        ctx.fillText(`${note.frequency}Hz`, x - 20, freqY);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [notes, playing]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-32 bg-white dark:bg-gray-800 rounded-lg"
      width={800}
      height={200}
    />
  );
}

function getNotePosition(note: string, octave: number): number {
  const basePositions: { [key: string]: number } = {
    'C': 0, 'D': -1, 'E': -2, 'F': -3, 'G': -4, 'A': -5, 'B': -6
  };
  return basePositions[note] + (4 - octave) * 7;
} 