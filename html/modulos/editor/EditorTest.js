
/* global R07 */

( function() {

	/*********************
	 * Probamos _traeDOM
	 * ******************/
	R07.Editor._traeDOM().then( function() {
		
		console.assert( !!document.getElementById( 'Editor'), 'Verificamos que existe el módulo' )
		
		/********************************
		* Probamos _arrancaInputLibros
		* *****************************/
		return R07.Editor._arrancaInputLibros() 
	}).then( function() {
		
		console.assert( document.getElementById( 'EditorLibro' ).value === 'Génesis', 'Verificamos que cuando no hay devocional arranca con Génesis' )
		
		return R07.Editor._arrancaInputLibros() 
	}).then( function() {
		
		// Para la prueba
		R07.Editor.devocional = {
			libro: ''
		}
		console.assert( document.getElementById( 'EditorLibro' ).value === 'Génesis', 'Verificamos que cuando el devocional no tiene información de libro, arranca con Génesis' )
		
		R07.Editor.devocional = null
	})
})()


// TODO: Probar que inicia con el capítulo uno
// TODO: Probar que guarda el libro y el capítulo
// TODO: Probar que lee el libro y el capítulo guardado para continuar con el siguiente libro
// TODO: Probar que al temrinar Apocalipsis vuelve a comenzar con Génesis
// TODO: Probar que arranca con el libro que escoja el usuario 
// TODO: Probar que envía el evento para actualizar el devocional al hacer click en Guardar
// TODO: Probar que descarta los cambios al hacer click en Cancelar
// TODO: Probar las transiciones entre la vista principal y el Devocional
// TODO: Probar que el textarea no adicione espacioes como suele hacer