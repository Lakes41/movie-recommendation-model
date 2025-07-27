# 🎬 Movie Recommendation System

A content-based movie recommendation system built with Streamlit, using TF-IDF vectorization and Nearest Neighbors algorithm to suggest similar movies based on genres, keywords, overview, cast, and crew information.

## 🚀 Features

- **Content-Based Filtering**: Recommends movies based on content similarity
- **Fuzzy Matching**: Auto-corrects movie titles with typos
- **Movie Posters**: Optional TMDB API integration for movie posters
- **Interactive UI**: Beautiful Streamlit interface with responsive design
- **Real-time Recommendations**: Instant movie suggestions
- **Configurable Parameters**: Adjustable similarity thresholds

## 📋 Prerequisites

- Python 3.8 or higher
- Required model files: `dataframe`, `tfidf_matrix`, `indices` (pickled files)
- Optional: TMDB API key for movie posters

## 🛠️ Installation

1. **Clone or download the project files**

2. **Install required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure model files are present**:
   - `dataframe` (pickled DataFrame)
   - `tfidf_matrix` (pickled TF-IDF matrix)
   - `indices` (pickled indices mapping)

## 🎯 Usage

### Running the Application

1. **Navigate to the project directory**:
   ```bash
   cd "Movie Rcommendation Model"
   ```

2. **Run the Streamlit app**:
   ```bash
   streamlit run app.py
   ```

3. **Open your browser** and go to the URL shown in the terminal (usually `http://localhost:8501`)

### Using the Application

1. **Enter a movie title** in the search box
2. **Click "Get Recommendations"** or press Enter
3. **View recommended movies** with details and optional posters
4. **Adjust settings** in the sidebar:
   - TMDB API key for movie posters
   - Similarity threshold for auto-correction

### Example Searches

Try these popular movies:
- The Godfather
- Inception
- Pulp Fiction
- The Shawshank Redemption
- Fight Club
- The Matrix

## 🔧 Configuration

### TMDB API Key (Optional)

To display movie posters:

1. Go to [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Enter the API key in the sidebar
4. Movie posters will automatically appear

### Similarity Threshold

- **Lower values (0.1-0.5)**: More lenient auto-correction
- **Higher values (0.6-1.0)**: Stricter matching
- **Default**: 0.6 (balanced approach)

## 🏗️ Architecture

### Model Components

1. **TF-IDF Vectorization**: Converts movie text features to numerical vectors
2. **Nearest Neighbors**: Finds similar movies using cosine similarity
3. **Content Features**: Genres, keywords, overview, cast, crew

### Data Processing

- **Text Preprocessing**: Stemming, cleaning, normalization
- **Feature Engineering**: Combined movie features into "soup"
- **Vectorization**: TF-IDF with optimized parameters

### Recommendation Algorithm

1. **Input Validation**: Check if movie exists in database
2. **Fuzzy Matching**: Auto-correct typos using difflib
3. **Vector Search**: Find nearest neighbors in TF-IDF space
4. **Result Formatting**: Display recommendations with details

## 📊 Model Performance

- **Dataset Size**: ~175,000 movies
- **Features**: Genres, keywords, overview, cast, crew
- **Vectorization**: TF-IDF with 15,000 features
- **Algorithm**: Nearest Neighbors with cosine similarity
- **Recommendations**: Top 10 similar movies

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile
- **Custom Styling**: Professional movie-themed interface
- **Interactive Elements**: Buttons, sliders, text inputs
- **Loading States**: Progress indicators for better UX
- **Error Handling**: User-friendly error messages

## 🔍 Technical Details

### Dependencies

- **Streamlit**: Web application framework
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing
- **Scikit-learn**: Machine learning algorithms
- **Requests**: HTTP library for API calls
- **NLTK**: Natural language processing

### File Structure

```
Movie Rcommendation Model/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── dataframe             # Pickled DataFrame
├── tfidf_matrix          # Pickled TF-IDF matrix
├── indices               # Pickled indices mapping
├── main.ipynb            # Model training notebook
├── main2.ipynb           # Alternative model notebook
└── Datasets/             # Original data files
```

## 🐛 Troubleshooting

### Common Issues

1. **Model files not found**:
   - Ensure `dataframe`, `tfidf_matrix`, and `indices` files are in the project directory
   - Check file permissions

2. **Import errors**:
   - Install all dependencies: `pip install -r requirements.txt`
   - Check Python version (3.8+ required)

3. **TMDB API errors**:
   - Verify API key is correct
   - Check internet connection
   - API key is optional - app works without it

4. **Memory issues**:
   - Close other applications
   - Model files are large (~200MB total)
   - Consider using a machine with 4GB+ RAM

### Performance Tips

- **First run**: May take longer to load model files
- **Subsequent runs**: Faster due to caching
- **API calls**: TMDB requests may add delay
- **Large datasets**: Consider subsetting for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational and personal use. Please respect the terms of service for any external APIs used.

## 🙏 Acknowledgments

- **TMDB**: For movie data and poster API
- **Streamlit**: For the web application framework
- **Scikit-learn**: For machine learning algorithms
- **Pandas**: For data manipulation tools

---

**Happy Movie Discovery! 🎬✨** 