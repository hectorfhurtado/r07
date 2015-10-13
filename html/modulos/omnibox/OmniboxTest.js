/**
 * @author    Héctor Fernando Hurtadp
 */

/* global R07, console */

( function() {
    
	// Comenzamos probando los handlers de cada botón
	var $omnibox = document.getElementById( 'OmniboxCronometroBtn' )
	
	console.assert( $omnibox, 'Verificamos que existe el botón Cronómetr' )
	
	// Cronómetro MouseDown handler
	R07.Omnibox._mousedownCronometroHandler.bind( $omnibox )()
	
	console.assert( $omnibox.classList.contains( 'oprimido' ), 'Verificamos que esté puesta la clase para comenzar la animación del cronómetro' )
	
	// Cronómetr Click handler
	console.assert( R07.Omnibox.devocional.horainicio === null, 'Probamos que al inicio no tengamos nada en la hora inicial' )
	console.assert( $omnibox.classList.contains( 'cronometroGrande'), 'Verificamos que al comienzo el botón del cronómetro sea grande' )
	
	R07.Omnibox._clickCronometroHandler.bind( $omnibox )().then( function() {
		
		console.assert( $omnibox.classList.contains( 'cronometroGrande' ) === false, 'Miramos que haya quitado la clase que muestra grande el botón' );
		console.assert( $omnibox.classList.contains( 'oprimido' ) === false,         'Miramos que ya no se vea oprimido el botón del cronómetro' );
		console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ),        'Miramos que aparezca la clase que hace mover la manecilla del cronómetr');
		
		// TODO( Nando ): Continuar probando lo que aparece en horainicio
	})
	
	
	
//	var $horas = document.getElementById( 'OmniboxHoras' )
//	
//	console.assert( $horas, 'Miramos que exista OmniboxHoras que es donde escribimos la hora de inicio y la de fin' )
//	console.assert( $horas.children[ 1 ])
})();