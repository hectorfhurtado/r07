/**
 * Se encarga de copiar archivos y/o carpetas según la ruta suministrada y tipos de archivos
 */
'use strict'

const fs = require( 'fs' )
const p  = require( 'path' )

module.exports =
{
	// LIstado de las extensiones que quiero copiar
	EXTENSIONES: [
		/[^(Test)]\.js$/,
		/\.html$/,
		/\.svg$/,
		/\.ico$/,
		/\.png$/
	],
	/**
	 * Guarda referencia al path de origen y al de destino
	 * @param	{String}	path	el de origen, asumo que está en forma absoluta
	 * @param	{String}	destino	el path de destino que asumo esta en forma absoluta
	 */
	copiaTodo( path, destino )
	{
		this.DESTINO = destino
		this.ORIGEN  = path
		
		this.creaDirectorio( destino )
		
		this.leeDirectorio( path )
			.then( this.clasificaArchivos.bind( this ))
			.then( console.log )
			.catch( console.error )
	},
	/**
	 * Lee el contenido del directorio
	 * @param	{String}	path
	 * @return	{Promise}
	 */
	leeDirectorio( path )
	{
		return new Promise(( res, rej ) =>
		{
			fs.readdir( path, function( err, listaArchivos )
			{
				if ( err )
				{
					rej( err )
					return
				}
				res( listaArchivos.map( archivo => p.join( path, archivo )))
			})
		})
	},
	/**
	 * Solo devuelve un arreglo de promesas, aunque al parecer estas no se completan
	 * TODO: ver por qué no se completan las promesas
	 * @param	{Array}	listaArchivos
	 * @return	{Promise}
	 */
	clasificaArchivos( listaArchivos )
	{
		return Promise.all( listaArchivos.map( archivo => this.verificaArchivo( archivo )))
	},
	/**
	 * Mira el tipo de archivo y si es un directorio llama recursivamente al lector de directorios
	 * Si es un archivo, manda a copiarlo en la carpeta de destino
	 * @param	{String}	archivo
	 * @return	{Promise}
	 */
	verificaArchivo( archivo )
	{
		return new Promise(( res, rej ) =>
		{
			fs.stat( archivo, ( err, estado ) =>
			{
				if ( err )
				{
					rej( err )
					return
				}
				
				if ( estado.isFile() && this.EXTENSIONES.some( EXTENSION => EXTENSION.test( archivo )))
				{
					this.copiaArchivo( archivo )
					res( archivo )
					return
				}
				
				if ( estado.isDirectory() )
				{
					const nombreArchivo = archivo.replace( this.ORIGEN, this.DESTINO)
					
					this.creaDirectorio( nombreArchivo )
					res( this.leeDirectorio( archivo ).then( this.clasificaArchivos.bind( this )))
					return
				}
			})
			
		})
	},
	/**
	 * Crea una carpeta, si ya eciste, genera un error, pero no significa que no funcione
	 * @param	{String}	path
	 */
	creaDirectorio( path )
	{
		fs.mkdir( path, err =>
		{
			// if ( err ) console.log( err )			
		})
	},
	/**
	 * Copia el archivo suministrado en el path de Destino
	 * @param	{String}	archivo
	 */
	copiaArchivo( archivo )
	{
		const archivoDestino = archivo.replace( this.ORIGEN, this.DESTINO )
		
		fs.createReadStream( archivo, { encoding: 'utf-8'}).pipe( fs.createWriteStream( archivoDestino ))
	},
}