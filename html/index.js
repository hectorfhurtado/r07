
/* global navigator */

( function( window )
{
	if ( 'serviceWorker' in navigator )
	{
		navigator.serviceWorker.register( '/sw.js' ).then( function responderConRegistro( registro )
		{
			console.log( 'Nos registramos con scope: ', registro.scope );
		}).catch( function muestraError( err )
		{
			console.log( 'Hubo error con el registro del service worker', err );
		});
	} 
	
	// Si corre esto es porque está habilitado JavaScript
	window.R07 = 
	{
		DEBUG: false,
		
		Cargador: 
		{
			/**
				* Devolvemos el módulo a través del callback. No usamos promesas porque al comienzo no sabemos si las podemos usar
				* @param {          String   } modulo   El nombre del módulo
				* @param {Function} callback La manera como hacemos saber que fue cargado el módulo solicitado
				* @return {Object}   La promesa con el módulo
				*/
			dame: function( modulo ) 
			{
				return new Promise( function( resolver ) 
				{
					// Necesito mirar si el módulo no es cargador, porque es el único que está definico al comenzar
					if ( R07[ modulo ] && modulo !== 'Cargador' ) 
					{
						resolver( R07[ modulo ]);
						return;
					}
					
					var script  = document.createElement( 'script' );
					script.type = 'text/javascript';
					script.src  = 'modulos/' + modulo.toLowerCase() + '/' + modulo + '.js';

					document.querySelector( 'head' ).appendChild( script );

					function alCargar() 
					{
						script.removeEventListener( 'load', alCargar );
						document.querySelector( 'head' ).removeChild( script );

						script = null;
						resolver( R07[ modulo ]);

						if ( R07.DEBUG ) this.pruebaModulo( modulo );
					}
					script.addEventListener( 'load', alCargar.bind( this ));
				}.bind( this ));
			},
			
			/**
				* El el método que carga los scripts de pruebas
				* @param {String} modulo El nombre del módulo que estamos cargando
				*/
			pruebaModulo: function( modulo ) 
			{
				if ( !R07.Pruebas_DEBUG ) R07.Pruebas_DEBUG = Promise.resolve();
				
				var script  = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src  = 'modulos/' + modulo.toLowerCase() + '/' + modulo + 'Test.js';
				
				document.querySelector( 'head' ).appendChild( script );
				
				function alCargar() 
				{
					script.removeEventListener( 'load', alCargar );
					document.querySelector( 'head' ).removeChild( script );
					
					script = null;
				}
				script.addEventListener( 'load', alCargar );
			}
		}
	}
	R07.Cargador.dame( 'ControladorMaestro' ).then( function( Maestro ) 
	{
		if ( R07.DEBUG === false ) Maestro.inicia();
	});
})( window );


// TODO: ENcontré un bug. Cuando ya haya información para el día en actual, si se elige el Editor, debe mostrar lo que tiene y no buscar lo de mañana