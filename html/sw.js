
/**
 * ServiceWorker para tener experiencia offline
 */

/* global caches, fetch */

const VERSION = 'v1';
const APP     = 'r07';
const ASSETS  = [
	'/',
	'/index.js',
	'/webManifest.json',
	'/modulos/cargador/Cargador.js',
	'/modulos/controladormaestro/ControladorMaestro.js',
	'/modulos/db/Db.js',
	'/modulos/editor/Editor.js',
	'/modulos/editor/Editor.html',
	'/modulos/elementos/Elementos.js',
	'/modulos/omnibox/Omnibox.js',
	'/modulos/utilidadfecha/UtilidadFecha.js',
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