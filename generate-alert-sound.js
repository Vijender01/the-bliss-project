// This script generates a short alert beep sound
// Run: node generate-alert-sound.js
import { writeFileSync } from 'fs';

// Generate a simple WAV beep
function generateBeep() {
  const sampleRate = 44100;
  const duration = 0.5; // seconds
  const frequency = 880; // Hz (A5 note)
  const numSamples = Math.floor(sampleRate * duration);

  // WAV header
  const headerSize = 44;
  const dataSize = numSamples * 2; // 16-bit samples
  const fileSize = headerSize + dataSize;

  const buffer = Buffer.alloc(fileSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20);  // PCM
  buffer.writeUInt16LE(1, 22);  // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);  // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate samples - two-tone beep
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = i < numSamples / 2 ? frequency : frequency * 1.5;
    const envelope = Math.min(1, Math.min(t * 20, (duration - t) * 20));
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.5 * envelope;
    buffer.writeInt16LE(Math.floor(sample * 32767), headerSize + i * 2);
  }

  return buffer;
}

const wavBuffer = generateBeep();
writeFileSync('public/alert.wav', wavBuffer);
console.log('✓ Alert sound generated: public/alert.wav');
