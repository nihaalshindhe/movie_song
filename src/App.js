import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './style.css';
import './Movie.js';

import MovieList from "./Movie.js";
import MovieButton from "./MovieButton.js";
import SongButton from "./SongButton.js";


function App() {
  const [data, setData] = useState("");
  const [val, setVal] = useState("upload image to predict");
  const [filename, setFilename] = useState("No file Uploaded");
  const [displayMovies, setDisplayMovies] = useState(false);
  const [file, setFile] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.message);
      });
  }, []);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing the camera: ", err));
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    videoRef.current.srcObject = null;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setFile(blob);
      setFilename("Captured Image");
    }, 'image/jpeg');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      axios.post("http://127.0.0.1:5000/upload", formData)
        .then((res) => {
          console.log(res.data.message);
          setVal(res.data.message);
        });
      alert("File uploaded successfully");
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      <body>
        <div className="box1">
          <p className="child1">
            Emotion Detection
          </p>
          <div className="info">
          <p className="child2">A Simple project leveraging the flexibility of react and the simplicity of Flask. This is a project I developed to better understand react and how to route requests. The movies are pulled from Tmdb using their Api and the same for songs using lastfm's Api</p>

          </div>
        </div>
        <p className="box2">
          Upload the image to detect.
        </p>
        <div className="box3">
          <button className="button_1" onClick={startCamera}>Start Camera</button>
          <button className="button_1" onClick={stopCamera}>Stop Camera</button>
          <button className="button_1" onClick={captureImage}>Capture Image</button>
        </div>
        <canvas ref={canvasRef} style={{ display: 'none'}}></canvas>
        <video ref={videoRef} style={{ display: 'block' }} autoPlay></video>
        <form onSubmit={handleSubmit}>
          <span className="box4"><p>File Uploaded : {filename}</p></span>
          <div className="child4">
            <button className="button_2" type="submit">
              PREDICT
            </button>
          </div>
        </form>
        <div className="box5">
          <span className="chil5">
            <p>Detected Image is : {val}</p>
          </span>
        </div>
        <div className="movies">
          {!displayMovies ? (
            <MovieButton setDisplayMovies={setDisplayMovies} />
          ) : (
            <MovieList />
          )}
          <SongButton />
        </div>
      </body>
    </>
  );
}

export default App;
