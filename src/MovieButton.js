import React, { useState } from 'react';
import './button.css'
function MovieButton({ setDisplayMovies }) {
    const handleClick = () => {
        setDisplayMovies(true); // Set state to display MovieList
    };

    return (
        <div>
            <button className="button" onClick={handleClick}>Show Movies</button>
        </div>
    );
}

export default MovieButton;