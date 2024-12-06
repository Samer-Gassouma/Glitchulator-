import { useEffect, useRef } from 'react';

interface DNAVisualizerProps {
  dna: string;
  rna: string;
  playing: boolean;
}

export function DNAVisualizer({ dna, rna, playing }: DNAVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let startTime = Date.now();

    const colorMap = {
      'A': '#FF4136',
      'T': '#2ECC40',
      'U': '#B10DC9',
      'G': '#FFDC00',
      'C': '#0074D9',
    };

    const basePairs: { [key: string]: string } = {
      'A': 'T',
      'T': 'A',
      'G': 'C',
      'C': 'G',
      'U': 'A'
    };

    const drawHelix = (x: number, y: number, width: number, height: number, rotation: number) => {
      const points = 40;
      const amplitude = height / 4;
      const frequency = Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let i = 0; i <= points; i++) {
        const px = x + (i * width / points);
        const py = y + Math.sin(i * frequency / points + rotation) * amplitude;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const px = x + (i * width / points);
        const py = y + Math.sin(i * frequency / points + rotation + Math.PI) * amplitude;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const rotation = (elapsed / 2000) * Math.PI * 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.shadowBlur = playing ? 15 : 0;
      ctx.shadowColor = '#4CAF50';
      ctx.fillStyle = playing ? '#4CAF50' : '#666';
      ctx.fillText('DNA Transcription Process', canvas.width / 2, 30);
      ctx.shadowBlur = 0;

      const dnaSequences = dna.split('-');
      const rnaSequences = rna.split('-');

      const helixWidth = canvas.width - 100;
      const helixHeight = 120;
      const startY = 80;

      drawHelix(50, startY, helixWidth, helixHeight, rotation);

      dnaSequences.forEach((codon, index) => {
        const segmentWidth = helixWidth / dnaSequences.length;
        const x = 50 + index * segmentWidth + segmentWidth / 2;

        codon.split('').forEach((base, baseIndex) => {
          const baseX = x + (baseIndex - 1.5) * 20;
          const rotationOffset = (index + baseIndex * 0.3) * (Math.PI * 2 / dnaSequences.length) + rotation;
          const yOffset = Math.sin(rotationOffset) * (helixHeight / 4);
          const baseY = startY + yOffset;
          const complementY = startY - yOffset;
          const complementBase = basePairs[base];

          ctx.beginPath();
          ctx.moveTo(baseX, baseY);
          ctx.lineTo(baseX, complementY);
          const gradient = ctx.createLinearGradient(baseX, baseY, baseX, complementY);
          gradient.addColorStop(0, colorMap[base as keyof typeof colorMap] + '88');
          gradient.addColorStop(1, colorMap[complementBase as keyof typeof colorMap] + '88');
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();

          const drawBase = (y: number, baseLetter: string, isComplement: boolean = false) => {
            ctx.shadowBlur = playing ? 10 : 0;
            ctx.shadowColor = colorMap[baseLetter as keyof typeof colorMap];
            
            const gradient = ctx.createRadialGradient(baseX, y, 0, baseX, y, 12);
            gradient.addColorStop(0, colorMap[baseLetter as keyof typeof colorMap] + 'FF');
            gradient.addColorStop(1, colorMap[baseLetter as keyof typeof colorMap] + '88');
            
            ctx.beginPath();
            ctx.arc(baseX, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(baseLetter, baseX, y + 4);
          };

          drawBase(baseY, base);
          drawBase(complementY, complementBase, true);
        });
      });

      if (rnaSequences.length > 0) {
        const rnaY = startY + helixHeight + 60;
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'left';
        ctx.fillText('RNA Transcript:', 50, rnaY - 20);

        ctx.beginPath();
        ctx.moveTo(50, rnaY);
        for (let i = 0; i < rnaSequences.length * 4; i++) {
          const x = 50 + i * 20;
          const y = rnaY + Math.sin(i * 0.5 + rotation) * 10;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        rnaSequences.forEach((codon, index) => {
          codon.split('').forEach((base, baseIndex) => {
            const baseX = 50 + (index * 4 + baseIndex) * 20;
            const baseY = rnaY + Math.sin((index * 4 + baseIndex) * 0.5 + rotation) * 10;
            
            const gradient = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, 12);
            gradient.addColorStop(0, colorMap[base as keyof typeof colorMap] + 'FF');
            gradient.addColorStop(1, colorMap[base as keyof typeof colorMap] + '88');

            ctx.shadowBlur = playing ? 8 : 0;
            ctx.shadowColor = colorMap[base as keyof typeof colorMap];
            ctx.beginPath();
            ctx.arc(baseX, baseY, 8, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(base, baseX, baseY + 4);
          });
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [dna, rna, playing]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-96 bg-white dark:bg-gray-800 rounded-lg"
      width={800}
      height={500}
    />
  );
} 