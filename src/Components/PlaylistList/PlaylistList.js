import React from "react";
import './PlaylistList.css';


class PlaylistList extends React.Component {
    render() {
        return (
            <div className="PlaylistList">
                
                <div className="PlaylistList_header">
                    <h2>Local Playlists</h2>
                    <button onClick={this.props.onShow}
                            className="showButton"
                                    >SHOW PLAYLISTS</button>
                </div>

                <div className="PlaylistList-body">



                    {this.props.playlistList.map(playlist => {
                        return (
                            <div key={playlist.id}
                                className="eachPlaylist">
                                <img src={playlist.url} className="playlistImg" />

                                <div className="playlistText">
                                    <h3>{playlist.name}</h3>
                                    <p className="userName">by {playlist.byUser}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>



            </div>
        )
    }
}

export default PlaylistList;