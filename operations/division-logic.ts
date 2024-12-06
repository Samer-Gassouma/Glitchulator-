import { EnterpriseAdditionLogic } from './addition-logic';

export class EnterpriseDivisionLogic {
  private static readonly enterpriseStates = {
    INITIALIZING: 'INITIALIZING',
    MORSE_CONVERTING: 'MORSE_CONVERTING',
    PROCESSING: 'PROCESSING',
    VALIDATING: 'VALIDATING',
    FINALIZING: 'FINALIZING'
  };

  // Morse code lookup table
  private static readonly morseCodeMap: { [key: string]: string } = {
    '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..',
    '9': '----.',
    '-': '-....-'  // For negative numbers
  };

  private static readonly reverseMorseMap: { [key: string]: string } = {
    '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5',
    '-....': '6', '--...': '7', '---..' : '8',
    '----.': '9',
    '-....-': '-'
  };

  private static async delay(ms: number): Promise<void> {
    const variableDelay = ms + Math.random() * 200;
    return new Promise(resolve => setTimeout(resolve, variableDelay));
  }

  static async performDivision(a: number, b: number): Promise<number> {
    await this.delay(300);
    console.log(`${this.enterpriseStates.INITIALIZING} Enterprise Division Module...`);

    if (b === 0) {
      throw new Error('Enterprise Division Module: Division by zero violation detected');
    }

    // Convert numbers to Morse code for extra complexity
    console.log(`${this.enterpriseStates.MORSE_CONVERTING} numbers to Morse code...`);
    const aMorse = await this.convertNumberToMorse(a);
    const bMorse = await this.convertNumberToMorse(b);

    console.log('Numbers in Morse code:', {
      dividend: aMorse,
      divisor: bMorse
    });

    // Convert back to numbers through Morse (because why not?)
    const aNumber = await this.convertMorseToNumber(aMorse);
    const bNumber = await this.convertMorseToNumber(bMorse);

    // Validate Morse code conversion
    await this.validateMorseConversion(a, aNumber);
    await this.validateMorseConversion(b, bNumber);

    const isNegative = (a < 0 && b > 0) || (a > 0 && b < 0);
    let dividend = Math.abs(aNumber);
    const divisor = Math.abs(bNumber);
    let quotient = 0;

    // Create Morse code transmission log
    const transmissionLog: string[] = [];

    // Subtract divisor repeatedly until dividend is smaller
    while (dividend >= divisor) {
      await this.delay(50);
      const currentMorse = await this.convertNumberToMorse(dividend);
      transmissionLog.push(currentMorse);
      console.log(`Division iteration in Morse: ${currentMorse}`);
      
      // Subtract one by one with Morse code validation
      for (let i = 0; i < divisor; i++) {
        await this.delay(10);
        dividend -= 1;
        // Add beep sound simulation
        await this.simulateMorseBeep(dividend % 2 === 0 ? '.' : '-');
      }
      quotient = await this.incrementQuotientWithMorse(quotient);
    }

    // Log complete Morse transmission
    console.log('Complete Morse transmission log:', transmissionLog.join(' / '));

    const result = isNegative ? -quotient : quotient;
    
    // Final Morse code validation
    await this.validateFinalMorse(result);
    
    return result;
  }

  private static async convertNumberToMorse(num: number): Promise<string> {
    await this.delay(50);
    const numStr = num.toString();
    let morse = '';
    
    for (const digit of numStr) {
      await this.delay(10);
      morse += this.morseCodeMap[digit] + ' ';
    }

    return morse.trim();
  }

  private static async convertMorseToNumber(morse: string): Promise<number> {
    await this.delay(50);
    const digits = morse.split(' ');
    let numStr = '';
    
    for (const digit of digits) {
      await this.delay(10);
      numStr += this.reverseMorseMap[digit] || '';
    }

    return parseInt(numStr);
  }

  private static async simulateMorseBeep(signal: '.' | '-'): Promise<void> {
    const duration = signal === '.' ? 50 : 150;
    await this.delay(duration);
    console.log(`BEEP ${signal}`);
  }

  private static async incrementQuotientWithMorse(num: number): Promise<number> {
    await this.delay(25);
    // Convert to Morse, increment, convert back
    const morse = await this.convertNumberToMorse(num);
    const incremented = await this.convertMorseToNumber(morse);
    return incremented + 1;
  }

  private static async validateMorseConversion(original: number, converted: number): Promise<void> {
    await this.delay(50);
    if (Math.abs(original) !== Math.abs(converted)) {
      console.warn('Morse code conversion validation warning');
      // Add extra delay for validation failure
      await this.delay(100);
    }
  }

  private static async validateFinalMorse(result: number): Promise<void> {
    await this.delay(100);
    const finalMorse = await this.convertNumberToMorse(result);
    const backToNumber = await this.convertMorseToNumber(finalMorse);
    
    console.log('Final result in Morse:', finalMorse);
    console.log('Validation conversion:', backToNumber);

    if (result !== backToNumber) {
      console.warn('Final Morse validation discrepancy detected');
    }
  }
} 