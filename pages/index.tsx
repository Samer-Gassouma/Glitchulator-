'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const RunawayButton: React.FC = () => {
  const [runCount, setRunCount] = useState(0)
  const buttonRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  const runAway = () => {
    if (runCount < 3) {
      const x = (Math.random() - 0.5) * 200
      const y = (Math.random() - 0.5) * 200
      controls.start({ x, y, transition: { type: 'spring', stiffness: 300, damping: 25 } })
      setRunCount(runCount + 1)
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } })
      setRunCount(0)
    }
  }

  return (
    <motion.div ref={buttonRef} animate={controls}>
      <Button 
        size="lg" 
        onClick={runAway}
        onMouseEnter={runAway}
        className="bg-white text-black hover:bg-blue-500 hover:text-white"
      >
        Enter if you dare
      </Button>
    </motion.div>
  )
}

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center text-blue-500">Welcome to Glitchulator</h1>
    
      <div className="flex gap-4 mb-12">
        <Link href="/calculator" passHref className="text-white text-[7px] hover:text-blue-500">
          Don't click me
        </Link>
        <RunawayButton />
      </div>
      <div className="text-sm text-center max-w-md text-blue-400">
        Warning: Use of this calculator may result in temporal paradoxes.
      </div>
    </div>
  )
}

export default LandingPage

