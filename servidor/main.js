/**
 * Es necesario usar un servidor para probar la app con Chrome
 */

/* global __dirname */

const http = require( 'http' );
const path = require( 'path' );
const fs   = require( 'fs' );
const PATH_WEB = '../html';

const servidor = http.createServer( servir );

function servir( req, res )
{
	
	if ( /\/$|index\.html$/.test( req.url ))
	{
		res.setHeader( 'Content-type', 'text/html' );
		fs.createReadStream( path.join( __dirname, PATH_WEB + '/index.html' )).pipe( res );
		return;
	}
	
	if ( /\.html$/.test( req.url ))      res.setHeader( 'Content-type', 'text/html' );
	else if ( /\.js$/.test( req.url ))   res.setHeader( 'Content-type', 'application/javascript' );
	else if ( /\.json$/.test( req.url )) res.setHeader( 'Content-type', 'application/json' );
	else if ( /\.ico$/.test( req.url ))  res.setHeader( 'Content-type', 'image/x-icon' )
	else if ( /\.svg$/.test( req.url ))  res.setHeader( 'Content-type', 'image/svg+xml' )
	else                                 return;
	
	if ( /icono\.html$/.test( req.url ))
		// Esto es para poder crear los íconos a partir de archivos .svg
		fs.createReadStream( path.join( __dirname, req.url )).pipe( res );
	else
		fs.createReadStream( path.join( __dirname, PATH_WEB + req.url )).pipe( res );
}

servidor.listen( 7000 );

console.log( 'Oyendo http en el puerto 7000...' );