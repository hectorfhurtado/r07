
/* global R07 */

( function() {
	
	var $libro = null
	var $capitulo = null
	
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
		$capitulo.value = '1'
		localStorage.removeItem('ultimoCapitulo')
		
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

		/***************************************************************************
		 * Probamos _arrancaInputLibros con elementos guardados en el localStorage
		 * ************************************************************************/
		$libro.value = ''
		
		return R07.Editor._arrancaInputLibros()
	}).then( function() {
		
		console.assert( $libro.value === 'Levítico', 'Confirmamos que obtiene el valor que está guardado en el localStorage' )
		
		$capitulo.value = '2'
		
		/******************************************************************************
		 * Probamos _arrancaInputCapitulos con elementos guardados en el localStorage
		 * ***************************************************************************/
		return R07.Editor._arrancaInputCapitulos()	
	}).then( function() {
		
		console.assert( $capitulo.value === '3', 'Verificamos que el número del capítulo es el siguiente al que aparece en el localStorage', `Valor del capítulo: ${ $capitulo.value }` )
		
	}).then( function() {
		
		/***************************************************************************
		 * Probamos _arrancaInputLibros con elementos guardados en el localStorage
		 * y el último capítulo del libro
		 * ************************************************************************/
		$capitulo.value = '36'
		
		return R07.Editor._guardar()
	}).then( function() {
		// Tenemos que llamarlo para que actualice la info del ultimo Capitulo
		return R07.Editor._arrancaInputLibros()
	}).then( function() {
		
		return R07.Editor._arrancaInputCapitulos()
	}).then( function() {
	
		console.assert( $libro.value === 'Números', 'Miramos que cambió de libro', `Nombre del libro ${ $libro.value }` )	
		console.assert( $capitulo.value === '1', 'Miramos que cambió de libro', `Número del capítulo ${ $capitulo.value }` )
			
	}).then( function() {
		
		/********************
		 * Hacemos limpieza
		 * *****************/
		localStorage.removeItem( 'ultimoCapitulo' )
	})
})()


// TODO: Probar que al terminar Apocalipsis vuelve a comenzar con Génesis
// TODO: Probar que arranca con el libro que escoja el usuario 
// TODO: Probar que envía el evento para actualizar el devocional al hacer click en Guardar
// TODO: Probar que descarta los cambios al hacer click en Cancelar
// TODO: Probar las transiciones entre la vista principal y el Devocional
// TODO: Probar que el textarea no adicione espacioes como suele hacer
// TODO: Limpiar todo cuando acabe de probar