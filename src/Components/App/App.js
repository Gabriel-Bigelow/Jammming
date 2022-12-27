import React from 'react';

import './App.css';

import { Spotify } from "../../util/Spotify";

import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";
import { SavedPlaylist } from "../SavedPlaylist/SavedPlaylist";


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlists: [],
      playlistName: "New Playlist",
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.clonePlaylist = this.clonePlaylist.bind(this);
  }

  addTrack (track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(element => element.id === track.id)) {
      return;
    } else {
      tracks.push(track);
      this.setState({playlistTracks: tracks})
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(element => element.id !== track.id);

    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(element => element.uri);
    const playlists = this.state.playlists;
    playlists.unshift({name: this.state.playlistName, tracks: this.state.playlistTracks})

    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState(() => ({ 
      playlists: playlists,
      playlistName: "New Playlist", 
      playlistTracks: [] }) )
  }

  clonePlaylist(playlist) {
    this.setState({playlistName: playlist.name});
    this.setState({playlistTracks: playlist.tracks});
  }

  async search (term) {
    try {
      const response = await Spotify.search(term);
      this.setState({ searchResults: await response});
    }
    catch (error) {
      console.log(error);
    }
  }


  render () {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>

        <div id="savedPlaylists">
          {
            this.state.playlists.map((playlist) => {
              return <SavedPlaylist playlist={playlist} playlistId={playlist.id} playlistName={playlist.name} tracks={playlist.tracks} onClick={this.clonePlaylist} /> 
            })
          }
        </div>

      </div>
    )
  }

  async componentDidMount() {
    const playlists = Spotify.getPlaylists();
    this.setState({playlists: await playlists});
  }

  
}

export default App;
