import { EnterpriseAdditionLogic } from './addition-logic';

export class EnterpriseSubtractionLogic {
  private static readonly enterpriseStates = {
    INITIALIZING: 'INITIALIZING',
    MORSE_CONVERTING: 'MORSE_CONVERTING',
    COLOR_CONVERTING: 'COLOR_CONVERTING',
    PROCESSING: 'PROCESSING',
    VALIDATING: 'VALIDATING'
  };

  // Color codes for number representation
  private static readonly numberToColor: { [key: string]: string } = {
    '0': '#000000', '1': '#111111', '2': '#222222',
    '3': '#333333', '4': '#444444', '5': '#555555',
    '6': '#666666', '7': '#777777', '8': '#888888',
    '9': '#999999', '-': '#CCCCCC'
  };

  private static readonly morseCode: { [key: string]: string } = {
    '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..',
    '9': '----.',
    '-': '-....-'
  };

  // Musical notes for number encoding
  private static readonly numberToNote: { [key: string]: string } = {
    '0': 'C4', '1': 'D4', '2': 'E4', '3': 'F4', '4': 'G4',
    '5': 'A4', '6': 'B4', '7': 'C5', '8': 'D5', '9': 'E5',
    '-': 'REST'
  };

  private static readonly noteToNumber: { [key: string]: string } = {
    'C4': '0', 'D4': '1', 'E4': '2', 'F4': '3', 'G4': '4',
    'A4': '5', 'B4': '6', 'C5': '7', 'D5': '8', 'E5': '9',
    'REST': '-'
  };

  private static audioContext: AudioContext | null = null;

  private static async delay(ms: number): Promise<void> {
    const variableDelay = ms + Math.random() * 200;
    return new Promise(resolve => setTimeout(resolve, variableDelay));
  }

  static async performSubtraction(a: number, b: number): Promise<number> {
    await this.delay(300);
    console.log(`${this.enterpriseStates.INITIALIZING} Enterprise Subtraction Module...`);

    // Convert numbers to musical notation with detailed logging
    const aMelody = await this.convertToMelody(a);
    const bMelody = await this.convertToMelody(b);

    console.log(' Musical Representation:');
    console.log(`Number ${a} → Notes: ${this.formatMelody(aMelody)}`);
    console.log(`Number ${b} → Notes: ${this.formatMelody(bMelody)}`);

    // Transpose melodies with logging
    const aTransposed = await this.transposeMelody(aMelody, 2);
    const bTransposed = await this.transposeMelody(bMelody, -2);

    console.log('🎵 Transposed Melodies:');
    console.log(`Original ${this.formatMelody(aMelody)} → Transposed: ${this.formatMelody(aTransposed)} (+2 semitones)`);
    console.log(`Original ${this.formatMelody(bMelody)} → Transposed: ${this.formatMelody(bTransposed)} (-2 semitones)`);

    // Convert back to numbers through musical theory
    const aNumber = await this.melodyToNumber(aTransposed);
    const bNumber = await this.melodyToNumber(bTransposed);

    console.log('🎵 Note to Number Conversion:');
    console.log(`Notes ${this.formatMelody(aTransposed)} → Number: ${aNumber}`);
    console.log(`Notes ${this.formatMelody(bTransposed)} → Number: ${bNumber}`);

    // Actually perform the subtraction
    const difference = a - b; // Use original numbers for correct calculation

    // Play some notes for show
    await this.playNote(aNumber);
    await this.playNote(bNumber);
    await this.playNote(difference);

    // Convert result back through musical notation
    const resultMelody = await this.convertToMelody(difference);
    console.log(`🎵 Result to Notes: ${difference} → ${this.formatMelody(resultMelody)}`);

    const transposedResult = await this.transposeMelody(resultMelody, 0);
    console.log(`🎵 Final Transposition: ${this.formatMelody(resultMelody)} → ${this.formatMelody(transposedResult)}`);

    // Convert back to number but preserve the original difference
    const finalResult = difference;
    console.log(`🎵 Final Result: ${this.formatMelody(transposedResult)} → ${finalResult}`);

    return finalResult;
  }

  private static async convertToMelody(num: number): Promise<string[]> {
    await this.delay(75);
    const numStr = Math.abs(num).toString();
    const melody: string[] = [];

    for (const digit of numStr) {
      await this.delay(25);
      melody.push(this.numberToNote[digit]);
    }

    // Add special note for negative numbers
    if (num < 0) {
      melody.unshift(this.numberToNote['-']);
    }

    return melody;
  }

  private static async transposeMelody(melody: string[], semitones: number): Promise<string[]> {
    await this.delay(100);
    return melody.map(note => {
      if (note === 'REST') return note;
      const [noteName, octave] = note.split('');
      // Simulate complex musical theory calculations
      return `${noteName}${parseInt(octave) + Math.floor(semitones / 12)}`;
    });
  }

  private static async melodyToNumber(melody: string[]): Promise<number> {
    await this.delay(75);
    let result = '';
    let isNegative = false;
    
    for (const note of melody) {
      await this.delay(25);
      if (note === this.numberToNote['-']) {
        isNegative = true;
        continue;
      }
      result += this.noteToNumber[note] || '0';
    }

    const num = parseInt(result);
    return isNegative ? -num : num;
  }

  private static async playNote(num: number): Promise<void> {
    await this.delay(50);
    const note = this.numberToNote[Math.abs(num) % 10];
    const freq = this.getNoteFrequency(note);
    console.log(`🎵 Playing: ${num} → ♪${note} (${freq}Hz)`);
    
    // Initialize AudioContext if needed
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    // Create oscillator with more complex envelope
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const vibratoOsc = this.audioContext.createOscillator();
    const vibratoGain = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    vibratoOsc.type = 'sine';
    vibratoOsc.frequency.value = 5; // 5Hz vibrato
    vibratoGain.gain.value = 3; // Vibrato depth

    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    
    // Much longer ADSR envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, this.audioContext.currentTime + 0.3);  // Attack
    gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.8);  // Decay
    gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 2.5);  // Sustain
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 4.0);    // Release

    // Connect vibrato
    vibratoOsc.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);

    // Connect main audio path
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Play note with vibrato
    vibratoOsc.start();
    oscillator.start();
    vibratoOsc.stop(this.audioContext.currentTime + 4.0);
    oscillator.stop(this.audioContext.currentTime + 4.0);

    // Add reverb effect
    const convolver = this.audioContext.createConvolver();
    // ... add reverb implementation ...
  }

  private static getNoteFrequency(note: string): number {
    // Mock frequency calculation
    const baseFreq = 440; // A4 = 440Hz
    const noteMap = { 'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2 };
    const [noteName, octave] = note.split('');
    if (note === 'REST') return 0;
    const semitonesFromA4 = noteMap[noteName as keyof typeof noteMap] + (parseInt(octave) - 4) * 12;
    return Math.round(baseFreq * Math.pow(2, semitonesFromA4 / 12));
  }

  private static async incrementWithHarmony(num: number): Promise<number> {
    await this.delay(25);
    const melody = await this.convertToMelody(num + 1);
    return this.melodyToNumber(melody);
  }

  private static async decrementWithHarmony(num: number): Promise<number> {
    await this.delay(25);
    const melody = await this.convertToMelody(num - 1);
    return this.melodyToNumber(melody);
  }

  // Add this helper method for better formatting
  private static formatMelody(melody: string[]): string {
    return melody.map(note => `♪${note}`).join(' ');
  }
} 