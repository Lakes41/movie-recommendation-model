import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Star, Sparkles } from 'lucide-react'

interface LoaderScreenProps {
  onLoadingComplete: () => void
  duration?: number
}

export function LoaderScreen({ onLoadingComplete, duration = 3000 }: LoaderScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  
  const loadingSteps = [
    "Initializing AI Engine...",
    "Loading Movie Database...",
    "Preparing Recommendations...",
    "Welcome to CineMatch!"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 50))
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length)
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1))
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onLoadingComplete, 500)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onLoadingComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern dark:bg-dot-pattern-dark" />
        {/* Floating Elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, -100],
              opacity: [0.7, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-1"
            >
              <div className="w-24 h-24 bg-transparent rounded-full" />
            </motion.div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Film className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CineMatch
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">
            Welcome to Your Personal Movie Companion
          </p>
          <p className="text-lg text-blue-200/80">
            Discover movies tailored just for you with AI-powered recommendations
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mb-12"
        >
          {/* Progress Bar */}
          <div className="relative w-full max-w-md mx-auto mb-6">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-sm text-blue-200 mt-2">
              <span>0%</span>
              <span className="font-medium">{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Loading Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center space-x-2 text-blue-100"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-lg font-medium">{loadingSteps[currentStep]}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Credits Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-blue-200 font-medium">Crafted with Excellence</span>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <div className="text-blue-100 text-sm font-medium mb-1">UI/UX Design</div>
              <div className="text-white font-bold text-lg">Zayyad</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <div className="text-blue-100 text-sm font-medium mb-1">AI Model Development</div>
              <div className="text-white font-bold text-lg">Amir</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}