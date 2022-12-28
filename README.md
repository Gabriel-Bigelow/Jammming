# Jammming

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To see a live deploy of this project, visit [Jammming To Music](https://jammming-to-music.netlify.app/).

Jammming is a single-page application, built with React.

## Purpose

Jammmming is a single-page application written with React, that takes advantage of the Spotify API to handle playlist creation, cloning, and deletion.

## Features

### Search

Users can search for songs or artists to find music to add to their playlist. Search results will show up in the "Results" section.

### Clone

Users can take existing playlists from their account, and fine-tune them to create new, additional playlists.

## App Architecture

### Getting Data

This app uses the Spotify's [Web API](https://developer.spotify.com/documentation/web-api/) to exchange data and give Jammming access to a user's account to manage playlists.

A JavaScript class "Spotify" was created with defined object methods to handle HTML requests based on user interactions.

* .getAccessToken method fetches an OAuth2 access token from Spotify to enable the app to make changes to the user's account. The user is navigated to `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`, with the clientID and redirect URI, being defined within the app, not by the user. Upon allowing Jammming to access the user's account, they will be redirected back to Jammming, with the access token embedded in the URL. When the user returns, Jammming will grab the access token from the URL and save it until the user closes the window.

* .getPlaylists() method sends a request to `https://api.spotify.com/v1/me`, with the access token attached to the header of the request. If the request is successful, the response object is parsed from JSON and the id property is used to set a variable "userId". A subsequent request is sent to `https://api.spotify.com/v1/users/${userId}/playlists/`, with the access token set as the header. If the request is successful, the response is parsed from JSON and the "items" property is mapped to an array "playlists", with the following properties from "items": "id, name, artists[0].name, album.name, and uri. The playlists array is then returned. The fetched and posted data is used to create a client-side representation of the same data. .getPlaylists(), along with the map array function is used to display all saved playlists in the user's account.

* .search(term) method sends a GET request to `https://api.spotify.com/v1/search?type=track&q=${term}`, with the request header set with the previously retrieved Access Token, and the user-input `term` as a query parameter and returns a promise object containing song data, which is parsed from JSON, and mapped to an array and returned as searchResults. The searchResults array is used to generate HTML elements and displays the track information returned from the search in the "Results" section of the page.

* .savePlaylist(name, trackURIs) sends a GET request to `https://api.spotify.com/v1/me`, and if the request is successful, the response object is parsed from JSON, and the id property of that parsed object is used to set a variable "userId". A subsequent POST request is then made to `https://api.spotify.com/v1/users/${userId}/playlists`, with the previously defined "userId" as part of the request path, and the "name" argument being turned in to JSON and inserted into the body of the POST request. If the request is successful, the returned response object is parsed from JSON and the id property from the response is saved to a variable "playlistId", and a subsequent POST request is sent to `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks` with the previously mentioned "userId" and "playlistId" variables as part of the request path, and the "trackURIs" argument being parsed to JSON and set as the request body.

## Technologies

### Languages

<ul>
    <li>JavaScript(ES6)<ul>
            <li>React</li>
        </ul>
    </li>
    <li>HTML</li>
    <li>CSS</li>
</ul>

### APIs

* Spotify Web API (OAuth2)

### Testing

* Chrome Dev Tools

### Version Control

* Git
* GitHub

### Hosting & CI/CD

* GitHub
* Netlify

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## References
https://reactjs.org/

https://developer.spotify.com/documentation/web-api/

https://oauth.net/2/

