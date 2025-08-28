import React from 'react'
import { motion } from 'framer-motion'
import { Search, Sliders, Sparkles } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface SearchSectionProps {
  movie: string
  setMovie: (value: string) => void
  threshold: number
  setThreshold: (value: number) => void
  onSearch: () => void
  loading: boolean
}

export function SearchSection({
  movie,
  setMovie,
  threshold,
  setThreshold,
  onSearch,
  loading
}: SearchSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      onSearch()
    }
  }

  const sampleMovies = [
    'The Godfather',
    'Inception',
    'The Matrix',
    'Pulp Fiction',
    'The Dark Knight',
    'Interstellar'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-white/20 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <span>Discover Movies</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a movie you love and find similar recommendations
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Movie Title"
              placeholder="e.g., The Godfather, Inception, Pulp Fiction..."
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              onKeyPress={handleKeyPress}
              icon={<Search className="w-4 h-4" />}
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-300 flex items-center space-x-2">
                  <Sliders className="w-4 h-4" />
                  <span>Similarity Threshold</span>
                </label>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                  {threshold.toFixed(1)}
                </span>
              </div>
              
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.1}
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider dark:bg-gray-700"
              />
              
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>More Flexible</span>
                <span>More Strict</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={onSearch}
            loading={loading}
            disabled={!movie.trim()}
            size="lg"
            className="w-full"
          >
            {loading ? 'Finding Recommendations...' : 'Get Recommendations'}
          </Button>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
              Try these popular movies:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleMovies.map((sampleMovie) => (
                <Button
                  key={sampleMovie}
                  variant="outline"
                  size="sm"
                  onClick={() => setMovie(sampleMovie)}
                  className="text-xs"
                >
                  {sampleMovie}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}