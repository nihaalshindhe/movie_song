import React, { useState, useEffect } from 'react';
import './movielist.css';


function MovieList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/movies') // Replace with your Flask API URL
            .then(response => response.json())
            .then(data => setMovies(data.movies))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className='movie-container'>
            
            {movies.map((movie, index) => (
                <div className="movie-item" key={index}>
                    <p>{movie.title}</p>
                    <p>{movie.synopsis}</p>
                    <img src={movie.image} alt={movie.title} />
                </div>
            ))}
        </div>
    );
}

export default MovieList;
