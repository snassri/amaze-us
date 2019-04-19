import React, { Component } from 'react';
import './App.css';
import * as api from './APIService'
import Artist from './components/Artist'
import Track from './components/Track'
import Album from './components/Album'

const applyUpdateTracks = (result, page) => (prevState) => ({
  tracks: [...prevState.tracks, ...result.message.body.track_list],
  page: page,
});

const applySetTracks = (result, page) => (prevState) => ({
  tracks: result.message.body.track_list,
  topTracks: result.message.body.track_list,
  page: page,
  tracksVisible: true,
  artistsVisible: false,
});

const applyUpdateArtists = (result, page) => (prevState) => ({
  artists: [...prevState.artists, ...result.message.body.artist_list],
  artistPage: page,
});

const applySetArtists = (result, page) => (prevState) => ({
  artists: result.message.body.artist_list,
  artistPage: page,
  tracksVisible: false,
  artistsVisible: true,
});

class KaraokeApp extends Component {
  state = {
    page: null,
    tracks: [],
    topTracks: [],
    searchTerm: '',
    artistPage: null,
    artists: [],
    artistsVisible: false,
    tracksVisible: false,
    albumsVisible: false,
    currentArtist: '',
    updatingLyrics: false,
  }

  componentDidMount() {
    this.fetchTracks(1);
  }

  onSetTracks = (result, page) => {
    page === 1
      ? this.setState(applySetTracks(result, page))
      : this.setState(applyUpdateTracks(result, page));

    this.updateTracksWithLyrics();
  }

  fetchTracks = (page) => {
    api.topTracksRef(page)
      .then(result => { this.onSetTracks(result, page) })
      .catch(error => error);
  }

  updateTracksWithLyrics = () => {
    const tracks = this.state.tracks;
    for (let i in tracks) {
      // console.log(tracks[i].track.track_name, tracks[i].track.track_id);
      let num_words = 0;
      api.trackLyricsRef(tracks[i].track.track_id)
        .then(result => {
          const lyrics_body = result.message.body.lyrics.lyrics_body;
          let lyrics_body_split = lyrics_body.split(" ").join(',').split("\n").join(',').split(",,").join(",").split(",");
          num_words = lyrics_body_split.length - 10; // subtract the extra disclaimer at the end
          tracks[i].track.lyrics_num_words = num_words;
          this.setState({ updatingLyrics: true });
        })
        .catch(error => error);
    }
  }

  onPaginateTracks = (e) =>
    this.fetchTracks(this.state.page + 1);

  showTopTracks = () => {
    this.setState({ tracks: this.state.topTracks, tracksVisible: true, artistsVisible: false, albumsVisible: false, currentArtist: '' });
  }

  onSearchChange = e =>
    this.setState({ searchTerm: e.target.value });

  onSetArtists = (result, page) => {
    page === 1
      ? this.setState(applySetArtists(result, page))
      : this.setState(applyUpdateArtists(result, page));
  }

  initialArtistSearch = e => {
    e.preventDefault();
    const searchTerm = this.state.searchTerm;
    this.fetchArtists(searchTerm, 1);
  }

  fetchArtists = (searchTerm, page) => {
    api.artistSearchRef(searchTerm, page)
      .then(result => { this.onSetArtists(result, page)})
      .catch(error => error);
  }

  onPaginateArtists = (e) =>
    this.fetchArtists(this.state.searchTerm, this.state.artistPage + 1);


  getArtistTracks = (artistName, pageOrder) => {
    let page = this.state.page;
    api.trackSearchRef(artistName, page)
      .then(result => this.setState({ tracks: result.message.body.track_list, artistsVisible: false, tracksVisible: true, albumsVisible: false, currentArtist: artistName }))
      .then(() => this.updateTracksWithLyrics())
      .catch(error => error);
  }

  getArtistAlbums = (artistId, artistName) => {
    api.artistAlbumRef(artistId)
      .then(result => this.setState({ albums: result.message.body.album_list, artistsVisible: false, tracksVisible: false, albumsVisible: true, currentArtist: artistName }))
      .catch(error => error);
  }

  getAlbumTracks = (albumId) => {
    api.albumTracksRef(albumId)
      .then(result => this.setState({ tracks: result.message.body.track_list, artistsVisible: false, tracksVisible: true, albumsVisible: false }))
      .catch(error => error);
  }

  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <div className="split left">
            <form onSubmit={this.initialArtistSearch}>
              <input
                className="searchinput"
                type='text'
                value={this.state.searchTerm}
                onChange={this.onSearchChange}
                placeholder="Search artists.."
              />
              <br />
              <button className="button" type='submit'> Go </button>
            </form>
          </div>
          <div className="split right">
            <a className="boxlink" href="#" onClick={() => this.showTopTracks()} > Get top tracks in Canada </a>
          </div>
        </div>
        <div className="results">
          <br />
          {this.state.artistsVisible ?
            <Artist results={this.state.artists} page={this.state.artistPage} sendArtistName={this.getArtistTracks} sendArtistId={this.getArtistAlbums} onPagination={this.onPaginateArtists} />
            : null
          }
          {this.state.tracksVisible ?
            <Track results={this.state.tracks} page={this.state.page} currentArtist={this.state.currentArtist} onPagination={this.onPaginateTracks} />
            : null
          }
          {this.state.albumsVisible ?
            <Album results={this.state.albums} sendAlbumTracks={this.getAlbumTracks} currentArtist={this.state.currentArtist} />
            : null
          }
        </div>
      </div>
    );
  }
}

export default KaraokeApp;
