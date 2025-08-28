import { motion } from 'framer-motion'
import { Star, Calendar, Film } from 'lucide-react'
import { Card, CardContent } from './ui/Card'
import { getImageUrl, truncateText, } from '../lib/utils'

interface Movie {
  title: string
  poster_path?: string
  overview?: string
  genres?: string
  release_year?: number
  vote_average?: number
}

interface MovieCardProps {
  movie: Movie
  index: number
  onClick?: () => void
}

export function MovieCard({ movie, index, onClick }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className="overflow-hidden hover:shadow-large transition-all duration-300 group-hover:border-primary-200 dark:group-hover:border-primary-800">
        <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {movie.poster_path ? (
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating badge */}
          {movie.vote_average && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {truncateText(movie.title, 50)}
            </h3>
            
            {movie.release_year && movie.release_year !== 1970 && (
              <div className="flex items-center space-x-1 mt-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {movie.release_year}
                </span>
              </div>
            )}
          </div>
          
          {movie.genres && (
            <div className="flex flex-wrap gap-1">
              {movie.genres.split(', ').slice(0, 2).map((genre, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          {movie.overview && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {truncateText(movie.overview, 120)}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}