/**
 * Se encarga de realizar los pasos para crear un build para la web
 */

const Copia   = require( '../lib/copia' )
const ORIGEN  = 'C:\\Users\\Nando\\proyectos\\r07\\html'
const DESTINO = 'C:\\Users\\Nando\\proyectos\\r07\\dest\\web'


Copia.copiaTodo( ORIGEN, DESTINO )