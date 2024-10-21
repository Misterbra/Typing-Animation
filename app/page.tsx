"use client";

import React, { useState, useRef, useEffect } from 'react';
import TypeIt from 'typeit';
import styles from './Home.module.css';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      const element = elementRef.current;
      if (canvas && element) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          const fontSize = Math.min(36, Math.max(18, Math.floor(canvas.width / 20)));
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const maxWidth = canvas.width * 0.8;
          const lineHeight = fontSize * 1.5;
          const words = element.innerText.split(' ');
          let lines = [];
          let currentLine = words[0];

          for (let i = 1; i < words.length; i++) {
            let testLine = currentLine + ' ' + words[i];
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
              lines.push(currentLine);
              currentLine = words[i];
            } else {
              currentLine = testLine;
            }
          }
          lines.push(currentLine);

          lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (index - (lines.length - 1) / 2) * lineHeight);
          });
        }
      }
      requestAnimationFrame(renderCanvas);
    };
    renderCanvas();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startProcessing = () => {
    if (isProcessing || !inputText) return;
    setIsProcessing(true);

    // Start recording
    chunksRef.current = [];
    const stream = canvasRef.current?.captureStream(30);
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=h264'
      });
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const webmBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        const response = await fetch(URL.createObjectURL(webmBlob));
        const arrayBuffer = await response.arrayBuffer();
        const mp4Blob = new Blob([arrayBuffer], { type: 'video/mp4' });
        
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'typing-video.mp4';
        a.click();
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      };
      
      mediaRecorderRef.current.start();

      // Start typing
      if (elementRef.current) {
        new TypeIt(elementRef.current, {
          strings: inputText,
          speed: 80,
          afterComplete: () => {
            setTimeout(() => {
              mediaRecorderRef.current?.stop();
            }, 1000); // Wait 1 second after typing before stopping
          }
        }).go();
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.typingArea}>
        <div ref={elementRef}></div>
        <canvas ref={canvasRef} style={{display: 'none'}}></canvas>
      </div>
      <div className={styles.controls}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your story..."
          className={styles.input}
          disabled={isProcessing}
        />
        <button 
          onClick={startProcessing} 
          className={styles.button}
          disabled={isProcessing}
        >
          {isProcessing ? '✨ Processing...' : '✨ Create Video'}
        </button>
      </div>
    </div>
  );
}