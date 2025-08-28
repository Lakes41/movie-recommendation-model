# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recommendation import load_model_components, get_recommendations
import os

app = FastAPI()

# CORS configuration for production
origins = [
    "http://localhost:5173",  # Local development
    "https://1cinematch.vercel.app/",  # Replace with your Vercel URL
    "https://*.vercel.app",  # Allow all Vercel subdomains
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
df, tfidf_matrix, indices, nn_model = load_model_components()

class MovieRequest(BaseModel):
    title: str
    similarity_threshold: float = 0.6

@app.post("/recommend")
def recommend_movies(req: MovieRequest):
    movies, corrected = get_recommendations(
        req.title,
        df,
        tfidf_matrix,
        indices,
        nn_model,
        req.similarity_threshold
    )
    if not movies:
        raise HTTPException(status_code=404, detail="Movie not found")
    return {"recommended": movies, "corrected_title": corrected}
