/**
 * Se encarga de copiar archivos y/o carpetas según la ruta suministrada y tipos de archivos
 */
'use strict'

const fs = require( 'fs' )
const p  = require( 'path' )

module.exports =
{
	/**
	 * Guarda referencia al path de origen y al de destino
	 * @param	{String}	path	el de origen, asumo que está en forma absoluta
	 * @param	{String}	destino	el path de destino que asumo esta en forma absoluta
	 */
	copiaTodo( path, destino )
	{
		this.DESTINO = destino
		this.ORIGEN  = path
		this.paths   = [ path ]
		
		this.generador = this.generaLoop()
		this.generador.next()
	},
	/**
	 * Para cada path en la lista de paths buscamos crear la carpeta que la contiene y copiar el o los archivos
	 * que se encuentren dentro de esa carpeta  
	 */	
	*generaLoop()
	{
		while ( this.paths.length )
		{
			const path  = this.paths.pop()
			let archivo = yield this.clasificaPath( path )
			
			if ( archivo == 'carpeta' )
			{
				const nombreCarpeta = path.replace( this.ORIGEN, this.DESTINO)
				
				yield this.creaCarpeta( nombreCarpeta )
				yield this.listaArchivos( path )
			}
			
			if ( archivo == 'archivo' ) yield this.copiaArchivo( path )
		}
	},
	/**
	 * Mira el estado del path suministrado y el tipo lo devuelve al generador
	 * @param	{String}	path
	 */
	clasificaPath( path )
	{
		fs.stat( path, function( err, estado )
		{
			if ( err ) this.generador.throw( err )
			
			const hayExtension = this.EXTENSIONES.some( EXTENSION => EXTENSION.test( path ))
			const esTest       = /Test\.js$/.test( path ) 
			
			if ( estado.isFile() && hayExtension && !esTest ) this.generador.next( 'archivo' )
			else if ( estado.isDirectory() )                  this.generador.next( 'carpeta' )
			else                                              this.generador.next( null )
		}.bind( this ))
	},
	/**
	 * Crea la carpeta según el path solicitado. Debemos llamar al generador cuando terminamos para que
	 * prosiga con su flujo
	 * @param	{String}	path
	 */
	creaCarpeta( path )
	{
		fs.mkdir( path, function( err )
		{
			// Se genera error cuando ya existe la carpeta, así que no es necesario lanzar el error
			// if ( err ) this.generador.throw( err )
			
			this.generador.next()
		}.bind( this ))
	},
	/**
	 * Lista los archivos encontrados en la carpeta suministrada en el path y agrega estas nuevas rutas a la
	 * lista de paths
	 */
	listaArchivos( path )
	{
		fs.readdir( path, function( err, listaArchivos )
		{
			if ( err ) this.generador.throw( err )
			
			this.paths.push( ...listaArchivos.map( archivo => p.join( path, archivo )))
			
			this.generador.next()
		}.bind( this ))
	},
	/**
	 * Copia el archivo suministrado en el path de Destino
	 * Al terminar de copiar debemos avisar al generador para que continúe con su flujo
	 * @param	{String}	archivo
	 */
	copiaArchivo( archivo )
	{
		const archivoDestino = archivo.replace( this.ORIGEN, this.DESTINO )
		const writeStream    = fs.createWriteStream( archivoDestino )
		
		fs.createReadStream( archivo, { encoding: 'utf-8'}).pipe( writeStream )
		
		writeStream.on( 'finish', () => this.generador.next() )
	},
}