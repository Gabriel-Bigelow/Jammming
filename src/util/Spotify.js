const clientId = '4a327fcb301442078913bf08c211b683';
const redirectURI = "http://localhost:3000/";
let accessToken;


export const Spotify = {
    getAccessToken () {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //Clears the access token after expiration date, to allow for the ability to grab a new access token
            window.setTimeout(() => { accessToken = ''}, expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessUrl;
        }
    },


    async search (term) {
        const accessToken = await Spotify.getAccessToken();

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: {Authorization: `Bearer ${accessToken}`} })
            if (response.ok) {
                const jsonResponse = await response.json();
                if (!jsonResponse.tracks) {
                    return [];
                }

                const searchResults = jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))

                return searchResults;
            }
        }
        catch (error) {
            console.log(error);
        }
    },


    async savePlaylist (name, trackURIs) {
        if (!name || !trackURIs) {
            return;
        }

        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` }
        let userId;
        let playlistId;

        try {
            const userResponse = await fetch("https://api.spotify.com/v1/me", { headers: headers });
            if (userResponse.ok) {
                const jsonUserResponse = await userResponse.json();
                userId = jsonUserResponse.id;

                const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify( {name: name} )
                })
                if (playlistResponse.ok) {
                    const jsonPlaylistResponse = await playlistResponse.json();
                    playlistId = jsonPlaylistResponse.id;
                }


                const updateResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify( {uris: trackURIs } )
                })
                if (updateResponse.ok) {
                    return updateResponse;
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    },

    async getPlaylists () {
        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${await accessToken}` }

        let userId;
        let playlists;
        try {
            const userResponse = await fetch("https://api.spotify.com/v1/me", { headers: headers });
            if (userResponse.ok) {
                const jsonUserResponse = await userResponse.json();
                userId = jsonUserResponse.id;


                const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/`, {headers: headers})
                if (playlistResponse.ok) {
                    const jsonPlaylistResponse = await playlistResponse.json();
                    playlists = jsonPlaylistResponse.items;
                    //console.log(playlists);

                    for (let playlistId in playlists) {
                        //console.log(playlistId)
                        //console.log(playlists[playlistId])
                        const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlists[playlistId].id}/tracks/`, {headers: headers})
                        if (tracksResponse.ok) {
                            const jsonTracksResponse = await tracksResponse.json();

                            playlists[playlistId].tracks = jsonTracksResponse.items.map((item) => ({
                                id: item.track.id,
                                name: item.track.name,
                                artist: item.track.artists[0].name,
                                album: item.track.album.name,
                                uri: item.track.uri
                            }))
                        }
                    }
                }
            }

            return playlists;
        }
        catch(error) {
            console.log(`Error: ${error}`);
        }

    }
}