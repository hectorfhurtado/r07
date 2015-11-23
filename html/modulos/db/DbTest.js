/**
 * @author Héctor Fernando Hurtado
 * @description Pruebas para el Módulo Db
 */

/* global R07, console */

( function()
{
	R07.Pruebas_DEBUG.then( function()
	{
		
		// Como en este momento ya está abierta la BD 'R07' y en las pruebas vamos a usar otra, 
		// guardamos una copia de la BD 'r07' para al finalizar las pruabas regresarla al módulo BD
		var BDabierta = R07.Db.db;
		
		var dato =
		{
			fecha     : new Date(),
			horainicio: '04:00',
			horafin   : null,
			devocional: '',
			texto     : '',
			capitulo  : '',
			libro     : ''
		};
		
		return R07.Db.iniciar( 'test' ).then( function( DB )
		{
			console.assert( DB.db, 'Miramos que existe la BD con la qué trabajar' );
			
			/***************************
			* Probamos el método trae
			* ************************/
			return DB.trae();
		}).then( function( datoDevocional )
		{
			console.assert( datoDevocional,                     'Miramos que la BD devuelve algo siempre' );
			console.assert( datoDevocional.devocional === '',   'Miramos que tiene listo el campo devocional para trabajar' );
			console.assert( datoDevocional.horainicio === null, 'Miramos que el dato vienen "en blanco"' );
			
			/*********************************
			* Probamos actualizaDato y trae
			* ******************************/
			return R07.Db.actualizaDato( dato );
		}).then( function()
		{
			return R07.Db.trae( dato.fecha );
		}).then( function( datoEnBD )
		{
			console.assert( datoEnBD,                                'Verificamos que la BD nos devuelve un objeto' );
			console.assert( dato.horainicio === datoEnBD.horainicio, 'Verificamos que el dato guardado sea el mismo que viene de la BD' );
			
			/********************************************
			* Probamos actualizaDato y trae nuevamente
			* *****************************************/
			dato.horafin = '05:00';
			
			return R07.Db.actualizaDato( dato );
		}).then( function()
		{
			return R07.Db.trae( dato.fecha );
		}).then(function( datoEnBD )
		{
			console.assert( datoEnBD,                                'Verificamos que la BD nos devuelve un objeto' );
			console.assert( dato.horainicio === datoEnBD.horainicio, 'Verificamos que el dato guardado sea el mismo que viene de la BD' );
			console.assert( dato.horafin === datoEnBD.horafin,       'Verificamos que el dato guardado sea el mismo que viene de la BD' );
		}).then( function()
		{
			/******************
			* limpiamos todo
			* ***************/
			R07.Db.db.transaction([ 'devocional' ], 'readwrite' ).objectStore( 'devocional' ).clear().onsuccess = function()
			{
				R07.Db.db.close();		// Cerramos la BD de pruebas
				R07.Db.db = BDabierta;	// Devolvemos la BD r07 al módulo
				
				console.info( 'Termina pruebas Db.js' );
			};
		});
	});
})();
