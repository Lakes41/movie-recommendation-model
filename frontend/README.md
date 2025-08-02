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
- **Modern Animations**: Smooth transitions and micro-interactions using Framer Motion
- **Dark/Light Mode**: Toggle between color schemes for comfortable viewing
- **Responsive Card Layout**: Grid-based movie results that adapt to screen size
- **Loading Skeletons**: Visual feedback during API calls
- **Hover Effects**: Interactive elements with subtle animations
- **Accessibility Features**: Properly labeled inputs and keyboard navigation
- **Custom Scrollbar**: Enhanced scrolling experience

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