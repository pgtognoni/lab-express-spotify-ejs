require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
console.log(clientID, clientSecret)

//setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))


// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', async (req, res) => {
    const artist = req.query['artist-name'];
    try {
        const search = await spotifyApi.searchArtists(artist)
        const body = search.body;
        res.render('artists-search', { body })
    } catch (err) {
        console.log('Error fetching artist: ', err)
    }
})

app.get('/albums/:id', async (req, res) => {
    const id = req.params.id
    const data = await spotifyApi.getArtistAlbums(id)
    const albums = data.body
    res.render('albums', { albums })
})

app.get('/tracks/:id', async (req, res) => {
    const id = req.params.id
    const data = await spotifyApi.getAlbumTracks(id)
    const tracks = data.body
    res.render('tracks', { tracks })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
