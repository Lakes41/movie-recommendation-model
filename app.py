import streamlit as st
import pickle
import requests
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import difflib
import os
from typing import List, Tuple, Optional
import json

# Page configuration
st.set_page_config(
    page_title="Movie Recommendation System",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        color: #1f77b4;
        margin-bottom: 2rem;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #666;
        text-align: center;
        margin-bottom: 2rem;
    }
    .movie-card {
        background-color: #f8f9fa;
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
        border-left: 4px solid #1f77b4;
    }
    .movie-title {
        font-size: 1.2rem;
        font-weight: bold;
        color: #1f77b4;
        margin-bottom: 0.5rem;
    }
    .movie-genres {
        color: #666;
        font-style: italic;
        margin-bottom: 0.5rem;
    }
    .movie-overview {
        color: #333;
        line-height: 1.4;
    }
    .stButton > button {
        background-color: #1f77b4;
        color: white;
        border-radius: 20px;
        padding: 0.5rem 2rem;
        font-weight: bold;
    }
    .stButton > button:hover {
        background-color: #0d5aa7;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def load_model_components():
    """
    Load all pre-trained model components with caching for performance.
    """
    try:
        # Load the dataframe
        with open('dataframe', 'rb') as f:
            df = pickle.load(f)
        
        # Load the TF-IDF matrix
        with open('tfidf_matrix', 'rb') as f:
            tfidf_matrix = pickle.load(f)
        
        # Load the indices
        with open('indices', 'rb') as f:
            indices = pickle.load(f)
        
        # Create and fit the NearestNeighbors model
        nn_model = NearestNeighbors(
            n_neighbors=11,
            metric='cosine',
            algorithm='brute',
            n_jobs=-1
        )
        nn_model.fit(tfidf_matrix)
        
        return df, tfidf_matrix, indices, nn_model
    
    except Exception as e:
        st.error(f"Error loading model components: {str(e)}")
        return None, None, None, None

def get_movie_poster(movie_title: str, api_key: str = None) -> Optional[str]:
    """
    Get movie poster URL from TMDB API.
    """
    if not api_key:
        return None
    
    try:
        # Search for the movie
        search_url = f"https://api.themoviedb.org/3/search/movie"
        params = {
            'api_key': api_key,
            'query': movie_title,
            'language': 'en-US',
            'page': 1
        }
        
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        if data['results']:
            poster_path = data['results'][0]['poster_path']
            if poster_path:
                return f"https://image.tmdb.org/t/p/w500{poster_path}"
        
        return None
    
    except Exception as e:
        st.warning(f"Could not fetch poster for {movie_title}: {str(e)}")
        return None

def get_recommendations(
    movie_title: str,
    df: pd.DataFrame,
    tfidf_matrix,
    indices: pd.Series,
    nn_model: NearestNeighbors,
    min_similarity: float = 0.6
) -> Tuple[List[str], Optional[str]]:
    """
    Get movie recommendations based on input title.
    
    Returns:
        Tuple of (recommended_movies, corrected_title)
    """
    try:
        # Normalize the input title
        key = movie_title.lower().strip()
        corrected_title = None
        
        # Check if the title exists in our index
        if key not in indices.index:
            # Try to auto-correct using difflib
            close_matches = difflib.get_close_matches(key, indices.index, n=1, cutoff=min_similarity)
            
            if close_matches:
                corrected_key = close_matches[0]
                corrected_movie_id = indices[[corrected_key]].iloc[0]
                
                # Get the corrected movie title
                corrected_title = df[df['id'] == corrected_movie_id]['title'].iloc[0]
                st.info(f"Title '{movie_title}' not found. Using closest match: '{corrected_title}'")
                
                key = corrected_key
            else:
                st.error(f"Movie title '{movie_title}' not found and no close match available.")
                return [], None
        
        # Get the movie ID for the title
        movie_id = indices[[key]].iloc[0]
        
        # Find the row index in the DataFrame
        movie_row = df[df['id'] == movie_id]
        if len(movie_row) == 0:
            st.error(f"Movie with ID {movie_id} not found in DataFrame.")
            return [], None
        
        row_idx = movie_row.index[0]
        
        # Get the TF-IDF vector for this movie
        movie_vector = tfidf_matrix[row_idx]
        
        # Find the 11 nearest neighbors (including the movie itself)
        distances, neighbor_indices = nn_model.kneighbors(movie_vector, return_distance=True)
        
        # Remove the first neighbor (it's the movie itself) and get the next 10
        recommended_indices = neighbor_indices[0][1:11]  # Get indices 1-10
        
        # Get the recommended movie titles
        recommended_movies = df.iloc[recommended_indices]['title'].tolist()
        
        return recommended_movies, corrected_title
    
    except Exception as e:
        st.error(f"Error getting recommendations: {str(e)}")
        return [], None

def display_movie_card(movie_title: str, df: pd.DataFrame, poster_url: str = None):
    """
    Display a movie card with title, genres, overview, and poster.
    """
    # Get movie details from dataframe
    movie_data = df[df['title'] == movie_title]
    
    if len(movie_data) == 0:
        st.write(f"**{movie_title}**")
        return
    
    movie_info = movie_data.iloc[0]
    
    # Create columns for poster and details
    col1, col2 = st.columns([1, 3])
    
    with col1:
        if poster_url:
            st.image(poster_url, width=150)
        else:
            st.write("🎬")  # Placeholder for missing poster
    
    with col2:
        st.markdown(f"""
        <div class="movie-card">
            <div class="movie-title">{movie_title}</div>
            <div class="movie-genres">{movie_info.get('genres', 'N/A')}</div>
            <div class="movie-overview">{movie_info.get('overview', 'No overview available.')[:200]}...</div>
        </div>
        """, unsafe_allow_html=True)

def main():
    """
    Main Streamlit application.
    """
    # Header
    st.markdown('<h1 class="main-header">🎬 Movie Recommendation System</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Discover your next favorite movie based on content similarity</p>', unsafe_allow_html=True)
    
    # Load model components
    with st.spinner("Loading movie recommendation model..."):
        df, tfidf_matrix, indices, nn_model = load_model_components()
    
    if df is None:
        st.error("Failed to load model components. Please check if the model files are available.")
        return
    
    # Sidebar for configuration
    st.sidebar.title("⚙️ Configuration")
    
    # TMDB API key input
    api_key = st.sidebar.text_input(
        "TMDB API Key (optional)",
        type="password",
        help="Enter your TMDB API key to display movie posters. Get one at https://www.themoviedb.org/settings/api"
    )
    
    # Similarity threshold
    similarity_threshold = st.sidebar.slider(
        "Similarity Threshold",
        min_value=0.1,
        max_value=1.0,
        value=0.6,
        step=0.1,
        help="Minimum similarity for auto-correcting movie titles"
    )
    
    # Main content area
    st.markdown("---")
    
    # Movie search section
    st.subheader("🔍 Find Movie Recommendations")
    
    # Create two columns for input
    col1, col2 = st.columns([3, 1])
    
    with col1:
        movie_input = st.text_input(
            "Enter a movie title:",
            placeholder="e.g., The Godfather, Inception, Pulp Fiction...",
            help="Type the name of a movie you like to get similar recommendations"
        )
    
    with col2:
        search_button = st.button("🎯 Get Recommendations", use_container_width=True)
    
    # Display recommendations
    if search_button and movie_input.strip():
        with st.spinner("Finding similar movies..."):
            recommended_movies, corrected_title = get_recommendations(
                movie_input,
                df,
                tfidf_matrix,
                indices,
                nn_model,
                similarity_threshold
            )
        
        if recommended_movies:
            st.markdown("---")
            st.subheader("🎬 Recommended Movies")
            
            # Display the search movie first (if corrected)
            if corrected_title:
                st.markdown(f"**Based on:** {corrected_title}")
            
            # Display recommendations
            for i, movie in enumerate(recommended_movies, 1):
                # Get poster URL if API key is provided
                poster_url = None
                if api_key:
                    poster_url = get_movie_poster(movie, api_key)
                
                # Display movie card
                display_movie_card(movie, df, poster_url)
                
                if i < len(recommended_movies):
                    st.markdown("---")
    
    # Information section
    st.markdown("---")
    st.subheader("ℹ️ About This System")
    
    st.markdown("""
    This movie recommendation system uses **content-based filtering** to suggest movies similar to your input. 
    The system analyzes movie features including:
    
    - **Genres**: Action, Drama, Comedy, etc.
    - **Keywords**: Plot-related terms and themes
    - **Overview**: Movie descriptions and synopses
    - **Cast & Crew**: Actors and directors
    
    The recommendations are based on **TF-IDF vectorization** and **cosine similarity** using a Nearest Neighbors algorithm.
    """)
    
    # Sample movies for quick testing
    st.markdown("---")
    st.subheader("🎯 Try These Popular Movies")
    
    sample_movies = [
        "The Godfather", "Inception", "Pulp Fiction", "The Shawshank Redemption",
        "Fight Club", "The Matrix", "Forrest Gump", "Goodfellas"
    ]
    
    cols = st.columns(4)
    for i, movie in enumerate(sample_movies):
        with cols[i % 4]:
            if st.button(movie, key=f"sample_{i}"):
                st.session_state.movie_input = movie
                st.rerun()

if __name__ == "__main__":
    main()
