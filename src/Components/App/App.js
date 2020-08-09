import React, {useEffect}from 'react'; 
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify'
import PlaylistList from '../PlaylistList/PlaylistList';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      open: null,

      searchResults:[],

      playlistName: '',
     
      playlistTracks: [],

      playlistList:[],

      user: null
      
      };

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
      this.showPlaylistList = this.showPlaylistList.bind(this);
  }
 
  addTrack(track){

    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }else{
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    //我的写法：
    // let location = tracks.indexOf(track);
    // tracks.splice(location, 1)
    // this.setState({playlistTracks: tracks});
    //官方写法：
    tracks=tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks:tracks});
  }

  updatePlaylistName(name){
      this.setState({playlistName: name});
  }

  search(term){
    Spotify.getCurrentUserName().then(userName=>{
      console.log(userName)
      this.setState({
        user: userName
      })
    })
    
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
    
  }

  checkIfGotUserId(){
    Spotify.getCurrentUserId().then( userId =>
      this.setState({
      user: userId
    }))
    
  }


  savePlaylist(){
    this.setState({open: true});
    
    const trackUris = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackUris).then(()=>{
      this.setState({
        
        playlistName: '',
        playlistTracks: [],
        open: false
      });

      this.showPlaylistList();
      
      
    })
  }

  showPlaylistList(){
    Spotify.getUserPlaylists().then(resolvedValue=>{
      // console.log(resolvedValue);
      this.setState({playlistList: resolvedValue})
  })
}


     
    
    
  
  
  render() {
    return (
      <div>
        <h1>BeatNote</h1>
        <div className="App">  
        {this.state.user && (
        <h4 className="greeting">Hi, {this.state.user}</h4>
          )}
          <SearchBar onSearch={this.search}/>    
          <div className="App-playlist-playlistList">
            <SearchResults  searchResults={this.state.searchResults}
                            onAdd={this.addTrack}/>
            <PlayList 
                      playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}
                      open={this.state.open}/>  

            <PlaylistList  
                      onShow={this.showPlaylistList}
                      playlistList={this.state.playlistList}/> 
          </div>
          
          
        </div>
      </div>
    )
  }
}


export default App;
