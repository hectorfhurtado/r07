/**
 * Se encarga de realizar los pasos para crear un build para la web
 */

const p       = require( 'path' )
const Copia   = require( '../lib/copia' )
const ROOT    = process.cwd()
const ORIGEN  = '/html'
const DESTINO = '/dest/web'

const WebBuild =
{
	// LIstado de las extensiones que quiero copiar
	EXTENSIONES: [
		/\.js$/,
		/\.html$/,
		/\.ico$/,
		/\.png$/,
		/\.json$/
	]
}
// Tomamos como prototipo Copia
Object.assign( Object.getPrototypeOf( WebBuild ), Copia )

WebBuild.copiaTodo( p.join( ROOT, ORIGEN ), p.join( ROOT, DESTINO ))
