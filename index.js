const PORT = 5000;

const express = require('express');
const request = require('request');
const cors = require('cors');


// const spotifyAdapter = require('./spotify/spotifyAdapter.js');
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
	res.json('Backend')
});

app.get("/loginSpotify", (req,res) => {
	res.redirect(urlBuildSpotify);
	//return spotifyAdapter.getLoginSpotify(urlBuildSpotify)
})

app.get("/spotifyCallback", (req, res) => {
	const current_url = new URL('http://localhost:5000'+res.req.url);
	const search_params = current_url.searchParams;
	const code = search_params.get('code');
	
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: "http://localhost:5000/spotifyCallback",
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(config.get('spotify.client-id') + ':' + config.get('spotify.client-secret')).toString('base64'))
		},
		json: true
	};

	request.post(authOptions, (error, response, body) => {
		if (!error && response.statusCode === 200) {

			var access_token = body.access_token,
					refresh_token = body.refresh_token;

			var options = {
				url: 'https://api.spotify.com/v1/me',
				headers: { 'Authorization': 'Bearer ' + access_token },
				json: true
			};

			// use the access token to access the Spotify Web API
			request.get(options, function(error, response, body) {
				console.log(body.id);
			});

			// we can also pass the token to the browser to make requests from there
			res.redirect('/redirect' +
				querystring.stringify({
					access_token: access_token,
					refresh_token: refresh_token
				}));
		} else {
			res.redirect('/redirect' +
				querystring.stringify({
					error: 'invalid_token'
				}));
		}
	})
})

app.get('/redirect', (req, res) => {

})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));