import React, { Component } from 'react'

class Album extends Component {

    state = {
        albums: [],
        titleOrder: 'none',
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            albums: nextProps.results,
        }
    }

    sortTitlesDown = (a, b) => {
        const titleA = a.album.album_name.toUpperCase();
        const titleB = b.album.album_name.toUpperCase();

        let comparison = 0;
        if (titleA >= titleB) {
            comparison = 1;
        } else if (titleA <= titleB) {
            comparison = -1;
        }
        return comparison;
    }

    sortTitlesUp = (a, b) => {
        const titleA = a.album.album_name.toUpperCase();
        const titleB = b.album.album_name.toUpperCase();

        let comparison = 0;
        if (titleA <= titleB) {
            comparison = 1;
        } else if (titleA >= titleB) {
            comparison = -1;
        }
        return comparison;
    }

    sortAlbumsByTitle = () => {
        const sortedAlbums = this.props.results;
        if (this.state.titleOrder === 'down') {
            sortedAlbums.sort(this.sortTitlesUp);
            this.setState({ albums: sortedAlbums, titleOrder: 'up' });
        }
        else {
            sortedAlbums.sort(this.sortTitlesDown);
            this.setState({ albums: sortedAlbums, titleOrder: 'down' });
        }
        
    }

    onAlbumClick = (albumId) => {
        this.props.sendAlbumTracks(albumId);
    }

    render() {
        const { albums } = this.state;
        return (
            <div>
                <h2>{this.props.currentArtist}</h2>
                <h3>Albums</h3>
                Sort by: <a href="#" onClick={() => this.sortAlbumsByTitle()}>title</a>
                <br/> <br/>
                {
                    albums.map(a => (
                        <li key={a.album.album_id}>
                            {a.album.album_name} 
                            &nbsp; - &nbsp; <a href="#" onClick={() => this.onAlbumClick(a.album.album_id)}>View songs</a>
                        </li>
                    ))
                }
            </div>
        )
    }
}

export default Album