/**
 * @author nando
 * @description Se encarga de coordinar a todos los módulos de la app y de la página pricipal como tal
 */

/* global R07, window */

( function()
{    
	var UN_DIA_EN_MILIS  = 1000 * 60 * 60 * 24;
	var MESES            = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
	
    R07.ControladorMaestro =
	{    
        /**
         * El inicio de este módulo
         */
        inicia: function()
		{    
			this._mostrarElementosIniciales()
				.then( this._muestraFecha.bind( this, new Date()))
				.then( this._iniciarBd.bind( this ))
				.then( this._cambiaMensajePrincipal.bind( this ))
				.then( this._iniciaOmnibox.bind( this ))
                .then( this._aplicaEventListeners.bind( this ))
				.then( this._cargaEditor.bind( this ));
        },
        
        /**
         * Muestra los elementos de la página inicial que al comienzo están escondidos porque no se tiene acceso a JavaScript al cargarr
         * @return {Object}   Promesa sin parámetros
         * @private
         */
        _mostrarElementosIniciales: function()
		{    
			return R07.Cargador.dame( 'Elementos' ).then( function( Elementos )
			{
				return Promise.all([
					Elementos.damePorId( 'DescargaBtn' ),
					Elementos.damePorId( 'OmniboxIzqBtn' ),
					Elementos.damePorId( 'OmniboxCronometroBtn' ),
				]).then( function( $elementos )
				{
					$elementos[ 0 ].classList.remove( 'invisible' );
					$elementos[ 1 ].classList.remove( 'invisible' );
					$elementos[ 2 ].classList.remove( 'invisible' );
				});
			});
        },
        
        /**
         * Cambia el mensaje inicial cuando no hay JavasCript a uno donde se le indica al usuario qué hacer
         */
        _cambiaMensajePrincipal: function()
		{
			if ( R07.DEVOCIONAL && R07.DEVOCIONAL.capitulo )
			{
				return R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $main )
				{
					$main.textContent = '';
					
					if ( $main.childNodes.length > 1 )
					{
						return Promise.all([
							R07.Elementos.damePorId( 'ResumenDevocionalLibro' ),
							R07.Elementos.damePorId( 'ResumenDevocionalCapitulo' ),
						]).then( function( $elementos )
						{
							$elementos[ 0 ].textContent = R07.DEVOCIONAL.libro;
							$elementos[ 1 ].textContent = R07.DEVOCIONAL.capitulo;
						});
					}
					else
					{
						$main.insertAdjacentHTML( 'beforeEnd', `
<span id="ResumenDevocionalLibro">${ R07.DEVOCIONAL.libro }</span> <span id="ResumenDevocionalCapitulo">${ R07.DEVOCIONAL.capitulo }</span>
` );
					}
				});
			}
			
			return R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $resumen )
			{
				if ( R07.DEVOCIONAL && R07.DEVOCIONAL.horainicio ) $resumen.textContent = 'Ahora toca o haz click aquí para escribir en tu devocional'
				else $resumen.textContent = 'Toca o haz click en el reloj para comenzar'
			});
        },	// _cambiaMensajePrincipal
        
        /**
         * Se encarga de poner la fecha correcta en la pantalla de inicio
         * @param {Object} fecha La fecha que queremos mostrar en la pantalla
         * @return {Object} Devuelve una promesa
         * @private
         */
        _muestraFecha: function( fecha )
		{
            return R07.Elementos.damePorId( 'fechaFooter' ).then( function( $fecha )
			{
                return R07.Cargador.dame( 'UtilidadFecha' ).then( function( Util )
				{
                    $fecha.textContent = Util.dateAddddDDMMyyyy( fecha );
                });
            });
        },
        
        /**
         * Llamamos a la base de datos y le damos arrancar
         * @param   {Function}  callback    La función para continuar el flujo del módulo
         * @private
         */
        _iniciarBd: function()
		{
            if ( 'indexedDB' in window === false )
			{
                return R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $resumen )
				{
                    $resumen.textContent = 'Tu navegador no soporta el tener una base de datos local que es imprescindible para poder funcionar';
					return null;
                });
            }
			
			return R07.Cargador.dame( 'Db' ).then( function( BD )
			{
				return BD.iniciar( 'r07' );
			}).then( function( BD )
			{
				return BD.trae();
			}).then( function( devocionalEnBd )
			{
				return ( R07.DEVOCIONAL = devocionalEnBd );
			});
        },
		
		/**
		 * Inicializamos el Omnibox
		 * @param   {Object}  devocional El devocional que viene de la BD
		 * @returns {Promise} La promesa para pasar al siguiente método
		 */
		_iniciaOmnibox: function()
		{
			return R07.Cargador.dame( 'Omnibox' ).then( function( Omnibox )
			{
				return Omnibox.inicia( R07.DEVOCIONAL );
			});
		},
        
        /**
         * Escucha todos los eventos que vengan de los componentes de la app
         * @private
         */
        _aplicaEventListeners: function()
		{
            return R07.Cargador.dame( 'Elementos' ).then( function( Elementos )
			{
				return Promise.all([
					Elementos.damePorSelector( 'body' ),
					Elementos.damePorId( 'ResumenDevocional' ),
					Elementos.damePorId( 'DescargaBtn' ),
				]);
				
				// return Elementos.damePorSelector( 'body' );
			}).then( function( $elementos )
			{
				var $body = $elementos[ 0 ];
				
				$body.addEventListener( 'traeFechaAnterior',  this._traeFechaAnteriorHandler.bind( this ),  true );
				$body.addEventListener( 'traeFechaSiguiente', this._traeFechaSiguienteHandler.bind( this ), true );
				
				$body.addEventListener( 'traeFecha', function( e )
				{
					if ( e.detail ) this._actualizaUiPrincipal( e.detail );
				}.bind( this ), true );
					
				$body.addEventListener( 'actualizaDevocional', this._actualizaDevocionalHandler.bind( this ), true );
				
				$body.addEventListener( 'salePrincipal', function()
				{	
					// Podemos usar este listener si sacamos de ControladorMaestro la lógica para la primera página
				}, true );
				
				$body.addEventListener( 'saleEditor', this._saleEditorHandler, true );
				
				var $main = $elementos[ 1 ];
				$main.addEventListener( 'click', this._clickMain.bind( this ), false );
				
				var $descarga = $elementos[ 2 ];
				$descarga.addEventListener( 'click', this._clickDescargaHandler.bind( this ), false );
			}.bind( this ));
        },  // _aplicaEventListeners
		/**
		 * @param	{NUmber}
		 * @return	{String}
		 * @private
		 */
		_cambiaNumeroADosDigitos: function( numero )
		{
			return ( numero < 10 ) ? '0' + numero : '' + numero;
		},
        
		/**
		 * Debe actualizar la fecha que ve el usuario y preguntarle al Omnibox si debe mostrar la flecha de la derecha
		 * @param {Date} fecha La fecha del devocional más o menos un día
		 * @private
		 */
		_actualizaUiPrincipal: function( fecha )
		{
			return this._muestraFecha( fecha ).then( function()
			{
				return R07.Cargador.dame( 'Db' );
			}).then( function( DB )
			{
				return DB.trae( fecha );
			}).then( function( datoEnBd )
			{
				R07.DEVOCIONAL = datoEnBd;
				
				this._cambiaMensajePrincipal();
				R07.Omnibox.actualiza( datoEnBd );
				
				return R07.Cargador.dame( 'Editor' );
			}.bind( this )).then( function( Editor )
			{
				Editor.actualizaDevocional( R07.DEVOCIONAL );
			});
		},
		
		/**
		 * Carga el módulo Editor, sin embargo, al realizar los tests, debemos cargarlo por separado, por eso verificamos si está 'seteada' la variable R07.DEBUG
		 * @author Héctor Fernando Hurtado
		 * @returns {[[Type]]} [[Description]]
		 */
		_cargaEditor: function()
		{
			return R07.Cargador.dame( 'Editor' ).then( function( Editor )
			{
				if ( !R07.DEBUG ) return Editor.inicia();
			});
		},
		
		/**
		 * Se encarga de coordinar las clases y eventos que definen la animación que se da en el cambio de vista principal al Editor del devocional
		 * @private
		 */
		_clickMain: function( e )
		{
			var evento = new CustomEvent( 'salePrincipal' );
			e.target.dispatchEvent( evento );
			
			return R07.Elementos.damePorSelector( 'header' ).then( function( $header )
			{	
				$header.addEventListener( 'transitionend', transitionEndSalePrincipalHandler, false );
				
				function transitionEndSalePrincipalHandler()
				{
					$header.removeEventListener( 'transitionend', transitionEndSalePrincipalHandler, false );

					// Al hacer pruebas, no existe aún el Editor, así que este pedazo sale con error
					if ( R07.DEBUG ) return;
				
					if ( R07.DEVOCIONAL && R07.DEVOCIONAL.capitulo && R07.DEVOCIONAL.libro )
						R07.Editor.actualizaDevocional( R07.DEVOCIONAL );
						
					R07.Elementos.damePorId( 'Editor' ).then( function( $editor )
					{
						$editor.classList.remove( 'inexistente' );
						
						// Este es para que el browser alcance a aplicar primero el quitar el display:none y mostrar la animación
						setTimeout( function()
						{
							$editor.classList.add( 'muestraBotones' );
						}, 10 );
						
						return R07.Elementos.damePorId( 'ResumenDevocional' );
					}).then( function( $main )
					{
						$main.style.opacity = 0;
					});
				}
				
				return R07.Elementos.damePorSelector( 'body' );
			}.bind( this )).then( function( $body )
			{
				$body.classList.add( 'salePrincipal' );
			});
		},	// _clickMain
		
		/**
		 * Se encarga de generar el reporte para el mes seleccionado, consultando a la BD por cada día en el mes y generando un link para guardar el reporte como un archivo .txt
		 * @author Héctor Fernando Hurtado
		 * @private
		 */
		_clickDescargaHandler: function()
		{
			var fechaActual                  = R07.DEVOCIONAL.fecha;
			var primerDiaDelMes              = new Date( fechaActual.getFullYear(), fechaActual.getMonth() );
			var primerDiaSiguienteMes        = new Date( primerDiaDelMes.getFullYear(), primerDiaDelMes.getMonth() + 1 );
			var primerDiaSiguienteMesEnMilis = primerDiaSiguienteMes.getTime();
			var promesas                     = [];
			var log                          = 'Reporte del 1 al ';

			for ( var i = primerDiaDelMes.getTime(); i < primerDiaSiguienteMesEnMilis; i += UN_DIA_EN_MILIS )
			{
				promesas.push( R07.Db.trae( new Date( i )));
			}

			log += new Date( i - UN_DIA_EN_MILIS ).getDate();
			log += ' de ' + MESES[ fechaActual.getMonth() ];
			log += ' de ' + fechaActual.getFullYear() + '\r\n\r\n';
			log += 'Dia\tInicio\tFin\tPorción\r\n';

			Promise.all( promesas ).then( function( resultados )
			{
				resultados.forEach( function( resultado )
				{
					log += resultado.fecha.getDate() + '\t';													// Día
					log += ( resultado.horainicio ? resultado.horainicio : '' ) + '\t';							// Inicio
					log += ( resultado.horafin    ? resultado.horafin    : '' ) + '\t';							// Fin
					log += resultado.libro + ' ' + resultado.capitulo + '\t' + resultado.devocional + '\r\n';	// Porción
				});

				var link              = document.createElement( 'a' );
				link.href             = 'data:                          ,' +  encodeURI( log );
				link.style.visibility ='hidden';
				
				link.download = 'reporte' + primerDiaDelMes.getFullYear() +
					this._cambiaNumeroADosDigitos(( primerDiaDelMes.getMonth() + 1 )) + 
					this._cambiaNumeroADosDigitos( primerDiaDelMes.getDate() ) + '.txt';

				document.body.appendChild( link );
				link.click();
				document.body.removeChild( link );
				
				link = fechaActual = primerDiaDelMes = primerDiaSiguienteMes = primerDiaSiguienteMesEnMilis = log = promesas = null;
			}.bind( this ));			
		},	// _clickDescargaHandler
		
		_traeFechaAnteriorHandler: function()
		{
			if ( R07.DEVOCIONAL )
			{
				var ayer = new Date( R07.DEVOCIONAL.fecha.getTime() - UN_DIA_EN_MILIS );

				this._actualizaUiPrincipal( ayer );
			}
		},
		
		_traeFechaSiguienteHandler: function()
		{
			if ( R07.DEVOCIONAL )
			{
				var manana = new Date( R07.DEVOCIONAL.fecha.getTime() + UN_DIA_EN_MILIS );

				this._actualizaUiPrincipal( manana );
			}
		},
		
		/**
		 * Verifica que todos los cambios realizados sean actualizados en la BD
		 * @author Héctor Fernando Hurtado
		 * @param {object} e Contiene el detalle que viene del módulo que realizó el cambio en el devocional
		 * @private
		 */
		_actualizaDevocionalHandler: function( e )
		{
			if ( e.detail.horainicio ) R07.DEVOCIONAL.horainicio = e.detail.horainicio;
			if ( e.detail.horafin    ) R07.DEVOCIONAL.horafin    = e.detail.horafin;
			if ( e.detail.capitulo   ) R07.DEVOCIONAL.capitulo   = e.detail.capitulo;
			if ( e.detail.libro      ) R07.DEVOCIONAL.libro      = e.detail.libro;
			if ( e.detail.devocional ) R07.DEVOCIONAL.devocional = e.detail.devocional;
			if ( e.detail.texto      ) R07.DEVOCIONAL.texto      = e.detail.devocional;

			R07.Cargador.dame( 'Db' ).then( function( DB )
			{
				DB.actualizaDato( R07.DEVOCIONAL ).then( function()
				{
					this._actualizaUiPrincipal( R07.DEVOCIONAL.fecha );
				}.bind( this )).then( this._cambiaMensajePrincipal );
			}.bind( this ));
		},
		
		/**
		 * Cuando sale del editor, coordinamos la animación de salida con la de entrada de los contorles de la página principal.
		 * Es necesario tener en la misma función el handler para el animationend porque de lo contrario al intentar quitarlo del elemento es como si pasáramos
		 * una función distinta a la del addEventListener, por eso todo toca en esta sola función
		 * @author Héctor Fernando Hurtado
		 * @returns {undefined}
		 * @private
		 */
		_saleEditorHandler: function()
		{
			R07.Elementos.damePorId( 'Editor' ).then( function( $editor )
			{
				$editor.classList.remove( 'muestraBotones' );
				$editor.addEventListener( 'transitionend', transitionEndSaleEditorHandler, false );

				function transitionEndSaleEditorHandler()
				{
					$editor.removeEventListener( 'transitionend', transitionEndSaleEditorHandler, false );
					$editor.classList.add( 'inexistente' );

					R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $main)
					{
						$main.style.opacity = 1;

						return R07.Elementos.damePorSelector( 'body' );
					}).then( function( $body )
							{
						$body.classList.remove( 'salePrincipal' );
					});
				}
			});
		},
    };
})();