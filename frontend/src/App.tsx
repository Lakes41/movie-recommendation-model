import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Film, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { LoaderScreen } from './components/LoaderScreen'
import { SearchSection } from './components/SearchSection'
import { MovieCard } from './components/MovieCard'
import { Button } from './components/ui/Button'
import { Card, CardContent } from './components/ui/Card'
import { cn } from './lib/utils'
import './App.css'

interface Movie {
  title: string
  poster_path?: string
  overview?: string
  genres?: string
  release_year?: number
  vote_average?: number
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [movie, setMovie] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [corrected, setCorrected] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [threshold, setThreshold] = useState(0.6)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const fetchRecommendations = async () => {
    if (!movie.trim()) return
    
    setLoading(true)
    setError('')
    setResults([])
    setCorrected('')

    try {
      const response = await axios.post('http://127.0.0.1:8000/recommend', {
        title: movie,
        similarity_threshold: threshold
      })
      
      setResults(response.data.recommended)
      setCorrected(response.data.corrected_title)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while fetching recommendations')
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoaderScreen 
            onLoadingComplete={handleLoadingComplete}
            duration={3500}
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className={cn(
          "min-h-screen transition-all duration-300",
          "bg-gradient-to-br from-gray-50 via-white to-gray-100",
          "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        )}>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-dot-pattern dark:bg-dot-pattern-dark" />
          <div className="relative z-10">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-4 py-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                    <Film className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
                      CineMatch
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      AI-Powered Movie Recommendations
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={toggleDarkMode}
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                  )}
                </button>
              </div>
            </motion.header>

            {/* Main Content */}
            <main className="container mx-auto px-4 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Search Section */}
                <div className="lg:col-span-4">
                  <SearchSection
                    movie={movie}
                    setMovie={setMovie}
                    threshold={threshold}
                    setThreshold={setThreshold}
                    onSearch={fetchRecommendations}
                    loading={loading}
                  />
                </div>

                {/* Results Section */}
                <div className="lg:col-span-8">
                  <AnimatePresence mode="wait">
                    {loading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <div className="animate-pulse">
                              <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                              <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                <div className="space-y-2">
                                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card className="border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-900/20">
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-3">
                              <AlertCircle className="w-6 h-6 text-error-600 dark:text-error-400" />
                              <div>
                                <h3 className="font-semibold text-error-800 dark:text-error-200">
                                  Something went wrong
                                </h3>
                                <p className="text-error-600 dark:text-error-400 text-sm mt-1">
                                  {error}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {corrected && !loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <Card className="border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-900/20">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                              <p className="text-success-800 dark:text-success-200 text-sm">
                                Showing results for: <span className="font-semibold">{corrected}</span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {results.length > 0 && !loading && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Recommended Movies
                          </h2>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {results.length} recommendations
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {results.map((movie, index) => (
                            <MovieCard
                              key={`${movie.title}-${index}`}
                              movie={movie}
                              index={index}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {!loading && !error && results.length === 0 && movie && (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No recommendations found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Try adjusting your search or similarity threshold
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  )
}

export default App
