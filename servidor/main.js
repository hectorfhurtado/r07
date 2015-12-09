/**
 * Es necesario usar un servidor para probar la app con Chrome
 */

const http = require( 'http' );
const path = require( 'path' );
const fs   = require( 'fs' );
const PATH_WEB = '../html';

const servidor = http.createServer( function( req, res )
{
	if ( /\/$|index\.html$/.test( req.url ))
	{
		res.writeHead( 'Content-type', 'text/html' );
		fs.createReadStream( path.join( __dirname, PATH_WEB + '/index.html' )).pipe( res );
		return;
	}
	
	if ( /\.html$/.test( req.url ))      res.writeHead( 'Content-type', 'text/html' );
	else if ( /\.js$/.test( req.url ))   res.writeHead( 'Content-type', 'application/javascript' );	
	else                                 return;
	
	fs.createReadStream( path.join( __dirname,  PATH_WEB + req.url )).pipe( res );
});


servidor.listen( 7000 );
console.log( 'Oyendo en el puerto 7000...' );