import express from "express";
import cors from "cors";

const PORT = 5000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:5000/spotifyCallback";

const spotifyAuthEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = [
	"user-read-private",
	"user-read-email",
	"user-library-read",
	"playlist-read-collaborative",
	"playlist-read-private",
	"playlist-modify-private",
	"playlist-modify-public",
].join("%20");

const urlBuildSpotify = 
	spotifyAuthEndpoint +
	"client_id=" + client_id
	"&redirect_uri=http://localhost:5000/spotifyCallback" +
	"&scope=" + scopes +
	"&response_type=token&show_dialog=true";

const app = express()
app.use(cors());
app.get('/', (req,res) => {
	res.json('hi from backend')
	// res.json(redirect_uri)
});

app.get("/loginSpotify", (req,res) => {
	console.log(urlBuildSpotify);
	res.redirect(urlBuildSpotify)
})

app.get("/spotifyCallback", (req, res) => {
	res.json('sup')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));