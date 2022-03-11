const PORT = 5000;

const express = require('express');
const cors = require('cors');
const spotifyAdapter = require('./spotify/spotifyAdapter.js');
const config = require('config');

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
	"client_id=" + config.get('spotify.client-id') +
	"&redirect_uri=http://localhost:5000/spotifyCallback" +
	"&scope=" + scopes +
	"&response_type=code&show_dialog=true";

const app = express()
app.use(cors());
app.get('/', (req,res) => {
	res.json('hi from backend')
	// res.json(redirect_uri)
});

app.get("/loginSpotify", (req,res) => {
	res.redirect(urlBuildSpotify);
	//return spotifyAdapter.getLoginSpotify(urlBuildSpotify)
	//res.json('sup')

})

app.get("/spotifyCallback", (req, res) => {
	const current_url = new URL('http://localhost:5000'+res.req.url);
	const search_params = current_url.searchParams;

	const accessToken = search_params.get('code');

	res.json(accessToken);
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));