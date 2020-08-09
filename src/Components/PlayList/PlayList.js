import React from 'react';
import './PlayList.css';
import TrackList from '../TrackList/TrackList';
import LoadingScreen from 'react-loading-screen';

class PlayList extends React.Component{
    constructor(props){
        super(props);
      
        this.handleNameChange = this.handleNameChange.bind(this);
        this.checkIfPlaylistTracks = this.checkIfPlaylistTracks.bind(this);
  
    }

    
    
    handleNameChange(e){
        this.props.onNameChange(e.target.value);
    
    }

    checkIfPlaylistTracks(){
        if(this.props.playlistTracks.length === 0){
            return true
        }else{
            return false
        }
    }

    
    render(){
        return (
            <div className='Playlist'>
             
                <input  value={this.props.playlistName}
                        placeholder='New playlist'
                        onChange={this.handleNameChange}/>
                <TrackList tracks={this.props.playlistTracks}
                            isRemoval={true}
                            onRemove={this.props.onRemove}/>
                <LoadingScreen
                        loading={this.props.open}
                        spinnerColor='black'
                        bgColor='transparent'
                        textColor='#676767'
                        text='saving'> 
                </LoadingScreen>
                
                <button 
                        disabled={this.checkIfPlaylistTracks() || !this.props.playlistName}
                        className='Playlist-save'
                        onClick={this.props.onSave}>SAVE TO SPOTIFY</button>

            </div>
        )
    }
}

export default PlayList;