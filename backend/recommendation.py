# backend/recommendation.py
import pickle
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import difflib
from typing import List, Optional, Tuple

def load_model_components():
    with open('Pkled Files/dataframe.pkl', 'rb') as f:
        df = pickle.load(f)

    with open('Pkled Files/tfidf_matrix.pkl', 'rb') as f:
        tfidf_matrix = pickle.load(f)

    with open('Pkled Files/indices.pkl', 'rb') as f:
        indices = pickle.load(f)

    nn_model = NearestNeighbors(
        n_neighbors=11,
        metric='cosine',
        algorithm='brute',
        n_jobs=-1
    )
    nn_model.fit(tfidf_matrix)

    return df, tfidf_matrix, indices, nn_model

def get_recommendations(
    movie_title: str,
    df: pd.DataFrame,
    tfidf_matrix,
    indices: pd.Series,
    nn_model: NearestNeighbors,
    min_similarity: float = 0.6
) -> Tuple[List[dict], Optional[str]]:
    key = movie_title.lower().strip()
    corrected_title = None

    if key not in indices.index:
        close_matches = difflib.get_close_matches(key, indices.index, n=1, cutoff=min_similarity)
        if close_matches:
            key = close_matches[0]
            corrected_movie_id = indices[[key]].iloc[0]
            corrected_title = df[df['id'] == corrected_movie_id]['title'].iloc[0]
        else:
            return [], None

    movie_id = indices[[key]].iloc[0]
    movie_row = df[df['id'] == movie_id]
    if len(movie_row) == 0:
        return [], None

    row_idx = movie_row.index[0]
    movie_vector = tfidf_matrix[row_idx]
    distances, neighbor_indices = nn_model.kneighbors(movie_vector, return_distance=True)
    recommended_indices = neighbor_indices[0][1:11]
    
    # CHANGE: Return full movie objects instead of just titles
    recommended_movies_data = df.iloc[recommended_indices]
    recommended_movies = []
    
    for _, movie in recommended_movies_data.iterrows():
        movie_obj = {
            "title": movie['title'],
            "overview": movie.get('overview', 'No description available'),
            "poster_path": movie.get('poster_path', ''),
            "genres": movie.get('genres', ''),
            "release_year": movie.get('release_year', None)
        }
        recommended_movies.append(movie_obj)

    return recommended_movies, corrected_title
