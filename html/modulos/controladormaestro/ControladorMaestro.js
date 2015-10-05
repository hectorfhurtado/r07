/**
 * @author nando
 * @description Se encarga de coordinar a todos los módulos de la app
 */

/* global R07, window */

( function() {
    
	var UN_DIA_EN_MILIS = 1000 * 60 * 60 * 24;
	
    R07.ControladorMaestro = {
        
        /**
         * El inicio de esta módulo
         */
        inicia: function() {
            
            // Llamo a un método después del siguiente
			this._mostrarElementosIniciales()
				.then( this._cambiaMensajePrincipal.bind( this ))
				.then( this._muestraFecha.bind( this, new Date()))
				.then( this._iniciarBd.bind( this ))
                .then( this._aplicaEventListeners.bind( this ));

//            this._mostrarElementosIniciales( 
//                this._cambiaMensajePrincipal.bind( this, 
//                this._muestraFecha.bind( this, new Date(),
//                this._iniciarBd.bind( this,
//                this._aplicaEventListeners.bind( this ))))
//            );
        },
        
        /**
         * Muestra los elementos de la página inicial que al comienzo están escondidos porque no se tiene acceso a JavaScript al cargarr
         * @return {Object}   Promesa sin parámetros
         * @private
         */
        _mostrarElementosIniciales: function() {
            
			return R07.Cargador.dame( 'Elementos' ).then( function( Elementos ) {

				Elementos.damePorId( 'DescargaBtn' ).then( function( $descargarBtn ) {
					$descargarBtn.classList.remove( 'invisible' );
					
					return Elementos.damePorId( 'OmniboxIzqBtn' );
				}).then( function( $izqBtn ) {
					$izqBtn.classList.remove( 'invisible' );
					
					return Elementos.damePorId( 'OmniboxCronometroBtn' );
				}).then( function( $cronometroBtn ) {
					$cronometroBtn.classList.remove( 'invisible' );
				});
			});
        },
        
        /**
         * Cambia el mensaje inicial cuando no hay JavasCript a uno donde se le indica al usuario qué hacer
         */
        _cambiaMensajePrincipal: function() {
            
			return R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $resumen ) {
				$resumen.textContent = 'Toca el reloj para comenzar';
			});
        },
        
        /**
         * Se encarga de poner la fecha correcta en la pantalla de inicio
         * @param {Object} fecha La fecha que queremos mostrar en la pantalla
         * @return {Object} Devuelve una promesa
         * @private
         */
        _muestraFecha: function( fecha ) {
            
            return R07.Elementos.damePorId( 'fechaFooter' ).then( function( $fecha ) {
                return R07.Cargador.dame( 'UtilidadFecha' ).then( function( Util ) {
                    
                    $fecha.textContent = Util.dateAddddDDMMyyyy( fecha );
                });
            });
        },
        
        /**
         * Llamamos a la base de datos y le damos arrancar
         * @param   {Function}  callback    La función para continuar el flujo del módulo
         * @private
         */
        _iniciarBd: function() {
            
            if ( 'indexedDB' in window === false ) {
                
                return R07.Elementos.damePorId( 'ResumenDevocional' ).then( function( $resumen ) {
                    $resumen.textContent = 'Tu navegador no soporta el tener una base de datos local, resulta ser imprescindible para poder funcionar';
                });
            }
            
            return R07.Cargador.dame( 'Omnibox' ).then( function( Omnibox ) {
                
                Omnibox.inicia();
				
				return R07.Cargador.dame( 'Db' );
            }).then( function( BD ) {
                
                return BD.iniciar( 'r07' );
            }.bind( this )).then( function() {
				this._actualizaFechaDevocional( null );
			}.bind( this ));
        },
        
        /**
         * Escucha todos los eventos que vengan de los componentes de la app
         * @private
         */
        _aplicaEventListeners: function() {
            
            return R07.Cargador.dame( 'Elementos' ).then( function( Elementos ) {
				
				return Elementos.damePorSelector( 'body' );
				
			}).then( function( $body ) {

				$body.addEventListener( 'traeFechaAnterior', function() {

					if ( R07.DEVOCIONAL ) {

						var ayer = new Date( R07.DEVOCIONAL.fecha.getTime() - UN_DIA_EN_MILIS );

						this._actualizaUiPrincipal( ayer );
					}

				}.bind( this ), true );
					
				$body.addEventListener( 'traeFechaSiguiente', function() {

					if ( R07.DEVOCIONAL ) {

						var manana = new Date( R07.DEVOCIONAL.fecha.getTime() + UN_DIA_EN_MILIS );

						this._actualizaUiPrincipal( manana );
					}

				}.bind( this ), true );
					
				$body.addEventListener( 'actualizaDevocional', function() {

					R07.Cargador.dame( 'Db' ).then( function( DB) {

						DB.actualizaDato( R07.DEVOCIONAL );
						this._actualizaUiPrincipal( R07.DEVOCIONAL.fecha );
					}.bind( this ));
				}.bind( this ), true );
			}.bind( this ));
        },
        
        /**
         * Muestra en el UI la fecha para el usuario y actualiza el objeto DEVOCIONAL que todos consumen
         * @param   {Date}   fecha La fecha que vamos a buscar en la BD
         * @return {Object} Promise
         * @private
         */
        _actualizaFechaDevocional: function( fecha ) {
            
            return R07.Db.trae( fecha ).then( function( devocional ) {
                        
                R07.DEVOCIONAL = devocional;
				R07.Omnibox.verificaCronometro( devocional );
                R07.Omnibox.escribeHoraInicio( devocional );
                R07.Omnibox.debeMostrarFlechaDerecha( devocional.fecha );
            });
        },
		
		/**
		 * Debe actualizar la fecha que ve el usuario y preguntarle al Omnibox si debe mostrar la flecha de la derecha
		 * @param {Date} fecha La fecha del devocional más o menos un día
		 * @private
		 */
		_actualizaUiPrincipal: function( fecha ) {
			
			return this._muestraFecha( fecha ).then( function() {
				
				return R07.Cargador.dame( 'Db' );
			}).then( function( DB ) {

				return this._actualizaFechaDevocional( fecha, DB );

				// TODO (nando): Mirar si se necesita comunicar a todos los componentes del cambio de
			}.bind( this ));
		}
    };
})();