'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import useSound from 'use-sound';

interface AlarmTime {
  hours: number;
  minutes: number;
  meridiem: 'AM' | 'PM';
}

export function GlitchulatorAlarm() {
  const [sliderValue, setSliderValue] = useState(0);
  const [alarms, setAlarms] = useState<AlarmTime[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isSliding, setIsSliding] = useState(false);
  const [sliderLocked, setSliderLocked] = useState(false);
  const [isAlarming, setIsAlarming] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [realityBreaches, setRealityBreaches] = useState(0);
  const [timelineFragments] = useState(Array(5).fill(null).map(() => Math.random()));
  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.7 });
  const [playScream] = useSound('/scream.mp3', { volume: 0.5 });
  const [playStatic] = useSound('/static.mp3', { volume: 0.3 });
  const [reminderTimeout, setReminderTimeout] = useState<NodeJS.Timeout | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [playBuzz] = useSound('/buzz.mp3', { volume: 0.3 });

  const getTimeFromSlider = (value: number): AlarmTime => {
    const totalMinutes = value * 5;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return {
      hours: hours24 > 12 ? hours24 - 12 : hours24 === 0 ? 12 : hours24,
      minutes: minutes,
      meridiem: hours24 >= 12 ? 'PM' : 'AM'
    };
  };

  useEffect(() => {
    if (!isSliding) return;

    const interferenceInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        setSliderValue(prev => {
          const interference = Math.floor(Math.random() * 5) - 2;
          const newValue = Math.max(0, Math.min(287, prev + interference));
          
          setWarnings(prev => [
            ...prev,
            `Temporal interference detected: ${interference > 0 ? 'forward' : 'backward'} shift`,
          ].slice(-5));

          return newValue;
        });
      }
    }, 500);

    return () => clearInterval(interferenceInterval);
  }, [isSliding]);

  useEffect(() => {
    const lockInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setSliderLocked(true);
        setWarnings(prev => [...prev, "CHRONOMETRIC LOCK ENGAGED"].slice(-5));
        
        setTimeout(() => {
          setSliderLocked(false);
          setWarnings(prev => [...prev, "Chronometric systems restored"].slice(-5));
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(lockInterval);
  }, []);

  useEffect(() => {
    if (isAlarming) {
      const destabilizeReality = () => {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
          if (Math.random() < 0.1) {
            (el as HTMLElement).style.transform = `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`;
            (el as HTMLElement).style.filter = `blur(${Math.random() * 5}px)`;
          }
        });

        const textNodes = document.evaluate(
          "//text()", document, null, XPathResult.ANY_TYPE, null
        );
        let node;
        while (node = textNodes.iterateNext()) {
          if (Math.random() < 0.05 && node.textContent) {
            node.textContent = node.textContent.split('').reverse().join('');
          }
        }
      };

      const corruptInterval = setInterval(destabilizeReality, 200);
      return () => clearInterval(corruptInterval);
    }
  }, [isAlarming]);

  const createTemporalFracture = useCallback(() => {
    setRealityBreaches(prev => prev + 1);
    if (Math.random() < 0.3) playScream();
    if (Math.random() < 0.5) playStatic();
    
    setAlarms(prev => prev.map(alarm => ({
      ...alarm,
      hours: Math.random() < 0.2 ? (alarm.hours + Math.floor(Math.random() * 12)) % 12 || 12 : alarm.hours,
      minutes: Math.random() < 0.3 ? Math.floor(Math.random() * 60) : alarm.minutes,
      meridiem: Math.random() < 0.2 ? (alarm.meridiem === 'AM' ? 'PM' : 'AM') : alarm.meridiem
    })));
  }, [playScream, playStatic]);

  useEffect(() => {
    if (isAlarming) {
      document.body.style.animation = 'reality-tear 0.1s infinite';
      
      const glitchInterval = setInterval(() => {
        const hue = Math.random() * 360;
        const skew = Math.random() * 20 - 10;
        const scale = 0.8 + Math.random() * 0.4;
        
        document.body.style.filter = `
          hue-rotate(${hue}deg) 
          contrast(${150 + Math.random() * 100}%) 
          saturate(${200 + Math.random() * 200}%)
        `;
        document.body.style.transform = `
          skew(${skew}deg) 
          scale(${scale}) 
          rotate(${Math.random() * 5 - 2.5}deg)
        `;
        
        if (Math.random() < 0.2) createTemporalFracture();
        
        setGlitchIntensity(prev => {
          const newIntensity = prev + 0.05;
          if (newIntensity > 1.5) {
            setWarnings(prev => [...prev, "REALITY COLLAPSE THRESHOLD EXCEEDED"].slice(-5));
          }
          return newIntensity;
        });
      }, 50);

      return () => {
        clearInterval(glitchInterval);
        document.body.style.animation = '';
        document.body.style.filter = '';
        document.body.style.transform = '';
      };
    }
  }, [isAlarming, createTemporalFracture]);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      alarms.forEach(alarm => {
        const alarmHours = alarm.meridiem === 'PM' && alarm.hours !== 12 
          ? alarm.hours + 12 
          : alarm.meridiem === 'AM' && alarm.hours === 12 
            ? 0 
            : alarm.hours;

        if (alarmHours === currentHours && alarm.minutes === currentMinutes) {
          setIsAlarming(true);
          setWarnings(prev => [...prev, "TEMPORAL BREACH DETECTED"].slice(-5));
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms]);

  const formatTime = (time: AlarmTime) => {
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')} ${time.meridiem}`;
  };

  const handleSliderChange = (value: number[]) => {
    if (sliderLocked) {
      setWarnings(prev => [...prev, "Cannot adjust: Temporal lock active"].slice(-5));
      return;
    }
    setSliderValue(value[0]);
    setIsSliding(true);
  };

  const startReminderHarassment = useCallback((alarm: AlarmTime) => {
    if (reminderTimeout) {
      clearTimeout(reminderTimeout);
    }

    const harassUser = () => {
      setQuestionCount(prev => prev + 1);
      const questions = [
        "ARE YOU ABSOLUTELY CERTAIN ABOUT THIS TEMPORAL DECISION?",
        "THE TIMELINE INTEGRITY IS AT STAKE. RECONSIDER?",
        "TEMPORAL PARADOX RISK INCREASING. ABORT?",
        "REALITY FABRIC STRETCHING THIN. CONTINUE ANYWAY?",
        `${questionCount * 13}% CHANCE OF CATASTROPHIC TIMELINE COLLAPSE. PROCEED?`
      ];

      document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
      setTimeout(() => {
        document.body.style.filter = '';
      }, 1000);

      if (Math.random() < 0.3) {
        createTemporalFracture();
      }

      playBuzz();
      
      const response = window.confirm(
        questions[Math.floor(Math.random() * questions.length)] + 
        `\n\nTIME REMAINING: ${formatTime(alarm)}` +
        `\nQUESTION COUNT: ${questionCount}` +
        `\nREALITY STABILITY: ${Math.max(0, 100 - questionCount * 5)}%`
      );

      if (!response) {
        setAlarms(prev => prev.filter(a => 
          !(a.hours === alarm.hours && 
            a.minutes === alarm.minutes && 
            a.meridiem === alarm.meridiem)
        ));
        setWarnings(prev => [...prev, "TEMPORAL ANCHOR POINT REJECTED BY USER"].slice(-5));
        createTemporalFracture();
        return;
      }

      const nextTimeout = setTimeout(
        harassUser, 
        Math.max(5000, 15 * 60 * 1000 - (questionCount * 1000))
      );
      setReminderTimeout(nextTimeout);
    };

    const timeout = setTimeout(harassUser, 15 * 60 * 1000);
    setReminderTimeout(timeout);
  }, [questionCount, createTemporalFracture, playBuzz]);

  const addAlarm = () => {
    const newAlarm = getTimeFromSlider(sliderValue);
    const temporalInstability = Math.random();
    
    if (temporalInstability < 0.4) {
      const timelineShift = Math.floor(Math.random() * 24 * 60);
      const newTime = new Date(Date.now() + timelineShift * 60000);
      newAlarm.hours = newTime.getHours() % 12 || 12;
      newAlarm.minutes = newTime.getMinutes();
      newAlarm.meridiem = newTime.getHours() >= 12 ? 'PM' : 'AM';
      
      createTemporalFracture();
      setWarnings(prev => [
        ...prev,
        "CRITICAL: TEMPORAL COORDINATES SEVERELY CORRUPTED",
        "WARNING: TIMELINE INTEGRITY COMPROMISED",
        "CAUTION: REALITY ANCHOR FAILING",
      ].slice(-5));
    }

    if (questionCount > 10) {
      const randomAlarms = Array(Math.floor(Math.random() * 3) + 1)
        .fill(null)
        .map(() => ({
          hours: Math.floor(Math.random() * 12) + 1,
          minutes: Math.floor(Math.random() * 60),
          meridiem: Math.random() < 0.5 ? 'AM' as const : 'PM' as const
        }));
      
      setWarnings(prev => [
        ...prev,
        "CRITICAL: TEMPORAL MULTIPLICATION EVENT DETECTED",
        `${randomAlarms.length} PHANTOM TIMELINES GENERATED`
      ].slice(-5));

      setAlarms(prev => [...prev, newAlarm, ...randomAlarms]);
    } else {
      setAlarms(prev => [...prev, newAlarm]);
    }

    startReminderHarassment(newAlarm);
    
    if (questionCount > 5) {
      setWarnings(prev => [
        ...prev,
        "WARNING: USER JUDGMENT POTENTIALLY COMPROMISED",
        `TEMPORAL DECISION CONFIDENCE: ${Math.max(0, 100 - questionCount * 10)}%`,
        "CAUTION: TIMELINE STABILITY DEGRADING"
      ].slice(-5));
    }
  };

  useEffect(() => {
    return () => {
      if (reminderTimeout) {
        clearTimeout(reminderTimeout);
      }
    };
  }, [reminderTimeout]);

  return (
    <Card 
      className={`w-full max-w-md mx-auto ${isAlarming ? 'animate-pulse animate-glitch' : ''}`}
      style={{
        transform: `perspective(1000px) rotateX(${Math.sin(Date.now() / 1000) * realityBreaches}deg)`,
        transition: 'transform 0.1s'
      }}
    >
      <CardHeader>
        <CardTitle>Glitchulator Alarm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`space-y-6 ${isAlarming ? 'animate-glitch' : ''}`}>
          <div className="space-y-2">
            <motion.div 
              className="text-2xl font-mono text-center"
              animate={{ scale: isSliding ? 1.1 : 1 }}
            >
              {formatTime(getTimeFromSlider(sliderValue))}
            </motion.div>
            <Slider
              disabled={sliderLocked}
              min={0}
              max={287}
              step={1}
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              onValueCommit={() => setIsSliding(false)}
              className="temporal-slider"
            />
            <div className="text-xs text-center text-gray-500">
              Temporal Precision: {((1 - (sliderValue % 1)) * 100).toFixed(2)}%
            </div>
          </div>

          <div className="h-32 overflow-auto border rounded p-2 font-mono text-xs">
            {warnings.map((warning, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-yellow-500"
              >
                ! {warning}
              </motion.div>
            ))}
          </div>

          <Button 
            className="w-full"
            onClick={addAlarm}
            disabled={sliderLocked}
          >
            {sliderLocked ? 'TEMPORAL LOCK ACTIVE' : 'Initialize Temporal Anchor'}
          </Button>

          <div className="space-y-2">
            {alarms.map((alarm, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span className="font-mono">{formatTime(alarm)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAlarms(prev => prev.filter((_, i) => i !== index));
                    setWarnings(prev => [...prev, "Timeline branch terminated"].slice(-5));
                  }}
                >
                  Collapse Timeline
                </Button>
              </motion.div>
            ))}
          </div>
          {isAlarming && (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity }}
              className="text-red-500 font-bold text-center"
            >
              TEMPORAL ANOMALY DETECTED
            </motion.div>
          )}
          {realityBreaches > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {timelineFragments.map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 bg-red-500/10"
                  animate={{
                    clipPath: [
                      'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                      `polygon(${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% ${Math.random() * 100}%)`
                    ]
                  }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 