export class EnterpriseAdditionLogic {
  private static readonly enterpriseStates = {
    INITIALIZING: 'INITIALIZING',
    BINARY_CONVERTING: 'BINARY_CONVERTING',
    WEATHER_CHECKING: 'WEATHER_CHECKING',
    PROCESSING: 'PROCESSING',
    VALIDATING: 'VALIDATING'
  };

  // Weather conditions affect calculation speed
  private static readonly weatherDelays: { [key: string]: number } = {
    'Clear': 100,
    'Clouds': 200,
    'Rain': 300,
    'Snow': 400,
    'Thunderstorm': 500
  };

  // DNA nucleotides for number encoding
  private static readonly numberToDNA: { [key: string]: string } = {
    '0': 'AAAA', '1': 'AAAT', '2': 'AAGA', '3': 'AAGT',
    '4': 'ATAA', '5': 'ATAT', '6': 'ATGA', '7': 'ATGT',
    '8': 'GAAA', '9': 'GAAT', '-': 'GGGG'
  };

  private static readonly DNAToNumber: { [key: string]: string } = {
    'AAAA': '0', 'AAAT': '1', 'AAGA': '2', 'AAGT': '3',
    'ATAA': '4', 'ATAT': '5', 'ATGA': '6', 'ATGT': '7',
    'GAAA': '8', 'GAAT': '9', 'GGGG': '-'
  };

  private static async delay(ms: number): Promise<void> {
    const variableDelay = ms + Math.random() * 200;
    return new Promise(resolve => setTimeout(resolve, variableDelay));
  }

  static async performAddition(a: number, b: number): Promise<number> {
    await this.delay(300);
    console.log(`${this.enterpriseStates.INITIALIZING} Enterprise Addition Module...`);

    // Convert numbers to DNA sequences with detailed logging
    const aDNA = await this.convertToDNA(a);
    const bDNA = await this.convertToDNA(b);

    // Log DNA sequences in the correct format for visualization
    console.log(`DNA Sequence A → ${aDNA}`);
    console.log(`DNA Sequence B → ${bDNA}`);

    // Simulate DNA transcription process with detailed logging
    const aRNA = await this.transcribeDNA(aDNA);
    const bRNA = await this.transcribeDNA(bDNA);

    // Log RNA sequences in the correct format for visualization
    console.log(`RNA Sequence A → ${aRNA}`);
    console.log(`RNA Sequence B → ${bRNA}`);

    // Convert RNA back to numbers through protein synthesis simulation
    const aNumber = await this.synthesizeNumber(aRNA);
    const bNumber = await this.synthesizeNumber(bRNA);

    console.log('🧬 Protein Synthesis:');
    console.log(`RNA ${this.formatRNASequence(aRNA)} → Number: ${aNumber}`);
    console.log(`RNA ${this.formatRNASequence(bRNA)} → Number: ${bNumber}`);

    // Actually perform the addition
    const sum = aNumber + bNumber;

    // Convert result through DNA for show
    const resultDNA = await this.convertToDNA(sum);
    console.log(`Result DNA → ${resultDNA}`);

    const resultRNA = await this.transcribeDNA(resultDNA);
    console.log(`Result RNA → ${resultRNA}`);

    const finalResult = await this.synthesizeNumber(resultRNA);

    return finalResult;
  }

  private static async convertToDNA(num: number): Promise<string> {
    await this.delay(100);
    const numStr = Math.abs(num).toString();
    let dna = '';
    
    for (const digit of numStr) {
      await this.delay(25);
      dna += this.numberToDNA[digit] + '-';
    }

    return dna.slice(0, -1); // Remove last hyphen
  }

  private static async transcribeDNA(dna: string): Promise<string> {
    await this.delay(75);
    return dna.replace(/T/g, 'U');
  }

  private static async synthesizeNumber(rna: string): Promise<number> {
    await this.delay(100);
    const codons = rna.split('-');
    let result = '';

    for (const codon of codons) {
      await this.delay(25);
      const dnaCodon = codon.replace(/U/g, 'T');
      result += this.DNAToNumber[dnaCodon] || '0';
    }

    return parseInt(result);
  }

  private static async incrementWithDNAValidation(num: number): Promise<number> {
    await this.delay(25);
    const dna = await this.convertToDNA(num + 1);
    const rna = await this.transcribeDNA(dna);
    return this.synthesizeNumber(rna);
  }

  private static async validateDNASequence(num: number): Promise<void> {
    await this.delay(50);
    const dna = await this.convertToDNA(num);
    if (!/^[ATCG-]+$/.test(dna)) {
      console.warn('Invalid DNA sequence detected');
    }
  }

  // Add these new helper methods for better formatting
  private static formatDNASequence(dna: string): string {
    return dna.split('-').map(codon => `[${codon}]`).join('-');
  }

  private static formatRNASequence(rna: string): string {
    return rna.split('-').map(codon => `[${codon}]`).join('-');
  }
} 