import React, { useState } from 'react';
import SongList from './SongList.js';
import './button.css'
function SongButton() {
    const [displaySongs, setDisplaySongs] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const handleButtonClick = () => {
        setDisplaySongs(true);
        setButtonClicked(true);
    };


    return (
        <div>
           {!buttonClicked && <button className="button" onClick={handleButtonClick}>Show Songs</button>}
            {displaySongs && <SongList />}
        </div>
    );
}
export default SongButton;