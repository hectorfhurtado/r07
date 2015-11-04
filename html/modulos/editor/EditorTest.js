
/* global R07 */

( function() {
	
	var $libro = null
	var $capitulo = null
	
	function sleep( tiempo ) {
		
		return new Promise( function( resolve ) {
			
			setTimeout( () => resolve(), tiempo )
		})
	}
	
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
		var tempLibro        = $libro.value
		var tempCapitulo     = $capitulo.value
		var tempLocalStorage = localStorage.getItem( 'ultimoCapitulo' )
		
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
		 return R07.Editor._arrancaListeners()
	}).then( function() {
		
		var $body = document.querySelector( 'body' )
		var timer = null
		
		$body.addEventListener( 'actualizaDevocional', guardarHandler, true )
		
		function guardarHandler() {
			
			clearTimeout( timer )
			$body.removeEventListener( 'actualizaDevocional', guardarHandler, true )
		}
		
		timer = setTimeout( () => console.assert( false, 'Verificamos que no llamó el actualizaDevocional' ), 2000 )
		
		document.getElementById( 'EditorGuardarBtn' ).click()
	}).then( function() {
		
		/********************
		 * Hacemos limpieza
		 * *****************/
		localStorage.removeItem( 'ultimoCapitulo' )
	})
})()

// TODO: Porbar que al enviar actualizar devocional envía los cambios en el evento
// TODO: Probar que descarta los cambios al hacer click en Cancelar
// TODO: Probar las transiciones entre la vista principal y el Devocional
// TODO: Probar que el textarea no adicione espacioes como suele hacer
// TODO: Limpiar todo cuando acabe de probar