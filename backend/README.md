# 🎬 Movie Recommendation System

A content-based movie recommendation system built with **FastAPI** and **Vite + React + TypeScript**, using TF-IDF vectorization and Nearest Neighbors algorithm to suggest similar movies based on genres, keywords, overview, cast, and crew information.

## 🚀 Features

- **Content-Based Filtering**: Recommends movies based on movie feature similarity
- **Fuzzy Matching**: Auto-corrects movie titles with typos using `difflib`
- **Similarity Threshold Slider**: Adjust the leniency of fuzzy matching via a slider
- **API-Based Architecture**: FastAPI backend with React frontend
- **React + Vite Frontend**: Super-fast development experience with TypeScript support
- **Interactive UI**: Responsive and custom-styled frontend UI
- **Real-time Recommendations**: Instant suggestions from backend model

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js and npm (for Vite frontend)
- Required model files: `dataframe`, `tfidf_matrix`, `indices` (pickled files)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-recommendation-model.git
cd movie-recommendation-model
```

### 2. Set up the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 Usage

### Using the Application

1. Navigate to `http://localhost:5173`
2. Type in a movie title
3. Use the **similarity threshold slider** to control how strict the matching is
4. Click "Get Recommendations"
5. View top 10 similar movie titles returned from the backend

## 🔧 Configuration

### Similarity Threshold

- Controlled via a slider in the frontend UI
- **Lower values (0.1-0.5)**: More lenient auto-correction
- **Higher values (0.6-1.0)**: Stricter matching

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