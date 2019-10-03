const {
    sp_id,
    sp_secret
} = require('../json/config.json');
const SpotifyWebApi = require('spotify-web-api-node');
const ytsr = require('ytsr');
let async = require("async");

let spotifyApi = new SpotifyWebApi({
    clientId: sp_id,
    clientSecret: sp_secret
});
async function extractTrack(trackId) {
    return spotifyApi.getTrack(trackId).then(function (data) {
        //console.log(data);
        var details = {
            name: '',
            artists: [],
            album_name: '',
            release_date: '',
            cover_url: '',
            url: ''
        }
        details.name = data.body.name;
        data.body.artists.forEach(artist => {
            details.artists.push(artist.name);
        });
        details.album_name = data.body.album.name;
        details.release_date = data.body.album.release_date;
        details.cover_url = data.body.album.images[0].url;
        details.url = data.body.external_urls.spotify;
        return details;
    });
}
// I have no idea why limit is not working
async function extractPlaylist(playlistId) {
    return spotifyApi.getPlaylist(playlistId, { pageSize: 200, limit: 200 }).then(function (data) {
        var details = {
            name: '',
            total_tracks: 0,
            tracks: []
        }
        details.name = data.body.name + ' - ' + data.body.owner.display_name;
        details.total_tracks = data.body.tracks.total;
        data.body.tracks.items.forEach(item => {
            details.tracks.push(item.track.id);
        });
        return details;
    });
}
async function extractAlbum(albumId) {
    return spotifyApi.getAlbum(albumId, { limit: 200 }).then(function (data) {
        var details = {
            name: '',
            total_tracks: 0,
            tracks: []
        }
        details.name = data.body.name + ' - ' + data.body.label;
        details.total_tracks = data.body.tracks.total;
        data.body.tracks.items.forEach(item => {
            details.tracks.push(item.id);
        });
        return details;
    });
}
async function setup_SP() {
    return spotifyApi.clientCredentialsGrant().then(
        (data) => {
            return data.body['access_token'];
        },
        (err) => {
            console.error(
                'Something went wrong when retrieving an access token :',
                err.message
            );
        }
    );
}
async function getID(url) {
    var token = await setup_SP();
    spotifyApi.setAccessToken(token);
    var id;
    for (let i = 0; i < url.length; i++) {
        if (i > 10 && url[i] == '/') {
            for (let j = i; j < url.length; j++) {
                if (url[j] == '/') {
                    id = url.slice(++j);
                }
            }
        }
    }
    return id;
}
async function getTrack(url) {
    const ID = await getID(url);
    console.log(ID);
    return extractTrack(ID);
}
async function getAlbum(url) {
    const ID = await getID(url);
    return extractAlbum(ID);
}
async function getPlaylist(url) {
    const ID = await getID(url);
    return extractPlaylist(ID);
}


module.exports = {
    parseSpoti: async (url, type) => {
        return new Promise(async (resolve, reject) => {
            switch (type) {
                case 'song': {
                    const songData = await getTrack(url);
                    console.log(songData);
                    const query = `${songData.name} ${songData.artists[0]}`;
                    const YT_data = await ytsr(query);
                    console.log(YT_data.items[0]);
                    resolve([YT_data.items[0], songData]);
                    break;
                }
                case "playlist": {
                    const plData = await getPlaylist(url);
                    // console.log(alData);
                    let tracks = [];
                    async.map(plData.tracks, async (el) => {
                        const songData = await extractTrack(el);
                        //console.log(songData);
                        const query = `${songData.name} ${songData.artists[0]}`;
                        const YT_data = await ytsr(query);
                        //console.log([YT_data.items[0], songData]);
                        tracks.push([YT_data.items[0], songData]);
                    }, (err, results) => {
                        console.log(err);
                        resolve(tracks);
                    })
                    break;
                }
                case "album": {
                    const alData = await getAlbum(url);
                    // console.log(alData);
                    let tracks = [];
                    async.map(alData.tracks, async (el) => {
                        const songData = await extractTrack(el);
                        //console.log(songData);
                        const query = `${songData.name} ${songData.artists[0]}`;
                        const YT_data = await ytsr(query);
                        //console.log([YT_data.items[0], songData]);
                        tracks.push([YT_data.items[0], songData]);
                    }, (err, results) => {
                        resolve(tracks);
                    })


                    //console.log(tracks);

                }
            }

        }).catch(err => console.error(err))
    }
}