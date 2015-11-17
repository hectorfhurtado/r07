/**
 * @author nando
 * @description Se encarga de coordinar a todos los módulos de la app
 */

/* global R07, window */

( function()
{    
	var UN_DIA_EN_MILIS = 1000 * 60 * 60 * 24;
	
    R07.ControladorMaestro =
	{    
        /**
         * El inicio de este módulo
         */
        inicia: function()
		{    
			this._mostrarElementosIniciales()
				.then( this._cambiaMensajePrincipal.bind( this ))
				.then( this._muestraFecha.bind( this, new Date()))
				.then( this._iniciarBd.bind( this ))
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
				return Elementos.damePorId( 'DescargaBtn' ).then( function( $descargarBtn )
				{	
					$descargarBtn.classList.remove( 'invisible' );
					
					return Elementos.damePorId( 'OmniboxIzqBtn' );
				}).then( function( $izqBtn )
				{
					$izqBtn.classList.remove( 'invisible' );
					
					return Elementos.damePorId( 'OmniboxCronometroBtn' );
				}).then( function( $cronometroBtn )
				{
					$cronometroBtn.classList.remove( 'invisible' );
				});
			});
        },
        
        /**
         * Cambia el mensaje inicial cuando no hay JavasCript a uno donde se le indica al usuario qué hacer
         */
        _cambiaMensajePrincipal: function()
		{
			var milocalStorage = JSON.parse( localStorage.getItem( 'ultimoCapitulo' ));
			
			if ( milocalStorage )
			{
				return R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $main )
				{
					var $libro       = null;
					var $capitulo    = null;
					
					$main.textContent = '';
					
					if ( $main.childNodes.length > 1 )
					{
						return R07.Elementos.damePorId( 'ResumenDevocionalLibro' ).then( function( libro )
						{
							$libro = libro;
							
							return R07.Elementos.damePorId( 'ResumenDevocionalCapitulo' );
						}).then( function( capitulo )
						{
							$capitulo = capitulo;
							
							$libro.textContent       = milocalStorage.libro;
							$capitulo.textContent    = milocalStorage.capitulo;
						});
					}
					else
					{
						$main.insertAdjacentHTML( 'beforeEnd', `
<span id="ResumenDevocionalLibro">${ milocalStorage.libro }</span>: <span id="ResumenDevocionalCapitulo">${ milocalStorage.capitulo }</span>
` );
					}
				});
			}
			
			return R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $resumen )
			{
				$resumen.textContent = 'Toca el reloj para comenzar';
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
		_iniciaOmnibox: function( devocional )
		{
			// Cuando hay problemas con la BD, me devuelven null
			if ( devocional === null ) return null;
			
			return R07.Cargador.dame( 'Omnibox' ).then( function( Omnibox )
			{
				return Omnibox.inicia( devocional );
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
				return Elementos.damePorSelector( 'body' );
			}).then( function( $body )
			{
				$body.addEventListener( 'traeFechaAnterior', function()
				{
					if ( R07.DEVOCIONAL )
					{
						var ayer = new Date( R07.DEVOCIONAL.fecha.getTime() - UN_DIA_EN_MILIS );

						this._actualizaUiPrincipal( ayer );
					}
				}.bind( this ), true );
					
				$body.addEventListener( 'traeFechaSiguiente', function()
				{
					if ( R07.DEVOCIONAL )
					{
						var manana = new Date( R07.DEVOCIONAL.fecha.getTime() + UN_DIA_EN_MILIS );

						this._actualizaUiPrincipal( manana );
					}
				}.bind( this ), true );
				
				$body.addEventListener( 'traeFecha', function( e )
				{
					if ( e.detail ) this._actualizaUiPrincipal( e.detail );
				});
					
				$body.addEventListener( 'actualizaDevocional', function()
				{
					R07.Cargador.dame( 'Db' ).then( function( DB)
					{
						DB.actualizaDato( R07.DEVOCIONAL );
						
						this._actualizaUiPrincipal( R07.DEVOCIONAL.fecha );
					}.bind( this ));
				}.bind( this ), true );
				
				$body.addEventListener( 'salePrincipal', function()
				{
					this.classList.add( 'salePrincipal' );
				}, true );
				
				return R07.Elementos.damePorId( 'ResumenDevocional' );
			}.bind( this )).then( function( $main )
			{
				$main.addEventListener( 'click', this._clickMain, true );
			}.bind( this ));
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
				
				R07.Omnibox.actualiza( datoEnBd );
				
				return R07.Cargador.dame( 'Editor' );
			}).then( function( Editor )
			{
				Editor.actualizaDevocional( R07.DEVOCIONAL );
			});
		},
		
		_cargaEditor: function()
		{
			return R07.Cargador.dame( 'Editor' ).then( function( Editor )
			{
				if ( !R07.DEBUG ) return Editor.inicia();
			});
		},
		
		_clickMain: function( e )
		{
			console.dir( e ) // TODO: Seguir con las pruebas
			
			this.dispatchEvent( new CustomEvent( 'salePrincipal' ));
		}
    };
})();