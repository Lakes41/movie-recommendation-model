import streamlit as st
import pickle
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import difflib
import os
from typing import List, Tuple, Optional

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
        with open('Pkled files/dataframe.pkl', 'rb') as f:
            df = pickle.load(f)
        
        # Load the TF-IDF matrix
        with open('Pkled files/tfidf_matrix.pkl', 'rb') as f:
            tfidf_matrix = pickle.load(f)
        
        # Load the indices
        with open('Pkled files/indices.pkl', 'rb') as f:
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



def get_recommendations(
    movie_title: str,
    df: pd.DataFrame,
    tfidf_matrix,
    indices: pd.Series,
    nn_model: NearestNeighbors,
    min_similarity: float = 0.8
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
        
        # Require exact match in indices (no auto-correction here)
        if key not in indices.index:
            st.error(f"Movie title '{movie_title}' not found.")
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

def display_movie_card(movie_title: str, df: pd.DataFrame):
    """
    Display a movie card with title, year, genres, overview, and poster.
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
        # Get poster path from dataframe
        poster_path = movie_info.get('poster_path', None)
        if poster_path and pd.notna(poster_path):
            try:
                # Construct full poster URL
                base_url = "https://image.tmdb.org/t/p/"
                image_size = "w500"  # You can adjust this size as needed
                full_poster_url = base_url + image_size + poster_path
                
                # Display poster image
                st.image(full_poster_url, width=150, caption=movie_title)
            except Exception as e:
                st.write("🎬")  # Fallback for missing poster
        else:
            st.write("🎬")  # Placeholder for missing poster
    
    with col2:
        # Get year from dataframe using the correct column name
        year = movie_info.get('release_year', None)
        
        year_display = f" ({year})" if year else ""
        
        # Get overview text
        overview = movie_info.get('overview', 'No overview available.')
        
        if overview and pd.notna(overview) and overview != 'No overview available.':
            overview_display = overview[:300] + "..." if len(overview) > 300 else overview
        else:
            overview_display = "No overview available."
        
        st.markdown(f"""
        <div class="movie-card">
            <div class="movie-title">{movie_title}{year_display}</div>
            <div class="movie-genres">{movie_info.get('genres', 'N/A')}</div>
            <div class="movie-overview">{overview_display}</div>
        </div>
        """, unsafe_allow_html=True)

def filter_movies_by_title(df: pd.DataFrame, search_term: str, max_results: int = 20) -> List[str]:
    """
    Filter movies by title search term for auto-complete dropdown.
    
    Args:
        df: Movie dataframe
        search_term: User input to search for
        max_results: Maximum number of results to return
    
    Returns:
        List of matching movie titles
    """
    if not search_term or len(search_term.strip()) < 2:
        return []
    
    search_term = search_term.lower().strip()
    
    # Filter movies that contain the search term
    mask = df['title'].str.lower().str.contains(search_term, na=False)
    filtered_movies = df[mask]['title'].tolist()
    
    # Sort by relevance (exact matches first, then partial matches)
    exact_matches = [title for title in filtered_movies if title.lower().startswith(search_term)]
    partial_matches = [title for title in filtered_movies if title not in exact_matches]
    
    # Combine and limit results
    sorted_results = exact_matches + partial_matches
    return sorted_results[:max_results]

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
    
    # Similarity threshold
    similarity_threshold = st.sidebar.slider(
        "Similarity Threshold",
        min_value=0.1,
        max_value=1.0,
        value=0.8,
        step=0.1,
        help="Minimum similarity for corrected-title suggestions (higher = stricter)"
    )
    
    # Main content area
    st.markdown("---")
    
    # Movie search section
    st.subheader("🔍 Find Movie Recommendations")

    # Session state for correction workflow
    if 'correction_mode' not in st.session_state:
        st.session_state['correction_mode'] = False
    if 'suggestions' not in st.session_state:
        st.session_state['suggestions'] = []
    if 'selected_correction' not in st.session_state:
        st.session_state['selected_correction'] = None
    
    # Single input box + button
    col1, col2 = st.columns([3, 1])
    
    # Buffer for controlled text_input value to avoid post-instantiation mutation
    if 'pending_movie_input' not in st.session_state:
        st.session_state['pending_movie_input'] = ""

    with col1:
        movie_input = st.text_input(
            "Enter a movie title:",
            value=st.session_state.get('pending_movie_input', ""),
            placeholder="e.g., The Godfather, Inception, Pulp Fiction...",
            help="Type the name of a movie you like to get similar recommendations",
            key="movie_input"
        )
    
    with col2:
        search_button = st.button("🎯 Get Recommendations", use_container_width=True, key="get_recs_button")

    recommended_movies: List[str] = []
    corrected_title: Optional[str] = None
    based_on_title_var: Optional[str] = None

    # Handle search
    if search_button and movie_input.strip():
        user_key = movie_input.lower().strip()
        if user_key in indices.index:
            with st.spinner("Finding similar movies..."):
                recommended_movies, corrected_title = get_recommendations(
                    movie_input,
                    df,
                    tfidf_matrix,
                    indices,
                    nn_model,
                    similarity_threshold
                )
            st.session_state['correction_mode'] = False
            st.session_state['suggestions'] = []
        else:
            # Build suggestions: first substring matches, then difflib fallback
            suggestions = filter_movies_by_title(df, movie_input, max_results=20)
            if not suggestions:
                close_keys = difflib.get_close_matches(user_key, indices.index, n=10, cutoff=similarity_threshold)
                suggestions = []
                for ck in close_keys:
                    try:
                        corrected_movie_id = indices[[ck]].iloc[0]
                        title_candidate = df[df['id'] == corrected_movie_id]['title'].iloc[0]
                        suggestions.append(title_candidate)
                    except Exception:
                        pass
            if suggestions:
                st.session_state['correction_mode'] = True
                st.session_state['suggestions'] = suggestions
                st.info("Title not found. Please select a corrected title below.")
            else:
                st.error(f"Movie title '{movie_input}' not found and no close match available.")

    # Show correction dropdown if needed
    if st.session_state['correction_mode'] and st.session_state['suggestions']:
        selected = st.selectbox("Did you mean:", st.session_state['suggestions'], key="selected_correction")
        confirm = st.button("Use selected title")
        if confirm and selected:
            with st.spinner("Finding similar movies..."):
                recommended_movies, corrected_title = get_recommendations(
                    selected,
                    df,
                    tfidf_matrix,
                    indices,
                    nn_model,
                    similarity_threshold
                )
            # Update state and input field to the selected value
            # Update buffer instead of the widget key after instantiation
            st.session_state['pending_movie_input'] = selected
            st.session_state['correction_mode'] = False
            st.session_state['suggestions'] = []
            based_on_title_var = selected

    # Display recommendations if available from this interaction
    if recommended_movies:
        st.markdown("---")
        st.subheader("🎬 Recommended Movies")
        based_on_title = based_on_title_var or st.session_state.get('pending_movie_input', movie_input)
        st.markdown(f"**Based on:** {based_on_title}")
        for i, movie in enumerate(recommended_movies, 1):
            display_movie_card(movie, df)
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
    
    The recommendations are based on **TF-IDF vectorization** and **cosine similarity** using a Nearest Neighbors algorithm.
    """)
    
    # Sample movies for quick testing
    st.markdown("---")
    st.subheader("🎯 Try These Popular Movies")
    
    sample_movies = [
        "The Godfather", "The Matrix", "The Avengers", "Love & other drugs", "Goodfellas", "Se7en"
    ]
    
    cols = st.columns(4)
    for i, movie in enumerate(sample_movies):
        with cols[i % 4]:
            if st.button(movie, key=f"sample_{i}"):
                st.session_state['pending_movie_input'] = movie
                st.rerun()

if __name__ == "__main__":
    main()
