import React, { Component } from 'react'
import { trackLyricsRef } from '../APIService'

class Track extends Component {

    state = {
        tracks: [],
        titleOrder: 'none',
        lyricsOrder: 'none',
        lyricsVisible: false,
        lyricsBody: '',
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            tracks: nextProps.results,
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    sortTitlesDown = (a, b) => {
        const titleA = a.track.track_name.toUpperCase();
        const titleB = b.track.track_name.toUpperCase();

        let comparison = 0;
        if (titleA >= titleB) {
            comparison = 1;
        } else if (titleA <= titleB) {
            comparison = -1;
        }
        return comparison;
    }

    sortTitlesUp = (a, b) => {
        const titleA = a.track.track_name.toUpperCase();
        const titleB = b.track.track_name.toUpperCase();

        let comparison = 0;
        if (titleA <= titleB) {
            comparison = 1;
        } else if (titleA >= titleB) {
            comparison = -1;
        }
        return comparison;
    }

    sortTracksByTitle = () => {
        const sortedTracks = this.props.results;
        if (this.state.titleOrder === 'down') {
            sortedTracks.sort(this.sortTitlesUp);
            this.setState({ tracks: sortedTracks, titleOrder: 'up' });
        }
        else {
            sortedTracks.sort(this.sortTitlesDown);
            this.setState({ tracks: sortedTracks, titleOrder: 'down' });
        }
    }

    sortNumWordsDown = (a, b) => {
        const numA = a.track.lyrics_num_words;
        const numB = b.track.lyrics_num_words;

        let comparison = 0;
        if (numA >= numB) {
            comparison = 1;
        } else if (numA <= numB) {
            comparison = -1;
        }
        return comparison;
    }

    sortNumWordsUp = (a, b) => {
        const numA = a.track.lyrics_num_words;
        const numB = b.track.lyrics_num_words;

        let comparison = 0;
        if (numA <= numB) {
            comparison = 1;
        } else if (numA >= numB) {
            comparison = -1;
        }
        return comparison;
    }

    sortTracksByNumWords = () => {
        const sortedTracks = this.state.tracks;
        if (this.state.lyricsOrder === 'down') {
            sortedTracks.sort(this.sortNumWordsUp);
            this.setState({ tracks: sortedTracks, lyricsOrder: 'up' });
        }
        else {
            sortedTracks.sort(this.sortNumWordsDown);
            this.setState({ tracks: sortedTracks, lyricsOrder: 'down' });
        }
    }

    showLyrics = (trackId) => {
        trackLyricsRef(trackId)
        .then(result => {
            const lyrics_body = result.message.body.lyrics.lyrics_body;
            this.setState({ lyricsBody: lyrics_body, lyricsVisible: true });
        })
        .catch(error => error);
    }

    handleClick = (e) => {
        if (this.modal) {
            this.setState({ lyricsVisible: false });
        }
    }

    render() {
        const { tracks, lyricsVisible, lyricsBody } = this.state;
        const { page, onPagination, currentArtist } = this.props;
        return (
            <div>
                <h2>{currentArtist}</h2>
                <h3>Tracks</h3>
                Sort by: <a href="#" onClick={() => this.sortTracksByTitle()}>title</a> 
                    <span>&nbsp; | &nbsp; <a href="#" onClick={() => this.sortTracksByNumWords()}>number of words</a></span>
                <br /> <br />
                {
                    tracks.map((t, key) => (
                        <li key={key}>
                            <button name="trackbtn" className="btnlink" onClick={() => this.showLyrics(t.track.track_id)} >{t.track.track_name}</button>
                            &nbsp; - &nbsp; {t.track.artist_name}
                            &nbsp; - &nbsp; {t.track.lyrics_num_words}
                        </li>
                    ))
                }
                <span>    
                {
                    page !== null && currentArtist == '' &&
                    <button className="btnlink pagination" onClick={onPagination}> More </button>
                }
                </span>
                { lyricsVisible && 
                <div className="modal" ref={modal => this.modal = modal}>
                    <div className="modal-content">
                        <p>
                        {lyricsBody.split('\n').map((item, key) => {
                            return <span key={key}>{item}<br/></span>
                        })}
                        </p>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default Track