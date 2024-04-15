import React, { useState, useEffect } from 'react';
import './songs.css'
function SongList() {
    const [songs, setSongs] = useState([]);
    
    useEffect(() => {
        fetch('http://127.0.0.1:5000//songs') 
            .then(response => response.json())
            .then(data => setSongs(data.songs))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className='songs'>
            
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>
                        <a href={song.url} target="_blank" rel="noopener noreferrer">{song.name}</a> by {song.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SongList;
