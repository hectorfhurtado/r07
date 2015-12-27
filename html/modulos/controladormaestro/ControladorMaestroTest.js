/**
 * @author Héctor Fernando Hurtado
 */

/* global console, R07 */

R07.Pruebas_DEBUG = R07.Pruebas_DEBUG.then( function()
{
	
	// antes de empezar, limpiamos la consola
	console.clear();
	
	var $body = document.querySelector( 'body' );
	
	var tempLocalStorage = localStorage.getItem( 'ultimoCapitulo' );
	localStorage.setItem( 'ultimoCapitulo', null );
	
	console.assert( R07.ControladorMaestro, 'Miramos que exista el controlador maestro para comenzar a probar la app' );
	
	var fechaReferencia = new Date();
	
	return R07.ControladorMaestro._mostrarElementosIniciales().then( function()
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
		
		console.assert( !!$resumenDevocional,                                 'Miramos que exista el elemento en el DOM' );
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
		
		R07.DEVOCIONAL =
		{
			libro     : 'Deuteronomio',
			capitulo  : 10,
			horainicio: null,
			horafin   : null,
		};
		
		return R07.ControladorMaestro._cambiaMensajePrincipal();
	}).then( function ()
	{
		var $main = document.getElementById( 'ResumenDevocional' );
		
		console.assert( $main.childNodes.length > 1, 'Verificamos el número de nodos hijos que tiene', $main.childNodes.length );
		console.assert( $main.querySelector( '#ResumenDevocionalLibro' ).textContent == 'Deuteronomio', 'Verificamos el nombre del libro' );
		console.assert( $main.querySelector( '#ResumenDevocionalCapitulo' ).textContent == '10', 'Verificamos el número del capítulo' );
		
		/*************************************************************
		* Probamos el click en el cuadro principal de la aplicación
		* **********************************************************/
		function salePrincipalHandler()
		{
			console.assert( true, 'Verificamos que si llama el custom event para salir de la vista principal' );
			$body.removeEventListener( 'salePrincipal', salePrincipalHandler, true );
		}
		
		$body.addEventListener( 'salePrincipal', salePrincipalHandler, true );
		
		const e =
		{
			target: $main
		};
		
		return R07.ControladorMaestro._clickMain.bind( R07.ControladorMaestro, e )();
	}).then( function ()
	{
		console.assert( $body.classList.contains( 'salePrincipal' ), 'Verificamos que estemos listos para hacer el cambio de vista' );
	}).then( function ()
	{
		/***********************
		* Realizamos limpieza
		* ********************/
		if (tempLocalStorage ) localStorage.setItem( 'ultimoCapitulo', tempLocalStorage );
		
		console.info( 'Termina pruebas de ControladorMaestro.js' );
	});
})
.catch( error => console.log( error ));
