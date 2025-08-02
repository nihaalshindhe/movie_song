from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import flask
from deepface import DeepFace
from dotenv import load_dotenv
import os

# Importing deps for image prediction

API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("SECRET_KEY")
USER_AGENT = 'Dataquest'
emotion2 = ''

import requests
def lastfm_get(url,payload):
    response = requests.get(url,headers=headers,params=payload)
    return response

# Using Text Blob

import random


def getImage(image):
    try:
        return image.get('loadlate')
    except:
        return 'NA'
def getsynopsys(movie):
    try:
        return movie.find_all("p", {"class":  "text-muted"})[1].getText()
    except:
        return 'NA'
def getMovieTitle(header):
    try:
        return header[0].find("a").getText()
    except:
        return 'NA'

headers = {
    'user-agent': USER_AGENT
}
payload = {
    'api_key': API_KEY,
    'method': 'tag.gettoptracks',
    'format': 'json',
    "tracks": 
    {
        "track": [
                  {...},{...}
                 ],
        "@attr": 
        {
            "page": "1",
            "perPage": "5",
            "totalPages": "1",
            "total": "2"
        }
    }
}

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route("/")
def home():
    return {"message": "Hello from backend"}
@app.route("/songs")
def songs():
   global emotion2
   check = []
   if emotion2 == "happy":
    url = f'http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=love&api_key={API_KEY}&format=json'
   elif emotion2 == "anger":
    url = f'http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=happy&api_key={API_KEY}&format=json'
   elif emotion2 == "sad":
    url = f'http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=sad&api_key={API_KEY}&format=json'
   else:
    url = f'http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=pop&api_key={API_KEY}&format=json'
   r = requests.get(url, params={'method': 'tag.gettoptracks'})
   res = r.json()
   songs = []
   for i in range(10):
    j = random.choice(range(0, 50))
    while j in check:
        j = random.choice(range(0, 50))
    check.append(j)
    song = {
            'name': res['tracks']['track'][j]['name'],
            'url': res['tracks']['track'][j]['url'],
            'artist': res['tracks']['track'][j]['artist']['name']
        }
    songs.append(song)
   return jsonify({'songs': songs})
@app.route("/upload", methods=['POST'])
def upload():
    global emotion2
    file = request.files['file']
    file.save(f"D:\\movie\\movie_song\\src\\uploads" + file.filename)
    img_path = f"D:\\movie\\movie_song\\src\\uploads"+file.filename
    pred = DeepFace.analyze(img_path,actions = ['emotion'],enforce_detection=False)
    print(pred)

    emotion = pred[0]['dominant_emotion']
    
    emotion2 = emotion
    print(emotion)
    print(type(emotion))
    if os.path.exists(f"D:\\movie\\movie_song\\src\\uploads{file.filename}"):
        os.remove(f"D:\\movie\\movie_song\\src\\uploads{file.filename}")
    return jsonify({'message':emotion})
    
@app.route("/movies")
def main():
    api_key = 'a366f5dcb2917ca83b9585ce27ad78f1'
    if emotion2 == "sad" or emotion2=="angry":
        genre_id = 35  # Comedy genre ID
    elif emotion2 == "fear":
        genre_id = 53 #Thriller genre ID
    elif emotion2 == "happy":
        genre_id = 878 #Fiction genre ID
    else:
        genre_id = 28  # Action genre ID

    # Fetch movie list by genre from TMDb API
    url = f'https://api.themoviedb.org/3/discover/movie?api_key={api_key}&with_genres={genre_id}&sort_by=popularity.desc'
    response = requests.get(url)
    data = response.json()

    # Extract relevant information from the API response
    movies = data.get('results', [])

    # Randomly select 5 movies from the list
    selected_movies = random.sample(movies, min(5, len(movies)))

    result = []
    for movie in selected_movies:
        title = movie.get("title", "")
        synopsis = movie.get("overview", "")
        image_url = f"https://image.tmdb.org/t/p/w500/{movie.get('poster_path', '')}"

        result.append({
            "title": title,
            "synopsis": synopsis,
            "image": image_url
        })

    print(result)
    return jsonify({"movies": result})

if __name__ == '__main__':
    app.run(debug=True,port=5000)