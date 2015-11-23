/**
 * @author    Héctor Fernando Hurtadp
 */

/* global R07, console */

( function()
{
	R07.Pruebas_DEBUG.then( function()
	{
		
		var horaRegExp = /\d{2}:\d{2}/;
		
		// Comenzamos trayendo elementos del DOM
		var $omnibox       = document.getElementById( 'OmniboxCronometroBtn' );
		var $flechaDerecha = document.getElementById( 'OmniboxDerBtn' );
		var $inputBusqueda = document.getElementById( 'OmniboxBusqueda' );
		
		function sleep( tiempo )
		{	
			return new Promise( function( resolve )
			{
				setTimeout( () => resolve(), tiempo );
			});
		}
		
		console.assert( $omnibox, 'Verificamos que existe el botón Cronómetro' );
		
		/********************************
		* Omnibox MouseDown handler
		* *****************************/
		R07.Omnibox._mousedownCronometroHandler.bind( $omnibox )();
		
		console.assert( $omnibox.classList.contains( 'oprimido' ), 'Verificamos que esté puesta la clase para comenzar la animación del cronómetro' );
		
		// Probamos que podamos oír el custom Event al momento de hacer click sobre el cronómero
		var $body = document.querySelector( 'body' );
		var contadorActualizaDevocional = 0;
	
		$body.addEventListener( 'actualizaDevocional', actualizaDevocionalHandler, true );
	
		function actualizaDevocionalHandler( e )
		{
			contadorActualizaDevocional++;
			
			console.assert( contadorActualizaDevocional <= 2, 'Este contador ocurre dos veces: Cada vez que oprimimos el cronómetro para la hora de inicio y para la final' );
			console.assert( e.detail, 'Miramos que pasamos información junto con el evento para ser actualizado en la BD' );
	
			if ( contadorActualizaDevocional === 2 )
			{
				$body.removeEventListener( 'actualizaDevocional', actualizaDevocionalHandler, true );
			}
		}
		
		/*************************
		* Omnibox Click handler
		* **********************/
		var $horas = document.getElementById( 'OmniboxHoras' );
		
		console.assert( R07.Omnibox.devocional.horainicio === null,       'Probamos que al inicio no tengamos nada en la hora inicial' );
		console.assert( $omnibox.classList.contains( 'cronometroGrande'), 'Verificamos que al comienzo el botón del cronómetro sea grande' );
		console.assert( $horas.classList.contains( 'invisible' ),         'Miramos que no se esté mostrando la hora aún cuando hayamos oprimido "mousedown" el cronómetor' );
		
		return R07.Omnibox._clickCronometroHandler.bind( $omnibox )().then( function()
		{
			console.assert( $omnibox.classList.contains( 'cronometroGrande' ) === false, 'Miramos que haya quitado la clase que muestra grande el botón' );
			console.assert( $omnibox.classList.contains( 'oprimido' ) === false,         'Miramos que ya no se vea oprimido el botón del cronómetro' );
			console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ),        'Miramos que aparezca la clase que hace mover la manecilla del cronómetr');
			
			console.assert( horaRegExp.test( R07.Omnibox.devocional.horainicio ), 'Miramos que si haya escrito la hora de inicio');
			
			/*************************************************************************
			* Volvemos a oprimir el botón del cronómetro, esta sería la segunda vez
			* **********************************************************************/
			return sleep( 700 );
		}).then( function()
		{
			return R07.Omnibox._clickCronometroHandler.bind( $omnibox )();
		}).then( function()
		{
			console.assert( $omnibox.classList.contains( 'cronometroGrande' ) === false,    'Miramos que haya quitado la clase que muestra grande el botón' );
			console.assert( $omnibox.classList.contains( 'oprimido' ) === false,            'Miramos que ya no se vea oprimido el botón del cronómetro' );
			console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ) === false, 'Miramos que ya no esté corriendo la manecilla del cronómetro' );
			console.assert( $omnibox.classList.contains( 'busqueda'),                       'Miramos que esté visible el ícono de búsqueda' );
			
			console.assert( horaRegExp.test( R07.Omnibox.devocional.horafin ), 'Miramos que si haya escrito la hora de fin');
			
			console.assert( $horas,                                              'Miramos que exista OmniboxHoras que es donde escribimos la hora de inicio y la de fin' );
			console.assert( horaRegExp.test( $horas.children[ 0 ].textContent ), 'Miramos que haya escrito la hora de inicio en las pruebas anteriores' );
			console.assert( horaRegExp.test( $horas.children[ 1 ].textContent ), 'Miramos que haya escrito la hora de fin en las pruebas anteriores' );
			
			/****************************************************************************
			* Oprimimios nuevamente el botón del cronómetro, sería esta la tercera vez
			***************************************************************************/
			console.assert( $inputBusqueda.classList.contains( 'inexistente' ), 'Verificamos que no se observa el input de búsqueda' );
			
			return sleep( 700 );
		}).then( function()
		{
			return R07.Omnibox._clickCronometroHandler.bind( $omnibox )();
		}).then( function()
		{
			console.assert( $omnibox.classList.contains( 'busqueda' ), 'Verificamos que se ve el botón de búsqueda' );
			console.assert( $omnibox.classList.contains( 'buscando' ), 'Verificamos que está invisible el botón de búsqueda' );
			
			console.assert( $inputBusqueda.classList.contains( 'inexistente' ) === false, 'Verificamos que se observa el input de búsqueda' );
			console.assert( $inputBusqueda.classList.contains( 'colapsado' ) === false,   'Verificamos que el input ya no está colapsado' );
			
			/***************************
			* Probamos Omnibox _buscarFechaHandler con un valor errado de fecha
			* **************************/
			$inputBusqueda.value = '2015/10/22';
			
			return R07.Omnibox._buscarFechaHandler.bind( $inputBusqueda )();
		}).then( function()
		{
			// Nada debe cambiar porque escribió una fecha que no es
			console.assert( $omnibox.classList.contains( 'busqueda' ), 'Verificamos que se ve el botón de búsqueda' );
			console.assert( $omnibox.classList.contains( 'buscando' ), 'Verificamos que está invisible el botón de búsqueda' );
			
			console.assert( $inputBusqueda.classList.contains( 'inexistente' ) === false, 'Verificamos que se observa el input de búsqueda' );
			console.assert( $inputBusqueda.classList.contains( 'colapsado' ) === false,   'Verificamos que el input ya no está colapsado' );
			
			console.assert( $inputBusqueda.value === '', 'Verificamos que no tomamos ningún valor sino que reseteamos el input para que el usuario vuelva a intentar escribir una fecha' );
			console.assert( $inputBusqueda.classList.contains( 'error' ), 'Verificamos que muestra al usuario hubo un error' );
			
			return sleep( 700 );
		}).then( function()
		{
			/*****************************************************************************************************************************************
			* Probamos que al escribir una fecha que es en el buscador de fecha, envía un evento para que pueda ser buscada la información en la BD
			* **************************************************************************************************************************************/
			var EVENTO = 'traeFecha';
			var fecha  = new Date( 2015, 10, 22 );
			
			$inputBusqueda.value = '2015-10-22';
			
			$body.addEventListener( EVENTO, traeFechaHandler, true );
			
			function traeFechaHandler( e )
			{
				console.assert( e.detail.getTime() === fecha.getTime(), 'Verificamos que envíe el evento con la fecha a buscar' );
				
				$body.removeEventListener( EVENTO, traeFechaHandler, true );
			}
			
			return R07.Omnibox._buscarFechaHandler.bind( $inputBusqueda )();
		}).then( function()
		{
			console.assert( $inputBusqueda.value === '', 'Verificamos que luego de enviar el evento, limpia el Input para una nueva búsqueda' );
			
			/*************************************************
			* Probamos el _transitionEndHandler del Omnibox
			* **********************************************/
			return R07.Omnibox._transitionEndHandler.bind( $omnibox )();
		}).then( function()
		{
			console.assert( $horas.classList.contains( 'invisible' ) === false,          'Miramos que se esté mostrando la hora' );
		}).then( function()
		{
			/****************************************************************************
			* Probamos el handler para la flecha izquierda _clickBotonIzquierdoHandler
			* *************************************************************************/
			var EVENTO = 'traeFechaAnterior';
			
			$body.addEventListener( EVENTO, traerFechaAnteriorHandler, true );
			
			function traerFechaAnteriorHandler()
			{
				console.assert( true, 'Verificamos que se dispara el Evento al oprimir la flecha izquierda del omnibox' );
				
				$body.removeEventListener( EVENTO, traerFechaAnteriorHandler, true );
			}
			
			R07.Omnibox._clickBotonIzquierdoHandler.bind( document.getElementById( 'OmniboxIzqBtn' ))();
		}).then( function()
		{
			/**********************************************
			* Probamos el handler para la flecha derecha
			* *******************************************/
			console.assert( $flechaDerecha.classList.contains( 'invisible' ), 'Probamos que al comienzo la flecha derecha no se ve porque no hay devocional de un día que no ha llegado' );
			
			var EVENTO = 'traeFechaSiguiente';
			
			$body.addEventListener( EVENTO, traerFechaSiguienteHandler, true );
			
			function traerFechaSiguienteHandler()
			{
				console.assert( true, 'Verificamos que se dispara el Evento al oprimir la flecha derecha del omnibox' );
				
				$body.removeEventListener( EVENTO, traerFechaSiguienteHandler, true );
			}
			
			R07.Omnibox._clickBotonDerechoHandler.bind( document.getElementById( 'OmniboxIzqBtn' ))();
		}).then( function()
		{
			/***********************************************
			* Probamos el método debeMostrarFlechaDerecha
			* ********************************************/
			var ayer = new Date( new Date().getTime() - ( 1000 * 60 * 60 * 24 ));
			
			return R07.Omnibox.debeMostrarFlechaDerecha( ayer );
		}).then( function()
		{
			console.assert( $flechaDerecha.classList.contains( 'invisible' ) === false, 'Probamos que al pasar una fecha anterior al hoy sí se debe ver la flecha derecha' );
			
			return R07.Omnibox.debeMostrarFlechaDerecha( new Date() );
		}).then( function()
		{
			console.assert( $flechaDerecha.classList.contains( 'invisible' ), 'Probamos que al pasar la fecha de hoy no se debe ver la flecha derecha' );
		}).then( function()
		{
			/********************************************************************
			* Probamos actualiza cuando se le pasa un devocional vacío
			* *****************************************************************/
			
			return sleep( 700 );
		}).then( function()
		{
			var devocionalEjemplo =
			{
				fecha     : new Date(),
				horainicio: null,
				horafin   : null,
				devocional: '',
				texto     : '',
				capitulo  : '',
				libro     : ''
			};
			
			return R07.Omnibox.actualiza( devocionalEjemplo );
		}).then( function()
		{
			console.assert( $omnibox.classList.contains( 'cronometroGrande' ),              'Cuando no hay datos, debe verse grande el cronómetro' );
			console.assert( $omnibox.classList.contains( 'oprimido' ) === false,            'Cuando no hay datos, no debe verse como oprimido' );
			console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ) === false, 'Cuando no hay datos, no está corriendo el cronometro' );
			console.assert( $omnibox.classList.contains( 'busqueda') === false,             'Cuando no hay datos, no se debe ver el botón de búsqueda' );
			console.assert( $omnibox.classList.contains( 'buscando' ) === false, 			'Esta clase no está cuando no hay datos' );
			
			console.assert( /--/.test( $horas.children[ 0 ].textContent ), 'Cuando no hay datos, no hay hora de inicio' );
			console.assert( /--/.test( $horas.children[ 1 ].textContent ), 'Cuando no hay datos, no hay hora de fin' );
			
			console.assert( $inputBusqueda.classList.contains( 'inexistente' ), 'Cuando no hay datos, no se debe ver el input de búsqueda' );
			console.assert( $inputBusqueda.classList.contains( 'colapsado' ),   'Cuando no hay datos, el input de búsqueda debe estar colapsado' );
			console.assert( $inputBusqueda.classList.contains( 'error' ) === false, 'No debe estar esta clase en ningún momento, solo cuando se comete un error al escribir' );
			
			console.assert( $flechaDerecha.classList.contains( 'invisible' ), 'Probamos que al pasar una fecha de hoy no se debe ver la flecha derecha' );
			
			/*******************************************************************
			* Probamos actualiza cuando devocinoal tienen solo hora de inicio
			* ****************************************************************/
			return sleep( 700 );
		}).then( function()
		{
			var devocionalEjemplo =
			{
				fecha     : new Date( 2015, 10, 23 ),
				horainicio: '04:00',
				horafin   : null,
				devocional: '',
				texto     : '',
				capitulo  : '',
				libro     : ''
			};
			
			return R07.Omnibox.actualiza( devocionalEjemplo );
		}).then( function()
		{
			console.assert( $omnibox.classList.contains( 'cronometroGrande' ) === false,    'Cuando solo está la hora de inicio, no debe verse grande el cronómetro' );
			console.assert( $omnibox.classList.contains( 'oprimido' ) === false,            'Cuando solo está la hora de inicio, no debe verse como oprimido' );
			console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ),           'Cuando solo está la hora de inicio, está corriendo el cronometro' );
			console.assert( $omnibox.classList.contains( 'busqueda') === false,             'Cuando solo está la hora de inicio, no se debe ver el botón de búsqueda' );
			console.assert( $omnibox.classList.contains( 'buscando' ) === false, 			'Esta clase no está cuando solo está la hora de inicio' );
			
			console.assert( /04:00/.test( $horas.children[ 0 ].textContent ), 'Cuando solo está la hora de inicio, debe mostrarla' );
			console.assert( /--/.test( $horas.children[ 1 ].textContent ),    'Cuando solo está la hora de inicio, no hay hora de fin' );
			
			console.assert( $inputBusqueda.classList.contains( 'inexistente' ), 'Cuando solo está la hora de inicio, no se debe ver el input de búsqueda' );
			console.assert( $inputBusqueda.classList.contains( 'colapsado' ),   'Cuando solo está la hora de inicio, el input de búsqueda debe estar colapsado' );
			console.assert( $inputBusqueda.classList.contains( 'error' ) === false, 'No debe estar esta clase en ningún momento, solo cuando se comete un error al escribir' );
			
			console.assert( $flechaDerecha.classList.contains( 'invisible' ) === false, 'Probamos que al pasar una fecha anterior al hoy sí se debe ver la flecha derecha' );
			
			/*************************************************************************
			* Probamos actualiza cuando viene información de hora inicio y hora fin
			* **********************************************************************/
			return sleep( 700 );
		}).then( function()
		{
			var devocionalEjemplo =
			{
				fecha     : new Date(),
				horainicio: '04:00',
				horafin   : '05:00',
				devocional: '',
				texto     : '',
				capitulo  : '',
				libro     : ''
			};
			
			return R07.Omnibox.actualiza( devocionalEjemplo );
		}).then( function()
		{
			console.assert( $omnibox.classList.contains( 'cronometroGrande' ) === false,    'Cuando tiene información de inicio y fin, no debe verse grande el cronómetro' );
			console.assert( $omnibox.classList.contains( 'oprimido' ) === false,            'Cuando tiene información de inicio y fin, no debe verse como oprimido' );
			console.assert( $omnibox.classList.contains( 'cronometroCorriendo' ) === false, 'Cuando tiene información de inicio y fin, no está corriendo el cronometro' );
			console.assert( $omnibox.classList.contains( 'busqueda'),                       'Cuando tiene información de inicio y fin, se debe ver el botón de búsqueda' );
			console.assert( $omnibox.classList.contains( 'buscando' ) === false, 			'Esta clase no está cuando tiene información de inicio y fin' );
			
			console.assert( /04:00/.test( $horas.children[ 0 ].textContent ), 'Cuando tiene información de inicio y fin, debe mostrarla' );
			console.assert( /05:00/.test( $horas.children[ 1 ].textContent ), 'Cuando tiene información de inicio y fin, debe mostrar la hora de fin' );
			
			console.assert( $inputBusqueda.classList.contains( 'inexistente' ),     'Cuando tiene información de inicio y fin, no se debe ver el input de búsqueda' );
			console.assert( $inputBusqueda.classList.contains( 'colapsado' ),       'Cuando tiene información de inicio y fin, el input de búsqueda debe estar colapsado' );
			console.assert( $inputBusqueda.classList.contains( 'error' ) === false, 'No debe estar esta clase en ningún momento, solo cuando se comete un error al escribir' );
			
			console.assert( $flechaDerecha.classList.contains( 'invisible' ), 'Probamos que al pasar una fecha de hoy no sí se debe ver la flecha derecha' );
		}).then( function ()
		{
			console.info( 'Termina pruebas Omnibox.js' );
		});
	});
})();