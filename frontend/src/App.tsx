import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

interface Movie {
  title: string;
  poster_path?: string;
  overview?: string;
  vote_average?: number;
}

function App() {
  const [movie, setMovie] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [corrected, setCorrected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [threshold, setThreshold] = useState(0.6);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchRecommendations = async () => {
    if (!movie.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await axios.post('http://127.0.0.1:8000/recommend', {
        title: movie,
        similarity_threshold: threshold
      });
      
      // Convert string array to Movie objects (in a real app, your API would return full movie objects)
      const movieResults = response.data.recommended.map((title: string) => ({ title }));
      setResults(movieResults);
      setCorrected(response.data.corrected_title);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container w-full mx-0 px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold">🎬 Movie Recommender</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full"
          >
            {darkMode ? '☀️' : '🌙'}
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Movie Title</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                placeholder="Enter a movie title..."
                value={movie}
                onChange={(e) => setMovie(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && fetchRecommendations()}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Similarity Threshold ({threshold.toFixed(1)})
              </label>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.1}
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={fetchRecommendations}
            >
              Get Recommendations
            </motion.button>
          </motion.div>

          <div className="lg:col-span-8">
            {loading && (
              <div className="flex flex-col space-y-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-6 rounded"
              >
                {error}
              </motion.div>
            )}

            {corrected && !loading && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 text-gray-600 dark:text-gray-300"
              >
                Showing results for: <span className="font-semibold">{corrected}</span>
              </motion.p>
            )}

            <AnimatePresence>
              {results.length > 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {results.map((movie, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                        {movie.overview ? (
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{movie.overview}</p>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No description available</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
