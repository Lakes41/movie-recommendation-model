<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/99130bbb-c45c-42c7-a282-7c4a0d00a441" /># 🎬 CineMatch - AI-Powered Movie Recommendation System

A sophisticated content-based movie recommendation platform built with **FastAPI** and **Vite + React + TypeScript**, featuring advanced AI algorithms, modern UI design, and comprehensive movie data to deliver personalized film suggestions. 🌐 **Try it out here**: [Live Website](https://1cinematch.vercel.app)

## ✨ Features

### 🤖 **AI-Powered Recommendations**
- **Content-Based Filtering**: Advanced similarity matching using TF-IDF vectorization and Nearest Neighbors
- **Fuzzy Matching**: Intelligent auto-correction for movie titles with typos using `difflib`
- **Similarity Threshold Control**: Adjustable precision via interactive slider (0.1-1.0)
- **Real-time Processing**: Instant recommendations with sub-second response times

### 🎨 **Modern User Interface**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Elegant theme switching with system preference detection
- **Interactive Animations**: Smooth transitions and micro-interactions using Framer Motion
- **Accessibility**: WCAG-compliant design with proper contrast ratios and keyboard navigation
- **Loading Experience**: Engaging loader screen with team credits and progress indicators

### 🎭 **Rich Movie Data**
- **Comprehensive Database**: ~175,000 movies with detailed metadata
- **Movie Posters**: High-quality images from TMDB API integration
- **Detailed Information**: Genres, release years, overviews, and ratings
- **Smart Filtering**: English-language films from 1990-2025 for relevance

### 🏗️ **Technical Excellence**
- **Dual Interface**: Both Streamlit web app and React frontend options
- **API-First Architecture**: RESTful FastAPI backend with comprehensive error handling
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Performance Optimized**: Cached model loading and efficient data processing

## 👥 **Team Credits**

- **UI/UX Design**: Zayyad - Creative Vision & User Experience
- **AI Model Development**: Amir - Machine Learning & Backend Architecture

## 📋 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **npm**: Latest version
- **Model Files**: Pre-trained pickle files (included in repository)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movie-recommendation-model.git
cd movie-recommendation-model
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

**Backend runs on**: `http://localhost:8000`

### 3. Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install

# Start the development server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

### 4. Alternative: Streamlit Interface

```bash
cd backend
streamlit run app.py
```

**Streamlit runs on**: `http://localhost:8501`

## 🎯 Usage Guide

### **Getting Started**

1. **Launch the Application**: Navigate to `http://localhost:5173`
2. **Enter Movie Title**: Type any movie you enjoy (e.g., "Inception", "The Matrix")
3. **Adjust Similarity**: Use the slider to control recommendation precision
4. **Get Recommendations**: Click the button or press Enter
5. **Explore Results**: Browse through personalized movie suggestions with posters and details

### **Pro Tips**

- **Try Sample Movies**: Click the suggested movie buttons for quick testing
- **Experiment with Threshold**: Lower values (0.1-0.5) for broader suggestions, higher (0.6-1.0) for precise matches
- **Dark Mode**: Toggle for comfortable viewing in any lighting condition
- **Mobile Friendly**: Full functionality available on smartphones and tablets

## 🔧 Configuration

### **Similarity Threshold Settings**

| Range | Behavior | Best For |
|-------|----------|----------|
| 0.1-0.3 | Very lenient matching | Discovering new genres |
| 0.4-0.6 | Balanced recommendations | General use |
| 0.7-1.0 | Strict similarity | Finding very similar films |

### **Environment Variables**

```bash
# Optional: TMDB API key for enhanced poster quality
TMDB_API_KEY=your_api_key_here

# Backend configuration
FASTAPI_HOST=127.0.0.1
FASTAPI_PORT=8000

# Frontend configuration
VITE_API_URL=http://127.0.0.1:8000
```

## 🏗️ Architecture

```
Movie Recommendation Model/
├── backend/
│   ├── main.py                # FastAPI application
│   ├── recommendation.py      # Recommendation logic
│   ├── requirements.txt       # Python dependencies
│   └── Pkled Files/           # Model files
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # React component
│   │   └── main.tsx
│   └── vite.config.ts         # Vite config
```

### Backend (FastAPI)
- Loads model components from pickled files
- Receives POST requests with movie title and threshold
- Returns recommended movies and corrected title (if applicable)

### Frontend (Vite + React + TS)
- Interactive UI with input field and slider
- Uses Axios to communicate with backend
- Displays movie recommendations in real-time

## 📊 Model Performance

- **Dataset Size**: ~175,000 movies
- **Vectorization**: TF-IDF with ~15,000 features
- **Recommendation**: 10 most similar movies using cosine similarity

## 📦 Dependencies

### Backend
- FastAPI
- Uvicorn
- Pandas
- Scikit-learn
- NumPy

### Frontend
- React
- TypeScript
- Vite
- Axios

## 🐛 Troubleshooting

### CORS errors
- Ensure FastAPI allows origin `http://localhost:5173`

### Model not found
- Make sure `dataframe`, `tfidf_matrix`, and `indices` are in `backend/Pkled Files/`

### 404 Movie not found
- Try lowering the similarity threshold
- Ensure input title exists or is close enough

## 🤝 Contributing

1. Fork the repo
2. Make your changes on a branch
3. Test thoroughly
4. Submit a PR

## 🙏 Acknowledgments

- Kaggle (For the dataset used in the recommendation)
- TMDB (for optional poster API)
- Scikit-learn
- FastAPI
- Vite & React
- Pandas & NumPy

---

**Happy Movie Discovery! 🎬✨**
