
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
		console.assert( info.capitulo === '2', 'Guardó el número del capítulo correctamente' )

// TODO: Probar que lee el libro y el capítulo guardado para continuar con el siguiente libro
	})
})()


// TODO: Probar que al terminar Apocalipsis vuelve a comenzar con Génesis
// TODO: Probar que arranca con el libro que escoja el usuario 
// TODO: Probar que envía el evento para actualizar el devocional al hacer click en Guardar
// TODO: Probar que descarta los cambios al hacer click en Cancelar
// TODO: Probar las transiciones entre la vista principal y el Devocional
// TODO: Probar que el textarea no adicione espacioes como suele hacer
// TODO: Limpiar todo cuando acabe de probar