const clientId = '3c6b1fbc75e34b9a82ee4da61c734df5';
const redirectUri = 'http://react-beatnote.surge.sh';
let accessToken;

let userId;
let userName;

const Spotify = {

    getCurrentUserId(){
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        if(userId){
            const ifUserIdPromise = new Promise((resolve, reject) => {
                resolve(userId)
            })
            // console.log(ifUserIdPromise,'haha')
            return ifUserIdPromise;
        // create and return a promise that will resolve to that value.

        }else{
            return fetch('https://api.spotify.com/v1/me', {headers: headers})
            .then(response => response.json())
            .then(jsonResponse => {
                userId = jsonResponse.id;
                
                return userId
                //userId 就是这个promise的resolved value
                
            })

        }
    },

    getCurrentUserName(){
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        if(userName){
            const ifUserNamePromise = new Promise((resolve, reject) => {
                resolve(userName)
            })
            return ifUserNamePromise;
        // create and return a promise that will resolve to that value.

        }else{
            return fetch('https://api.spotify.com/v1/me', {headers: headers})
            .then(response => response.json())
            .then(jsonResponse => {
                userName = jsonResponse.display_name;
                
                return userName
                //userName 就是这个promise的resolved value
                
            })

        }
       
    }, 
    



    getAccessToken() {
        if (accessToken) {

            return accessToken;
        }

        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //This clears parameters, allowing us to grab a new access token 
            //when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } 
        else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.tracks){
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists[0].name,
                    album:track.album.name,
                    uri: track.uri
                }));
            });

    },

    savePlaylist(name, trackUris){
       if(!name || !trackUris.length){
           return new Error();
       }

        //create three default variables
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        
           return Spotify.getCurrentUserId().then(userId => {
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris}) 
                })
                
            
            })
        })
        

        
    },

    getUserPlaylists(){
        const accessToken = Spotify.getAccessToken();
        return Spotify.getCurrentUserId().then(userId => {
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.items){
                    return [];
                }
                return jsonResponse.items.map(playlist => ({
                    id: playlist.id,
                    name: playlist.name,  
                    uri: playlist.uri,
                    url: playlist.images[0].url,
                    byUser: playlist.owner.display_name
                }))
            })
        })
        

    }


}




export default Spotify;