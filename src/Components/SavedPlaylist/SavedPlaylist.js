import React from 'react';
import { TrackList } from '../TrackList/TrackList';

import './SavedPlaylist.css'

export class SavedPlaylist extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }    

    handleNameChange(e) {
        this.props.onNameChange(e.target.value)
    }

    handleClick (e) {
        this.props.onClick(this.props.playlist)
    }


    render() {
        return (
                <div className="saved-playlist">
                    <button id="clone-button" onClick={this.handleClick}>CLONE PLAYLIST</button>
                    <h1 id="title">{this.props.playlistName}</h1>
                    <TrackList tracks={this.props.tracks} onRemove={this.props.onRemove} />
                </div>
        )
    }
}