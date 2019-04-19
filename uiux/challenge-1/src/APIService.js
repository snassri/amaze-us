const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
const endpoint = 'https://api.musixmatch.com/ws/1.1/';
const apikey = '1c681f3b2b004efec3fd061e5dea20fc'
// const endpoint = endpointBase + '?apikey=' + apikey

const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    }
}

const topTracksRef = (page) => {
    if (!page)
        page = 1;
    return fetch(proxyUrl + endpoint + 'chart.tracks.get?apikey=' + apikey + '&country=ca&page=' + page + '&page_size=50&chart_name=top', options)
        .then(response => response.json())
}

const artistSearchRef = (searchParam, page) => {
    if (!page)
        page = 1;
    return fetch(proxyUrl + endpoint + 'artist.search?apikey=' + apikey + '&q_artist=' + searchParam + '&page=' + page + '&page_size=50', options)
        .then(response => response.json())
}

const artistAlbumRef = (artistId) =>
    fetch(proxyUrl + endpoint + 'artist.albums.get?apikey=' + apikey + '&artist_id=' + artistId + '&page_size=21&s_release_date=desc', options)
        .then(response => response.json())

const trackSearchRef = (searchParam, page) => {
    if (!page)
        page = 1;
    return fetch(proxyUrl + endpoint + 'track.search?apikey=' + apikey + '&q_artist=' + searchParam + '&page=' + page + '&page_size=50&s_track_rating=desc', options)
        .then(response => response.json())
}

const trackLyricsRef = (trackId) =>
    fetch(proxyUrl + endpoint + 'track.lyrics.get?apikey=' + apikey + '&track_id=' + trackId, options)
        .then(response => response.json())

const albumTracksRef = (albumId) =>
    fetch(proxyUrl + endpoint + 'album.tracks.get?apikey=' + apikey + '&album_id=' + albumId, options)
        .then(response => response.json())

const trackGetRef = (path) =>
    fetch(proxyUrl + endpoint + '/' + path + '.json', options)


export {
    topTracksRef,
    artistSearchRef,
    artistAlbumRef,
    trackSearchRef,
    trackLyricsRef,
    albumTracksRef,
    trackGetRef,
}