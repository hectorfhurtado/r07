/**
 * @author nando
 */

/* global console, R07 */

( function() {
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
		
		console.assert( $resumenDevocional, 'Miramos que exista el elemento en el DOM' )
		console.assert( $resumenDevocional.textContent === textoDevocional, 'Mira que sí haya cambiado el texto del devocional' )
		
		// Probamos _muestraFecha
		console.assert( document.getElementById( 'fechaFooter' ).textContent.trim() === '', 'Mira que el elemento con la fecha esté inicialmente está vacío' )
		return R07.ControladorMaestro._muestraFecha( fechaReferencia )
	}).then( function() {
		
		console.assert( R07.UtilidadFecha, 'Mira que haya cargado el módulo sin problemas' )
		console.assert( document.getElementById( 'fechaFooter' ).textContent !== '', 'Mira que el elemento con la fecha contenga algo porque inicialmente está vacío' )
		
		// TODO(Nando): seguir creando las pruebas
	})
	
})();