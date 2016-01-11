
/**
 * ServiceWorker para tener experiencia offline
 */

/* global caches, fetch */

const VERSION = 'v1';
const APP     = 'r07';
const ASSETS  = [
	'/r07/',
	'/r07/index.js',
	'/r07/webManifest.json',
	'/r07/favicon.ico',
	'/r07/modulos/cargador/Cargador.js',
	'/r07/modulos/controladormaestro/ControladorMaestro.js',
	'/r07/modulos/db/Db.js',
	'/r07/modulos/editor/Editor.js',
	'/r07/modulos/editor/Editor.html',
	'/r07/modulos/elementos/Elementos.js',
	'/r07/modulos/omnibox/Omnibox.js',
	'/r07/modulos/utilidadfecha/UtilidadFecha.js',
];

const NOMBRE_CACHE = `${ APP }-${ VERSION }`;

self.addEventListener( 'install', function enInstall( evento )
{
	evento.waitUntil( caches.open( NOMBRE_CACHE ).then( cache => cache.addAll( ASSETS )));
});

self.addEventListener( 'fetch', function enFetch( e )
{	
	e.respondWith( caches.match( e.request ).then( function responde( respuesta )
	{
		// hacemos igual la petición por si hay alguna nueva versión del archivo
		fetch( e.request.clone() ).then( function haceElFetch( respuestaFetch )
		{
			if ( !respuestaFetch || respuestaFetch.status != 200 ) return;
			
			caches
				.open( NOMBRE_CACHE )
				.then( cache => cache.put( e.request, respuestaFetch.clone() ));
		}).catch( error => console.log( 'No alcancé al servidor' ));
		
		if ( respuesta ) return respuesta;
	}));
});