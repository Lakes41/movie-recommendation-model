import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Star, Sparkles, Play, Heart, Award } from 'lucide-react'

interface AdvancedLoaderProps {
  onLoadingComplete: () => void
  duration?: number
}

export function AdvancedLoader({ onLoadingComplete, duration = 4000 }: AdvancedLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCredits, setShowCredits] = useState(false)
  
  const loadingSteps = [
    { text: "Initializing AI Engine...", icon: Sparkles },
    { text: "Loading Movie Database...", icon: Film },
    { text: "Preparing Recommendations...", icon: Heart },
    { text: "Welcome to CineMatch!", icon: Award }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 50))
        
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length)
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1))
        
        if (newProgress >= 70 && !showCredits) {
          setShowCredits(true)
        }
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onLoadingComplete, 800)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onLoadingComplete, showCredits])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 0.8,
        filter: "blur(10px)"
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        {/* Film strip animation */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-1 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-y-1 animate-pulse" />
        
        {/* Floating movie elements */}
        {[...Array(15)].map((_, i) => {
          const icons = [Film, Play, Star, Heart]
          const Icon = icons[i % icons.length]
          return (
            <motion.div
              key={i}
              className="absolute text-white/20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                rotate: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.3
              }}
              animate={{
                y: -100,
                rotate: Math.random() * 360 + 180,
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
        {/* Cinematic Logo */}
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          className="mb-12"
        >
          <div className="relative inline-block">
            {/* Outer glow ring */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-2 blur-sm"
            >
              <div className="w-32 h-32 bg-transparent rounded-full" />
            </motion.div>
            
            {/* Main logo */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Film className="w-16 h-16 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mb-12"
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-white mb-6"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              background: 'linear-gradient(45deg, #60a5fa, #a78bfa, #f472b6, #60a5fa)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            CineMatch
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-2xl md:text-3xl text-blue-100 mb-4 font-light"
          >
            Your Personal Movie Companion
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-lg text-blue-200/80 max-w-2xl mx-auto leading-relaxed"
          >
            Discover extraordinary films tailored to your taste with our advanced AI recommendation engine
          </motion.p>
        </motion.div>

        {/* Enhanced Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mb-16"
        >
          {/* Circular Progress */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5 }}
                style={{
                  strokeDasharray: "283",
                  strokeDashoffset: 283 - (283 * progress) / 100
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Loading Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center space-x-3 text-blue-100"
            >
              {React.createElement(loadingSteps[currentStep].icon, {
                className: "w-6 h-6 animate-pulse text-blue-400"
              })}
              <span className="text-xl font-medium">{loadingSteps[currentStep].text}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Credits Section */}
        <AnimatePresence>
          {showCredits && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center justify-center space-x-3 mb-6"
              >
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-blue-200 font-semibold text-lg">Crafted with Passion</span>
                <Star className="w-5 h-5 text-yellow-400" />
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
                >
                  <div className="text-blue-200 text-sm font-medium mb-2 uppercase tracking-wide">UI/UX Design</div>
                  <div className="text-white font-bold text-2xl mb-2">Zayyad</div>
                  <div className="text-blue-300 text-sm">Creative Vision & User Experience</div>
                </motion.div>
                
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
                >
                  <div className="text-blue-200 text-sm font-medium mb-2 uppercase tracking-wide">AI Development</div>
                  <div className="text-white font-bold text-2xl mb-2">Amir</div>
                  <div className="text-blue-300 text-sm">Machine Learning & Backend</div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}