/**
 * Se encarga de realizar los pasos para crear un build para la web
 */

const p       = require( 'path' )
const Copia   = require( '../lib/copia' )
const ORIGEN  = 'C:\\Users\\Nando\\proyectos\\r07\\html'
const DESTINO = '../dest/web'

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

WebBuild.copiaTodo( ORIGEN, p.join( ORIGEN, DESTINO ))