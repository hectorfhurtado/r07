/**
 * @author nando
 */

/* global console, R07 */

( function()
{
	// antes de empezar, limpiamos la consola
	console.clear();
	
	var $body = document.querySelector( 'body' );
	
	var tempLocalStorage = localStorage.getItem( 'ultimoCapitulo' );
	localStorage.setItem( 'ultimoCapitulo', null );
	
	console.assert( R07.ControladorMaestro, 'Miramos que exista el controlador maestro para comenzar a probar la app' );
	
	var fechaReferencia = new Date();
	
	R07.ControladorMaestro._mostrarElementosIniciales().then( function()
	{
		console.assert( R07.Elementos, 'Probamos que al cargar los elementos iniciales, traiga el componente Elementos, que viene a ser importante para el resto de la app' );
		
		/*********************************************************
		 * Probamos el siguiente método: _cambiaMensajePrincipal
		 * ******************************************************/
		return R07.ControladorMaestro._cambiaMensajePrincipal();
	}).then( function()
	{
		var $resumenDevocional = document.getElementById( 'ResumenDevocional' );
		var textoDevocional    = 'Toca el reloj para comenzar';
		
		console.assert( $resumenDevocional,                                 'Miramos que exista el elemento en el DOM' );
		console.assert( $resumenDevocional.textContent === textoDevocional, 'Mira que sí haya cambiado el texto del devocional' );
		
		/**************************
		 * Probamos _muestraFecha
		 * ***********************/
		console.assert( document.getElementById( 'fechaFooter' ).textContent.trim() === '', 'Mira que el elemento con la fecha esté inicialmente está vacío' );
		
		return R07.ControladorMaestro._muestraFecha( fechaReferencia );
	}).then( function()
	{
		var $footer = document.getElementById( 'fechaFooter' ).textContent;
		
		console.assert( R07.UtilidadFecha, 'Mira que haya cargado el módulo sin problemas' );
		console.assert( $footer !== '',    'Mira que el elemento con la fecha contenga algo porque inicialmente está vacío' );
		
		/***********************
		 * Probamos _iniciarBd
		 * ********************/
		return R07.ControladorMaestro._iniciarBd();
	}).then( function()
	{
		console.assert( R07.Db,         'Probamos que haya cargado el módulo' );
		console.assert( R07.DEVOCIONAL, 'Probamos que la BD haya traído información para el devocional' );
		
		/***************************
		 * Probamos _iniciaOmnibox
		 * ************************/
		return R07.ControladorMaestro._iniciaOmnibox( R07.DEVOCIONAL );	// Pasamos el devocional que recién llegó de la BD
	}).then( function( estadoOmnibox )
	{
		console.assert( R07.Omnibox,            'Verificamos que haya cargado el módulo' );
		console.assert( estadoOmnibox === true, 'Verificamos que pasamos por toda la inicialización del Omnibox' );
		
		/*************************
		 * Probamos _cargaEditor
		 * **********************/
		return R07.ControladorMaestro._cargaEditor();
	}).then( function()
	{
		console.assert( R07.Editor, 'Verificamos que haya cargado el Editor' );
	
		/***********************************************************************
		 * Probamos _cambiaMensajePrincipal tomando los datos del localStorage
		 * ********************************************************************/
		var $main = document.getElementById( 'ResumenDevocional' );
		
		console.assert( $main.childNodes.length == 1, 'Verificamos el número de nodos hijos que tiene', $main.childNodes.length );
		
		localStorage.setItem( 'ultimoCapitulo', JSON.stringify({ libro: 'Deuteronomio', capitulo: '10' }));
		
		return R07.ControladorMaestro._cambiaMensajePrincipal();
	}).then( function ()
	{
		var $main = document.getElementById( 'ResumenDevocional' );
		
		console.assert( $main.childNodes.length > 1, 'Verificamos el número de nodos hijos que tiene', $main.childNodes.length );
		console.assert( $main.querySelector( '#ResumenDevocionalLibro' ).textContent == 'Deuteronomio', 'Verificamos el nombre del libr' );
		console.assert( $main.querySelector( '#ResumenDevocionalCapitulo' ).textContent == '10', 'Verificamos el número del capítulo' );
		
		/*************************************************************
		 * Probamos el click en el cuadro principal de la aplicación
		 * **********************************************************/
		function salePrincipalHandler()
		{
			console.assert( this.classList.contains( 'salePrincipal' ), 'Verificamos que el body contiene la clase para quitar el menú principal' );
			$body.removeEventListener( 'salePrincipal', salePrincipalHandler, true );
		}
		
		$body.addEventListener( 'salePrincipal', salePrincipalHandler, true );
		
		R07.ControladorMaestro._clickMain();
	}).then( function ()
	{
		/***********************
		 * Realizamos limpieza
		 * ********************/
		if (tempLocalStorage ) localStorage.setItem( 'ultimoCapitulo', tempLocalStorage );
		
		console.info( 'Termina pruebas de ControladorMaestro.js' );
	});
})();

// TODO: Probar interacción con el Editor
// TODO: Verificar que si existen datos en el localStorage, muestre al usuario el libro y capítulo que están guardados