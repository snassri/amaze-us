import React, { Component } from 'react'


class Artist extends Component {

  onTracksClick = (artistName) => {
    this.props.sendArtistName(artistName);
  }

  onAlbumsClick = (artistId, artistName) => {
    this.props.sendArtistId(artistId, artistName);
  }

  render() {
    const { page, onPagination } = this.props;
    return (
      <div>
        {
          this.props.results.map(r => (
            <li key={r.artist.artist_id}>
              {r.artist.artist_name}
              &nbsp; - &nbsp; <a href="#" onClick={() => this.onAlbumsClick(r.artist.artist_id, r.artist.artist_name)}>View albums</a>
              &nbsp; - &nbsp; <a href="#" onClick={() => this.onTracksClick(r.artist.artist_name)}>View top songs</a>
            </li>
          ))
        }
      <span>
        {
          page !== null &&
          <button className="btnlink pagination" onClick={onPagination}> More </button>
        }
      </span>
      </div>
    )
  }
}

/*
  const Artist = (props) => {
    return (
      props.results.map(r => (
        <li key={r.artist.artist_id}>
          {r.artist.artist_name}
          &nbsp; - &nbsp; <a href="#" onClick={() => this.getAlbums(r.artist.artist_id)}>View albums</a>
          &nbsp; - &nbsp; <a href="#" onClick={() => this.handleNewTracks(r.artist.artist_name)}>View top songs</a>
        </li>
      ))
    )
  }
*/

export default Artist