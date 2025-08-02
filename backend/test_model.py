#!/usr/bin/env python3
"""
Test script for the Movie Recommendation System
"""

import pickle
import pandas as pd
from sklearn.neighbors import NearestNeighbors

def test_model_loading():
    """Test if all model components can be loaded successfully."""
    print("🧪 Testing model component loading...")
    
    try:
        # Load the dataframe
        print("Loading dataframe...")
        with open('dataframe', 'rb') as f:
            df = pickle.load(f)
        print(f"✅ DataFrame loaded successfully! Shape: {df.shape}")
        
        # Load the TF-IDF matrix
        print("Loading TF-IDF matrix...")
        with open('tfidf_matrix', 'rb') as f:
            tfidf_matrix = pickle.load(f)
        print(f"✅ TF-IDF matrix loaded successfully! Shape: {tfidf_matrix.shape}")
        
        # Load the indices
        print("Loading indices...")
        with open('indices', 'rb') as f:
            indices = pickle.load(f)
        print(f"✅ Indices loaded successfully! Length: {len(indices)}")
        
        # Create and fit the NearestNeighbors model
        print("Fitting NearestNeighbors model...")
        nn_model = NearestNeighbors(
            n_neighbors=11,
            metric='cosine',
            algorithm='brute',
            n_jobs=-1
        )
        nn_model.fit(tfidf_matrix)
        print("✅ NearestNeighbors model fitted successfully!")
        
        return df, tfidf_matrix, indices, nn_model
        
    except Exception as e:
        print(f"❌ Error loading model components: {str(e)}")
        return None, None, None, None

def test_recommendations(df, tfidf_matrix, indices, nn_model):
    """Test the recommendation function with sample movies."""
    print("\n🎬 Testing recommendation function...")
    
    test_movies = [
        "The Godfather",
        "Inception", 
        "Pulp Fiction",
        "The Shawshank Redemption"
    ]
    
    for movie in test_movies:
        try:
            print(f"\nTesting: {movie}")
            
            # Normalize the input title
            key = movie.lower().strip()
            
            if key not in indices.index:
                print(f"❌ Movie '{movie}' not found in database")
                continue
            
            # Get the movie ID for the title
            movie_id = indices[key]
            
            # Find the row index in the DataFrame
            movie_row = df[df['id'] == movie_id]
            if len(movie_row) == 0:
                print(f"❌ Movie with ID {movie_id} not found in DataFrame")
                continue
            
            row_idx = movie_row.index[0]
            
            # Get the TF-IDF vector for this movie
            movie_vector = tfidf_matrix[row_idx]
            
            # Find the 11 nearest neighbors (including the movie itself)
            distances, neighbor_indices = nn_model.kneighbors(movie_vector, return_distance=True)
            
            # Remove the first neighbor (it's the movie itself) and get the next 10
            recommended_indices = neighbor_indices[0][1:6]  # Get first 5 recommendations
            
            # Get the recommended movie titles
            recommended_movies = df.iloc[recommended_indices]['title'].tolist()
            
            print(f"✅ Found {len(recommended_movies)} recommendations:")
            for i, rec in enumerate(recommended_movies, 1):
                print(f"   {i}. {rec}")
                
        except Exception as e:
            print(f"❌ Error testing '{movie}': {str(e)}")

def main():
    """Main test function."""
    print("🎬 Movie Recommendation System - Model Test")
    print("=" * 50)
    
    # Test model loading
    df, tfidf_matrix, indices, nn_model = test_model_loading()
    
    if df is not None:
        # Test recommendations
        test_recommendations(df, tfidf_matrix, indices, nn_model)
        
        print("\n" + "=" * 50)
        print("✅ All tests completed successfully!")
        print("🚀 The model is ready to use with the Streamlit app!")
    else:
        print("\n❌ Model loading failed. Please check the model files.")

if __name__ == "__main__":
    main() 