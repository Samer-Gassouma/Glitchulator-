import { EnterpriseAdditionLogic } from './addition-logic';

export class EnterpriseMultiplicationLogic {
  private static readonly enterpriseStates = {
    INITIALIZING: 'INITIALIZING',
    CONVERTING: 'CONVERTING',
    PROCESSING: 'PROCESSING',
    VALIDATING: 'VALIDATING',
    CALCULATING: 'CALCULATING',
    FINALIZING: 'FINALIZING'
  };

  // Keep the lookup table but add more complexity
  private static readonly multiplicationTable: { [key: string]: { [key: string]: number } } = {
    '0': { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
    '1': { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9 },
    '2': { '0': 0, '1': 2, '2': 4, '3': 6, '4': 8, '5': 10, '6': 12, '7': 14, '8': 16, '9': 18 },
    '3': { '0': 0, '1': 3, '2': 6, '3': 9, '4': 12, '5': 15, '6': 18, '7': 21, '8': 24, '9': 27 },
    '4': { '0': 0, '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '7': 28, '8': 32, '9': 36 },
    '5': { '0': 0, '1': 5, '2': 10, '3': 15, '4': 20, '5': 25, '6': 30, '7': 35, '8': 40, '9': 45 },
    '6': { '0': 0, '1': 6, '2': 12, '3': 18, '4': 24, '5': 30, '6': 36, '7': 42, '8': 48, '9': 54 },
    '7': { '0': 0, '1': 7, '2': 14, '3': 21, '4': 28, '5': 35, '6': 42, '7': 49, '8': 56, '9': 63 },
    '8': { '0': 0, '1': 8, '2': 16, '3': 24, '4': 32, '5': 40, '6': 48, '7': 56, '8': 64, '9': 72 },
    '9': { '0': 0, '1': 9, '2': 18, '3': 27, '4': 36, '5': 45, '6': 54, '7': 63, '8': 72, '9': 81 }
  };

  // Add Roman numeral conversion for extra complexity
  private static readonly romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];

  private static async delay(ms: number): Promise<void> {
    const variableDelay = ms + Math.random() * 150;
    return new Promise(resolve => setTimeout(resolve, variableDelay));
  }

  static async performMultiplication(a: number, b: number): Promise<number> {
    await this.delay(300);
    console.log(`${this.enterpriseStates.INITIALIZING} Enterprise Multiplication Module...`);

    // Convert to Roman numerals first (because why not?)
    const aRoman = await this.convertToRoman(Math.abs(a));
    const bRoman = await this.convertToRoman(Math.abs(b));
    
    console.log(`${this.enterpriseStates.CONVERTING} to Roman numerals:`, { aRoman, bRoman });

    // Convert back to decimal through binary (for extra steps)
    const aDecimal = await this.romanToBinary(aRoman);
    const bDecimal = await this.romanToBinary(bRoman);

    // Create a multiplication matrix for maximum complexity
    const matrix = await this.createMultiplicationMatrix(aDecimal, bDecimal);
    
    console.log(`${this.enterpriseStates.PROCESSING} multiplication matrix created`);

    // Process matrix with unnecessary recursion
    const result = await this.processMatrixRecursively(matrix);

    // Handle signs with extra validation
    const isNegative = (a < 0 && b > 0) || (a > 0 && b < 0);
    const finalResult = isNegative ? await this.enterpriseNegate(result) : result;

    await this.validateEnterpriseOutput(finalResult);
    
    return finalResult;
  }

  private static async convertToRoman(num: number): Promise<string> {
    await this.delay(100);
    let result = '';
    let remaining = num;

    for (const { value, symbol } of this.romanNumerals) {
      await this.delay(25);
      while (remaining >= value) {
        result += symbol;
        remaining -= value;
        await this.delay(10);
      }
    }

    return result || 'N';
  }

  private static async romanToBinary(roman: string): Promise<number> {
    await this.delay(150);
    let decimal = 0;
    const values: { [key: string]: number } = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50,
      'C': 100, 'D': 500, 'M': 1000
    };

    for (let i = 0; i < roman.length; i++) {
      await this.delay(20);
      const current = values[roman[i]];
      const next = values[roman[i + 1]];
      
      if (next > current) {
        decimal += next - current;
        i++;
      } else {
        decimal += current;
      }
    }

    // Convert to binary and back because we can
    return parseInt(decimal.toString(2), 2);
  }

  private static async createMultiplicationMatrix(a: number, b: number): Promise<number[][]> {
    const matrix: number[][] = [];
    
    for (let i = 0; i < a; i++) {
      await this.delay(50);
      const row: number[] = [];
      for (let j = 0; j < b; j++) {
        await this.delay(10);
        row.push(1);
      }
      matrix.push(row);
    }

    return matrix;
  }

  private static async processMatrixRecursively(matrix: number[][]): Promise<number> {
    if (matrix.length === 0) return 0;
    if (matrix.length === 1) return matrix[0].length;

    await this.delay(100);
    
    // Split matrix and process recursively
    const mid = Math.floor(matrix.length / 2);
    const upper = matrix.slice(0, mid);
    const lower = matrix.slice(mid);

    const upperSum = await this.processMatrixRecursively(upper);
    const lowerSum = await this.processMatrixRecursively(lower);

    return upperSum + lowerSum;
  }

  private static async enterpriseNegate(num: number): Promise<number> {
    await this.delay(75);
    let result = num;
    // Negate one by one
    while (result > 0) {
      await this.delay(10);
      result--;
    }
    while (result < 0) {
      await this.delay(10);
      result++;
    }
    return -result;
  }

  private static async validateEnterpriseOutput(result: number): Promise<void> {
    await this.delay(200);
    console.log(`${this.enterpriseStates.VALIDATING} Enterprise Output...`);

    // Unnecessary validation steps
    await Promise.all([
      this.validateNumberRange(result),
      this.validateNumberType(result),
      this.validateNumberString(result)
    ]);
  }

  private static async validateNumberRange(num: number): Promise<void> {
    await this.delay(50);
    if (Number.isSafeInteger(num)) {
      console.log('Range validation passed');
    }
  }

  private static async validateNumberType(num: number): Promise<void> {
    await this.delay(50);
    if (typeof num === 'number') {
      console.log('Type validation passed');
    }
  }

  private static async validateNumberString(num: number): Promise<void> {
    await this.delay(50);
    if (num.toString().length > 0) {
      console.log('String conversion validation passed');
    }
  }
} 