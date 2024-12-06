'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnterpriseAdditionLogic } from '@/operations/addition-logic'
import { EnterpriseSubtractionLogic } from '@/operations/subtraction-logic'
import { EnterpriseMultiplicationLogic } from '@/operations/multiplication-logic'
import { EnterpriseDivisionLogic } from '@/operations/division-logic'
import { MusicalSheet } from './musical-sheet'
import { DNAVisualizer } from './dna-visualizer'

interface ProcessingLog {
  timestamp: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'beep';
  notes?: { note: string; duration: number; frequency: number; }[];
  dna?: string;
  rna?: string;
}

interface ComplexityMetrics {
  notation: string;
  operations: number;
  description: string;
}

export default function EnterpriseCalculator() {
  const [display, setDisplay] = useState('0')
  const [firstNumber, setFirstNumber] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [isNewNumber, setIsNewNumber] = useState(true)
  const [loading, setLoading] = useState(false)
  const [processingLogs, setProcessingLogs] = useState<ProcessingLog[]>([])
  const [currentState, setCurrentState] = useState('')
  const [complexity, setComplexity] = useState<ComplexityMetrics>({
    notation: 'O(1)',
    operations: 0,
    description: 'Constant Time'
  });
  const [currentNotes, setCurrentNotes] = useState<{ note: string; duration: number; frequency: number; }[]>([]);
  const [showMusicSheet, setShowMusicSheet] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProcessingLogs([]);
    }, 10000);

    return () => clearTimeout(timer);
  }, [processingLogs]);

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog.apply(console, args);
      
      const message = args.join(' ');
      
      if (message.includes('DNA Sequence') || message.includes('Result DNA')) {
        const dnaMatch = message.match(/→\s*([ATCG-]+)/);
        if (dnaMatch) {
          setProcessingLogs(prev => prev.map((log, i) => 
            i === prev.length - 1 ? { ...log, dna: dnaMatch[1] } : log
          ));
        }
      }
      
      if (message.includes('RNA Sequence') || message.includes('Result RNA')) {
        const rnaMatch = message.match(/→\s*([AUCG-]+)/);
        if (rnaMatch) {
          setProcessingLogs(prev => prev.map((log, i) => 
            i === prev.length - 1 ? { ...log, rna: rnaMatch[1] } : log
          ));
        }
      }

      if (message.includes('♪')) {
        const noteMatch = message.match(/♪(\w+\d)\s+\((\d+)Hz\)/);
        if (noteMatch) {
          const [_, note, freq] = noteMatch;
          setCurrentNotes(prev => {
            const newNotes = [...prev, { 
              note, 
              duration: 4.0,
              frequency: parseInt(freq)
            }];
            return newNotes.slice(-30);
          });
        }
      }

      setProcessingLogs(prev => [...prev, {
        timestamp: Date.now(),
        message: args.join(' '),
        type: 'info' as 'info' | 'warning' | 'error' | 'beep',
        notes: currentNotes
      }].slice(-10));
    };

    return () => { console.log = originalLog; };
  }, [currentNotes]);

  useEffect(() => {
    let operationCount = 0;
    const complexityInterval = setInterval(() => {
      if (loading) {
        operationCount++;
        updateComplexity(operationCount);
      }
    }, 100);

    return () => clearInterval(complexityInterval);
  }, [loading]);

  const updateComplexity = (operations: number) => {
    let notation: string;
    let description: string;

    if (operations < 10) {
      notation = 'O(1)';
      description = 'Constant Time';
    } else if (operations < 50) {
      notation = 'O(log n)';
      description = 'Logarithmic Time';
    } else if (operations < 100) {
      notation = 'O(n)';
      description = 'Linear Time';
    } else if (operations < 200) {
      notation = 'O(n log n)';
      description = 'Linearithmic Time';
    } else if (operations < 500) {
      notation = 'O(n²)';
      description = 'Quadratic Time';
    } else {
      notation = 'O(2ⁿ)';
      description = 'Exponential Time';
    }

    setComplexity({ notation, operations, description });
  };

  const handleDigitPress = (digit: string) => {
    if (isNewNumber) {
      setDisplay(digit)
      setIsNewNumber(false)
    } else {
      setDisplay(prev => Array.from(prev).concat(Array.from(digit)).join(''))
    }
  }

  const handleOperationPress = (op: string) => {
    setFirstNumber(parseFloat(display))
    setOperation(op)
    setIsNewNumber(true)
    setProcessingLogs([])
    setCurrentNotes([])
    setShowMusicSheet(false)
  }

  const handleEquals = async () => {
    try {
      setLoading(true)
      setProcessingLogs([])
      setCurrentNotes([])
      setShowMusicSheet(true)
      if (firstNumber === null || operation === null) return

      const secondNumber = parseFloat(display)
      let result: number

      switch (operation) {
        case '+':
          result = await EnterpriseAdditionLogic.performAddition(firstNumber, secondNumber)
          break
        case '-':
          result = await EnterpriseSubtractionLogic.performSubtraction(firstNumber, secondNumber)
          break
        case '×':
          result = await EnterpriseMultiplicationLogic.performMultiplication(firstNumber, secondNumber)
          break
        case '÷':
          result = await EnterpriseDivisionLogic.performDivision(firstNumber, secondNumber)
          break
        default:
          return
      }

      setDisplay(result.toString())
      setFirstNumber(null)
      setOperation(null)
      setIsNewNumber(true)
    } catch (error) {
      setDisplay('ERROR')
      console.warn(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Glitchulator™</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="p-4 border rounded-lg bg-black/5 dark:bg-white/5">
            <div className="text-right text-4xl font-mono">{loading ? 'Processing...' : display}</div>
          </div>

          {loading && (
            <div className="border rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg">{complexity.notation}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {complexity.description}
                </span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ 
                    width: `${Math.min((complexity.operations / 500) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Operations: {complexity.operations}
              </div>
            </div>
          )}

          <div className="h-32 overflow-auto border rounded-lg p-2 bg-black/5 dark:bg-white/5 font-mono text-xs">
            {processingLogs.map((log, index) => (
              <div 
                key={log.timestamp + index}
                className={`${
                  log.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  log.type === 'error' ? 'text-red-600 dark:text-red-400' :
                  log.type === 'beep' ? 'text-green-600 dark:text-green-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="opacity-50">{complexity.notation}</span> {' '}
                {new Date(log.timestamp).toISOString().split('T')[1].split('.')[0]} - {log.message}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[7, 8, 9, '÷', 4, 5, 6, '×', 1, 2, 3, '-', 0, '.', '=', '+'].map((btn) => (
              <Button
                key={btn}
                onClick={() => {
                  if (typeof btn === 'number' || btn === '.') {
                    handleDigitPress(btn.toString())
                  } else if (btn === '=') {
                    handleEquals()
                  } else {
                    handleOperationPress(btn)
                  }
                }}
                variant={typeof btn === 'number' || btn === '.' ? 'outline' : 'default'}
                disabled={loading}
              >
                {btn}
              </Button>
            ))}
          </div>

          {(loading || showMusicSheet) && currentNotes.length > 0 && (
            <div className="border rounded-lg p-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Musical Visualization</h3>
                {!loading && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setShowMusicSheet(false);
                      setCurrentNotes([]);
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <MusicalSheet 
                notes={currentNotes}
                playing={loading}
              />
            </div>
          )}

          {(loading || showMusicSheet) && processingLogs.some(log => log.dna || log.rna) && (
            <div className="border rounded-lg p-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">DNA/RNA Visualization</h3>
              </div>
              <DNAVisualizer 
                dna={processingLogs[processingLogs.length - 1]?.dna || ''}
                rna={processingLogs[processingLogs.length - 1]?.rna || ''}
                playing={loading}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}