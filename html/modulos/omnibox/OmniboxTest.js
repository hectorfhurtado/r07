/**
 * @author    Héctor Fernando Hurtadp
 */

/* global R07, console */

( function() {
    
	var horaRegExp = /\d{2}:\d{2}/
	// Comenzamos probando los handlers de cada botón
	var $omnibox = document.getElementById( 'OmniboxCronometroBtn' )
	
	console.assert( $omnibox, 'Verificamos que existe el botón Cronómetr' )
	
	// Cronómetro MouseDown handler
	R07.Omnibox._mousedownCronometroHandler.bind( $omnibox )()
	
	console.assert( $omnibox.classList.contains( 'oprimido' ), 'Verificamos que esté puesta la clase para comenzar la animación del cronómetro' )
	
	// Probamos que podamos oír el custom Event al momento de hacer click sobre el cronómero
	var $body = document.querySelector( 'body' )
	var contadorActualizaDevocional = 0

	$body.addEventListener( 'actualizaDevocional', actualizaDevocionalHandler, true )

	function actualizaDevocionalHandler( e ) {

		contadorActualizaDevocional++
		
		console.assert( contadorActualizaDevocional <= 2, 'Este contador ocurre dos veces: Cada vez que oprimimos el cronómetro para la hora de inicio y para la final' )
		console.assert( e.detail, 'Miramos que pasamos información junto con el evento para ser actualizado en la BD' )

		if ( contadorActualizaDevocional === 2 ) {
			$body.removeEventListener( 'actualizaDevocional', actualizaDevocionalHandler, true )
		}
	}
	
	// Cronómetro Click handler
	var $horas = document.getElementById( 'OmniboxHoras' )
	
	console.assert( R07.Omnibox.devocional.horainicio === null,       'Probamos que al inicio no tengamos nada en la hora inicial' )
	console.assert( $omnibox.classList.contains( 'cronometroGrande'), 'Verificamos que al comienzo el botón del cronómetro sea grande' )
	console.assert( $horas.classList.contains( 'invisible' ),         'Miramos que no se esté mostrando la hora aún cuando hayamos oprimido "mousedown" el cronómetor' )
	
	R07.Omnibox._clickCronometroHandler.bind( $omnibox )().then( function() {
		
		console.assert( $omnibox.classList.contains( 'cronometroGrande' ) === false, 'Miramos que haya quitado la clase que muestra grande el botón' );
		console.assert( $omnibox.classList.contains( 'oprimido' ) === false,         'Miramos que ya no se vea oprimido el botón del cronómetro' );
		console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ),        'Miramos que aparezca la clase que hace mover la manecilla del cronómetr');
		
		console.assert( horaRegExp.test( R07.Omnibox.devocional.horainicio ), 'Miramos que si haya escrito la hora de inicio')
		
		// Volvemos a oprimir el botón del cronómetro, esta sería la segunda vez
		return R07.Omnibox._clickCronometroHandler.bind( $omnibox )()
	}).then( function() {
		
		console.assert( $omnibox.classList.contains( 'cronometroGrande' ) === false, 'Miramos que haya quitado la clase que muestra grande el botón' );
		console.assert( $omnibox.classList.contains( 'oprimido' ) === false,         'Miramos que ya no se vea oprimido el botón del cronómetro' );
		console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ) === false, 'Miramos que ya no esté corriendo la manecilla del cronómetro' );
		
		console.assert( horaRegExp.test( R07.Omnibox.devocional.horafin ), 'Miramos que si haya escrito la hora de fin')
		
	}).then( function() {
		

		console.assert( $horas,                                              'Miramos que exista OmniboxHoras que es donde escribimos la hora de inicio y la de fin' )
		console.assert( horaRegExp.test( $horas.children[ 0 ].textContent ), 'Miramos que haya escrito la hora de inicio en las pruebas anteriores' )
		console.assert( horaRegExp.test( $horas.children[ 1 ].textContent ), 'Miramos que haya escrito la hora de fin en las pruebas anteriores' )
		
		// Probamos el _transitionEndHandler
		return R07.Omnibox._transitionEndHandler.bind( $omnibox )()
		
	}).then( function() {
		
		console.assert( $horas.classList.contains( 'invisible' ) === false,          'Miramos que se esté mostrando la hora' )
	})
	
	// TODO: Probar la flecha Derecha
	// TODO: Probar la flecha izquierda
	
	// TODO: Aquí debemos probar que desaparezca el cronómetro para que se muestre la lupa de búsqueda
	// TODO: Aquí debemos probar que al hacer click en la lupa de búsqueda aparezca el input de la fecha
	// TODO: Aquí debemos probar que al cambiar la fecha en el input, traiga los datos de esa fecha
	// TODO: Probar que al traer los datos de la fecha, quede solo la lupa si hay datos de hora inicio y fin
	
	
	
})();