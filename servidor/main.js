/**
 * Es necesario usar un servidor para probar la app con Chrome
 */

const http = require( 'http' );
const path = require( 'path' );
const fs   = require( 'fs' );
const PATH_WEB = '../html';

const servidor = http.createServer( function( req, res )
{
	if ( /\//.test( req.url ))
	{
		res.writeHead( 'Content-type', 'text/html' );
		fs.createReadStream( path.join( __dirname, PATH_WEB + '/index.html' )).pipe( res );
	}
});

servidor.listen( 7000, '127.0.0.1' );