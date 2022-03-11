const request = require('request-promise-native');

let spotifyAdapter = {};

const _request = (path) => {
    const options = {
        url: path,
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br'
        }
    }
    return request(options)
        .catch((err) => {
            throw new Error('404 - Undefined')
        })
}

spotifyAdapter = {
    baseUrl: 'puxardoconfig',

    getLoginSpotify: (path) => {
        Promise.resolve().then(() => {
            return _request(path)
        }).then(res => {
            return res;
        })
    }
}

module.exports = spotifyAdapter;
