/**
 * @author nando
 */

/* global console, R07 */

( function() {
	
	// antes de empezar, limpiamos la consola
	console.clear()
	
    console.assert( true, 'DEBUG Controlador Maestro' );
	
	console.assert( R07.ControladorMaestro, 'Miramos que exista el controlador maestro para comenzar a probar la app' )
	
	var fechaReferencia = new Date()
	
	R07.ControladorMaestro._mostrarElementosIniciales().then( function() {
		console.assert( R07.Elementos, 'Probamos que al cargar los elementos iniciales, traiga el componente Elementos, que viene a ser importante para el resto de la app' )
		
		// Probamos el siguiente método: _cambiaMensajePrincipal
		return R07.ControladorMaestro._cambiaMensajePrincipal()
	}).then( function() {
		
		var $resumenDevocional = document.getElementById( 'ResumenDevocional' )
		var textoDevocional    = 'Toca el reloj para comenzar'
		
		console.assert( $resumenDevocional,                                 'Miramos que exista el elemento en el DOM' )
		console.assert( $resumenDevocional.textContent === textoDevocional, 'Mira que sí haya cambiado el texto del devocional' )
		
		// Probamos _muestraFecha
		console.assert( document.getElementById( 'fechaFooter' ).textContent.trim() === '', 'Mira que el elemento con la fecha esté inicialmente está vacío' )
		return R07.ControladorMaestro._muestraFecha( fechaReferencia )
	}).then( function() {
		
		var $footer = document.getElementById( 'fechaFooter' ).textContent
		
		console.assert( R07.UtilidadFecha, 'Mira que haya cargado el módulo sin problemas' )
		console.assert( $footer !== '',    'Mira que el elemento con la fecha contenga algo porque inicialmente está vacío' )
		
		// Probamos _iniciarBd
		return R07.ControladorMaestro._iniciarBd()
	}).then( function() {
		
		console.assert( R07.Db,         'Probamos que haya cargado el módulo' )
		console.assert( R07.DEVOCIONAL, 'Probamos que la BD haya traído información para el devocional' )
		
		// Probamos _iniciaOmnibox
		return R07.ControladorMaestro._iniciaOmnibox( R07.DEVOCIONAL )	// Pasamos el devocional que recién llegó de la BD
	}).then( function( estadoOmnibox ) {
		
		console.assert( R07.Omnibox,   'Verificamos que haya cargado el módulo' )
		console.assert( estadoOmnibox === false, 'Verificamos que pasamos por toda la inicialización del Omnibox' )
		
		// TODO( Nando ): continuar con los eventos del Omnibox para pasar al siguiente d econtrolador Maestro
	})
	
})();