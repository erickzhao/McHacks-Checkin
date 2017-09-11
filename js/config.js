/* The name that'll be displayed on app */
var APP_NAME = "Check-In";

/*

The registartion system's API endpoint without trailing forward-slash
/orders /users and /auth/login are used.

*/
var API_ROOT = "https://my.hackmit.org";

/*
Should I use the ID scanner API?
*/
var ENABLE_SCANNER = true;

/*
TechX's internal scanner API endpoint
*/
var SCANNER_API = "http://localhost:5000/cardscanner"

/*
Endpoint for NFC
*/
var NFCDB_EP = 'http://localhost:5000/add_tag';

/*
Secret for NFC
*/
var NFCDB_SECRET = 'ihaveafewdevrequests';