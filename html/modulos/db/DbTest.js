/**
 * @author Héctor Fernando Hurtado
 * @description Pruebas para el Módulo Db
 */

/* global R07, console */

( function() {
	
	// Como en este momento ya está abierta la BD 'R07' y en las pruebas vamos a usar otra, 
	// guardamos una copia de la BD 'r07' para al finalizar las pruabas regresarla al módulo BD
	var BDabierta = R07.Db.db
	
	R07.Db.iniciar( 'test' ).then( function( DB ) {
		
		console.assert( DB.db, 'Miramos que existe la BD con la qué trabajar' )
		
		// Probamos el método trae
		return DB.trae()
	}).then( function( datoDevocional ) {
		
		console.assert( datoDevocional,                   'Miramos que la BD devuelve algo siempre' )
		console.assert( datoDevocional.devocional === '', 'Miramos que tiene listo el campo devocional para trabajar' )
	}).then( function() {
		
		// limpiamos todo
		R07.Db.db.close()		// Cerramos la BD de pruebas
		R07.Db.db = BDabierta	// Devolvemos la BD r07 al módulo
	})
    
})();