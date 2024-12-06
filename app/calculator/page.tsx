import EnterpriseCalculator from '@/components/enterprise-calculator';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CalculatorPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
            <div
             
                className="max-w-6xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Glitchulator Distortion Unit™
                    </h1>
                    <Link href="/alarm" className="px-4 py-2 rounded bg-purple-500 text-white">
                       
                            Return to Alarm
                    </Link>
                </div>
                <EnterpriseCalculator />
            </div>
        </main>
    )
} 
