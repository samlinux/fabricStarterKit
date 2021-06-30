/**
 * Set some global variables
 * -> can be used throughout the whole application
 */

// Set RouterDOM-Link
const Link = ReactRouterDOM.Link;

// Set RouterDOM-Route
const Route = ReactRouterDOM.Route;

// Set API-URL
let apiUrl = window.location.protocol + '//' + window.location.hostname;
if (window.location.port) {
    apiUrl += ':' + window.location.port;
}
apiUrl += '/api/';
// Overwrite API-URL here (if cross-domain)
// apiUrl = 'http://xxx.xx.xxx.xx:3000/api/';