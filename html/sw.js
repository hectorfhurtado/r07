/**
 * ServiceWorker para tener experiencia offline
 */

const VERSION = 'v1';
const APP     = 'r07';
const ASSETS  = [
	'/',
	'/modulos/cargador/Cargador.js',
	'/modulos/controladormaestro/ControladorMaestro.js',
	'/modulos/db/Db.js',
	'/modulos/editor/Editor.js',
	'/modulos/editor/Editor.html',
	'/modulos/elementos/Elementos.js',
	'/modulos/omnibox/Omnibox.js',
	'/modulos/utilidadfecha/UtilidadFecha.js',
];

self.addEventListener( 'install', function( e )
{
	e.waitUntil( caches.open( `${ APP }-${ VERSION }` ).then( function( cache )
	{
		return cache.addAll( ASSETS );
	}));
});

// TODO: Continuar con el eventListener para el fetch