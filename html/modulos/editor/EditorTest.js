
/* global R07 */

( function() {
	
	var $libro = null
	var $capitulo = null
	
	function sleep( tiempo ) {
		
		return new Promise( function( resolve ) {
			
			setTimeout( () => resolve(), tiempo )
		})
	}
	
	var tempLibro = null
	var tempCapitulo = null
	var tempLocalStorage = null
	
	/*********************
	 * Probamos _traeDOM
	 * ******************/
	R07.Editor._traeDOM().then( function() {
		
		console.assert( !!document.getElementById( 'Editor'), 'Verificamos que existe el módulo' )
		
		$libro    = document.getElementById( 'EditorLibro' )
		$capitulo = document.getElementById( 'EditorCapitulo' )
		
		/***********************************************************************************************
		* Guardamos temporalmente los datos que tenga el usuario para realizarlas pruebas en 'limpio'
		* ********************************************************************************************/
		tempLibro        = $libro.value
		tempCapitulo     = $capitulo.value
		tempLocalStorage = localStorage.getItem( 'ultimoCapitulo' )
		
		$libro.value    = ''
		$capitulo.value = ''
		localStorage.removeItem('ultimoCapitulo')
		
		/***********************************
		 * Probamos _arrancaInputCapitulos
		 * ********************************/
		return R07.Editor._arrancaInputCapitulos()
	}).then( function() {
		
		console.assert( $capitulo.value === '1', 'Verificamos que cuando no hay devocional arranca con el capítulo uno' )
		
		return R07.Editor._arrancaInputCapitulos()
	}).then( function() {
		
		// Para la prueba
		R07.Editor.devocional = {
			libro: ''
		}
		console.assert( $capitulo.value === '1', 'Verificamos que cuando el devocional no tiene información de libro, arranca con Génesis' )
		
		R07.Editor.devocional = null
		
		/********************************
		* Probamos _arrancaInputLibros
		* *****************************/
		return R07.Editor._arrancaInputLibros() 
	}).then( function() {
		
		console.assert( $libro.value === 'Génesis', 'Verificamos que cuando no hay devocional arranca con Génesis' )
		
		return R07.Editor._arrancaInputLibros() 
	}).then( function() {
		
		// Para la prueba
		R07.Editor.devocional = {
			libro: ''
		}
		console.assert( $libro.value === 'Génesis', 'Verificamos que cuando el devocional no tiene información de libro, arranca con Génesis' )
		
		R07.Editor.devocional = null
		
		/*********************
		 * Probamos _guardar
		 * ******************/
		 $libro.value    = 'Levítico'
		 $capitulo.value = '2'
		 
		 return R07.Editor._guardar()
	}).then( function() {
		
		var info = JSON.parse( localStorage.getItem( 'ultimoCapitulo' ))
		
		console.assert( info.libro === 'Levítico', 'Guardó el nombre del libro correctamente' )
		console.assert( info.capitulo === '2',     'Guardó el número del capítulo correctamente' )

		
		/******************************************************************************
		 * Probamos _arrancaInputCapitulos con elementos guardados en el localStorage
		 * ***************************************************************************/
		$capitulo.value = '2'
		
		return R07.Editor._arrancaInputCapitulos()	
	}).then( function() {
		
		console.assert( $capitulo.value === '3', 'Verificamos que el número del capítulo es el siguiente al que aparece en el localStorage', `Valor del capítulo: ${ $capitulo.value }` )
		
		/***************************************************************************
		 * Probamos _arrancaInputLibros con elementos guardados en el localStorage
		 * ************************************************************************/
		$libro.value = ''
		
		return R07.Editor._arrancaInputLibros()
	}).then( function() {
		
		console.assert( $libro.value === 'Levítico', 'Confirmamos que obtiene el valor que está guardado en el localStorage' )
	}).then( function() {
		
		/***************************************************************************
		 * Probamos _arrancaInputCapitulos con elementos guardados en el localStorage
		 * y el último capítulo del libro
		 * ************************************************************************/
		$capitulo.value = '36'
		
		return R07.Editor._guardar()
	}).then( function() {
		// Tenemos que llamarlo para que actualice la info del ultimo Capitulo
		return R07.Editor._arrancaInputCapitulos()
	}).then( function() {
		
		return R07.Editor._arrancaInputLibros()
	}).then( function() {
	
		console.assert( $libro.value === 'Números', 'Miramos que cambió de libro', `Nombre del libro ${ $libro.value }` )	
		console.assert( $capitulo.value === '1',    'Miramos que cambió de libro', `Número del capítulo ${ $capitulo.value }` )
			
		/************************************************************************************************
		 * Probamos _arrancaInputCapitulos con el último capítulo de Apocalipsis, debe volver a Génesis
		 * *********************************************************************************************/
		 $libro.value    = 'Apocalipsis'
		 $capitulo.value = '22'
		 
		 return R07.Editor._guardar()
		 
	}).then( function() {
		
		return R07.Editor._arrancaInputCapitulos()
	}).then( function() {
		
		return R07.Editor._arrancaInputLibros()
	}).then( function() {
		
		console.assert( $libro.value === 'Génesis', 'Miramos que comenzó de nuevo', `Nombre del libro ${ $libro.value }` )	
		console.assert( $capitulo.value === '1',    'Miramos que comenzó de nuevo', `Número del capítulo ${ $capitulo.value }` )
	
		return sleep( 2000 )	
	}).then( function() {
		/**********************************************************************************************
		 * Probamos _arrancaListeners envía el evento actualizaDevocional al oprimir el botón Guardar
		 * *******************************************************************************************/
		document.getElementById( 'EditorDevocional' ).value = 'Aprendí algo nuevo'
		R07.Editor.devocional = {}
		
		 return R07.Editor._arrancaListeners()
	}).then( function() {
		
		var $body = document.querySelector( 'body' )
		var timer = null
		
		$body.addEventListener( 'actualizaDevocional', guardarHandler, true )
		
		function guardarHandler( e ) {
			
			clearTimeout( timer )
			$body.removeEventListener( 'actualizaDevocional', guardarHandler, true )
			
			if ( e.detail ) {
				
				console.assert( e.detail.libro      === 'Génesis',            'Verificamos que tenemos la información del libro', e.detail )
				console.assert( e.detail.capitulo   === '1',                  'Verificamos que tenemos la información del capítulo', e.detail.capitulo )
				console.assert( e.detail.devocional === 'Aprendí algo nuevo', 'Verificamos que tenemos la información del devocional como tal', e.detail.devocional )
			}
			else {
				console.assert( false, 'Verificamos que no llegó nada en evento', e.detail )
			}
		}
		
		timer = setTimeout( () => console.assert( false, 'Verificamos que no llamó el actualizaDevocional' ), 2000 )
		
		document.getElementById( 'EditorGuardarBtn' ).click()
		
		return sleep( 1000 )
	}).then( function() {
		
		/************************************************************************************************
		 * Probamos _clickCancelarBotonHandler. Debe lanzar el evento para salir de la vista del Editor
		 * *********************************************************************************************/
		var $body = document.querySelector( 'body' )
		var timer = null
		
		$body.addEventListener( 'saleEditor', saleEditorHandler, true )
		
		function saleEditorHandler() {
			
			clearTimeout( timer )
			$body.removeEventListener( 'saleEditor', saleEditorHandler, true )
		}
		
		timer = setTimeout( () => console.assert( false, 'Verificamos que no llamó el saleEditor' ), 2000 )
		
		document.getElementById( 'EditorCancelarBtn' ).click()
		
		return sleep( 1000 )
	}).then( function() {
		
		var DEVOCIONAL = {
			libro     : 'Deuteronomio',
			capitulo  : '28',
			devocional: 'El Señor es bueno'
		}
		
		/****************************************************************************************************************
		 * Probamos actualizaDevocional: debe tomar los datos que suministramos y actualizar todo el UI conforme a esto
		 * *************************************************************************************************************/
		return R07.Editor.actualizaDevocional( DEVOCIONAL )
	}).then( function() {
		
		console.assert( R07.Editor.devocional.libro == 'Deuteronomio',           'Verificamos que tiene el libro suministrado' )
		console.assert( R07.Editor.devocional.capitulo == '28',                  'Verificamos que tiene el capitulo suministrado' )
		console.assert( R07.Editor.devocional.devocional == 'El Señor es bueno', 'Verificamos que tiene el devocional suministrado' )
		
		console.assert( $libro.value == 'Deuteronomio',                                             'Verificamos que tiene el libro suministrado' )
		console.assert( $capitulo.value == '28',                                                    'Verificamos que tiene el capitulo suministrado' )
		console.assert( document.getElementById( 'EditorDevocional' ).value == 'El Señor es bueno', 'Verificamos que tiene el devocional suministrado' )
	}).then( function() {
		
		/********************
		 * Hacemos limpieza
		 * *****************/
		if ( tempLibro ) $libro.value = tempLibro
		if ( tempCapitulo ) $capitulo.value = tempCapitulo
		
		localStorage.setItem( 'ultimoCapitulo', tempLocalStorage )
		
		console.info( 'Termina pruebas de Editor.js' )
	})
})()

// TODO: Probar las transiciones entre la vista principal y el Devocional