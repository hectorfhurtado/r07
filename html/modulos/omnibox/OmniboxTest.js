/**
 * @author    Héctor Fernando Hurtadp
 */

/* global R07, console */

( function() {
    
	var horaRegExp = /\d{2}:\d{2}/
	
	// Comenzamos probando los handlers de cada botón
	var $omnibox       = document.getElementById( 'OmniboxCronometroBtn' )
	var $flechaDerecha = document.getElementById( 'OmniboxDerBtn' )
	var $inputBusqueda = document.getElementById( 'OmniboxBusqueda' )
	
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
		console.assert( $omnibox.classList.contains( 'busqueda'), 'Miramos que esté visible el ícono de búsqueda' )
		
		console.assert( horaRegExp.test( R07.Omnibox.devocional.horafin ), 'Miramos que si haya escrito la hora de fin')
		
	// TODO: Aquí debemos probar que al hacer click en la lupa de búsqueda aparezca el input de la fecha
		// Oprimimios nuevamente el botón del cronómetro, sería esta la tercera vez
		console.assert( $inputBusqueda.classList.contains( 'inexistente' ), 'Verificamos que no se observa el input de búsqueda' )
		
		console.log( $omnibox.classList.toString() )
		
		return R07.Omnibox._clickCronometroHandler.bind( $omnibox )
		
	}).then( function() {
		
		console.log( $omnibox.classList.toString() )
		
		console.assert( $omnibox.classList.contains( 'busqueda' ), 'Verificamos que se ve el botón de búsqueda' )
		console.assert( $omnibox.classList.contains( 'buscando' ), 'Verificamos que está invisible el botón de búsqueda' )
		console.assert( $inputBusqueda.classList.contains( 'inexistente' ) === false, 'Verificamos que se observa el input de búsqueda' )
		console.assert( $inputBusqueda.classList.contains( 'colapsado' ) === false, 'Verificamos que el input ya no está colapsado' )
		
		
		
	}).then( function() {
		

		console.assert( $horas,                                              'Miramos que exista OmniboxHoras que es donde escribimos la hora de inicio y la de fin' )
		console.assert( horaRegExp.test( $horas.children[ 0 ].textContent ), 'Miramos que haya escrito la hora de inicio en las pruebas anteriores' )
		console.assert( horaRegExp.test( $horas.children[ 1 ].textContent ), 'Miramos que haya escrito la hora de fin en las pruebas anteriores' )
		
		// Probamos el _transitionEndHandler
		return R07.Omnibox._transitionEndHandler.bind( $omnibox )()
		
	}).then( function() {
		
		console.assert( $horas.classList.contains( 'invisible' ) === false,          'Miramos que se esté mostrando la hora' )
		
	}).then( function() {
		
		// Probamos el handler para la flecha izquierda _clickBotonIzquierdoHandler
		var EVENTO = 'traeFechaAnterior'
		
		$body.addEventListener( EVENTO, traerFechaAnteriorHandler, true )
		
		function traerFechaAnteriorHandler() {
			
			console.assert( true, 'Verificamos que se dispara el Evento al oprimir la flecha izquierda del omnibox' )
			
			$body.removeEventListener( EVENTO, traerFechaAnteriorHandler, true )
		}
		
		R07.Omnibox._clickBotonIzquierdoHandler.bind( document.getElementById( 'OmniboxIzqBtn' ))()
		
	}).then( function() {
		
		// Probamos el handler para la flecha derecha
		console.assert( $flechaDerecha.classList.contains( 'invisible' ), 'Probamos que al comienzo la flecha derecha no se ve porque no hay devocional de un día que no ha llegado' )
		
		var EVENTO = 'traeFechaSiguiente'
		
		$body.addEventListener( EVENTO, traerFechaSiguienteHandler, true )
		
		function traerFechaSiguienteHandler() {
			
			console.assert( true, 'Verificamos que se dispara el Evento al oprimir la flecha derecha del omnibox' )
			
			$body.removeEventListener( EVENTO, traerFechaSiguienteHandler, true )
		}
		
		R07.Omnibox._clickBotonDerechoHandler.bind( document.getElementById( 'OmniboxIzqBtn' ))()
		
	}).then( function() {
		
		// Probamos el método debeMostrarFlechaDerecha
		var ayer = new Date( new Date().getTime() - ( 1000 * 60 * 60 * 24 ))
		
		return R07.Omnibox.debeMostrarFlechaDerecha( ayer )
	}).then( function() {
		
		console.assert( $flechaDerecha.classList.contains( 'invisible' ) === false, 'Probamos que al pasar una fecha anterior al hoy sí se debe ver la flecha derecha' )
		
		return R07.Omnibox.debeMostrarFlechaDerecha( new Date() )
	}).then( function() {
		
		console.assert( $flechaDerecha.classList.contains( 'invisible' ), 'Probamos que al pasar la fecha de hoy no se debe ver la flecha derecha' )
	})
	
	
	// TODO: Aquí debemos probar que al cambiar la fecha en el input, traiga los datos de esa fecha
	// TODO: Probar que al traer los datos de la fecha, quede solo la lupa si hay datos de hora inicio y fin
	// TODO: Probar que al cambiar el devocional se actualice todo el UI: Probar cuando no viene nada
	// TODO: Probar que al cambiar el devocional se actualice todo el UI: Probar cuando sólo viene la fecha de inicio
	// TODO: Probar que al cambiar el devocional se actualice todo el UI: Probar cuando sólo viene la fecha de inicio y fin
	// TODO: Probar que al cambiar el devocional se actualice todo el UI: Probar cuando viene la fecha de un día anterior
	// TODO: Probar que al cambiar el devocional se actualice todo el UI: Probar cuando no viene nada nuevamente para ver el cambio con la flecha derecha del omnibox
	
	
})();