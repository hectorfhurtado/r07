/**
 * @author nando
 * @description Se encarga de coordinar a todos los módulos de la app
 */

/* global R07, window  */

( function() {
    
	var UN_DIA_EN_MILIS = 1000 * 60 * 60 * 24;
	
    R07.ControladorMaestro = {
        
        /**
         * El inicio de esta módulo
         */
        inicia: function() {
            
            // Llamo a un método después del siguiente
            this._mostrarElementosIniciales( 
                this._cambiaMensajePrincipal.bind( this, 
                this._muestraFecha.bind( this, new Date(),
                this._iniciarBd.bind( this )))
            );
			
			R07.Cargador.dame( 'Elementos', function( Elementos ) {
				
				Elementos.damePorSelector( 'body', function( $body ) {

					$body.addEventListener( 'traeFechaAnterior', function() {
						
						if ( R07.DEVOCIONAL ) {
							
							this._muestraFecha( new Date( R07.DEVOCIONAL.fecha - UN_DIA_EN_MILIS ));
							
							// TODO(Nando): Continuar con el traer la fecha desde la BD
						}

					}.bind( this ), true );
				}.bind( this ));
			}.bind( this ));
        },
        
        /**
         * Muestra los elementos de la página inicial que al comienzo están escondidos porque no se tiene acceso a JavaScript al cargarr
         * @param {Function} callback    La función que llamaremos al terminar de mostrar los elementos iniciales
         * @private
         */
        _mostrarElementosIniciales: function( callback ) {
            
            R07.Cargador.dame( 'Elementos', function( Elementos ) {
                
                Elementos.damePorId( 'DescargaBtn', function( $descargarBtn ) {
                    $descargarBtn.classList.remove( 'invisible' );
                });
                
                Elementos.damePorId( 'OmniboxIzqBtn', function( $izqBtn ) {
                    $izqBtn.classList.remove( 'invisible' );
                });
                
                Elementos.damePorId( 'OmniboxCronometroBtn', function( $cronometroBtn ) {
                    $cronometroBtn.classList.remove( 'invisible' );
                });
                
                callback();
            });
        },
        
        /**
         * Cambia el mensaje inicial cuando no hay JavasCript a uno donde se le indica al usuario qué hacer
         */
        _cambiaMensajePrincipal: function( callback ) {
            
            R07.Elementos.damePorId( 'ResumenDevocional', function( $resumen ) {
                $resumen.textContent = 'Toca el reloj para comenzar';
                
                if ( callback ) {
                    callback();
                }
            });
        },
        
        /**
         * Se encarga de poner la fecha correcta en la pantalla de inicio
         * @param {Object}   fecha    La fecha que queremos mostrar en la pantalla
         * @param {Function} callback La consecución del programa
         * @private
         */
        _muestraFecha: function( fecha, callback ) {
            
            R07.Elementos.damePorId( 'fechaFooter', function( $fecha ) {
                R07.Cargador.dame( 'UtilidadFecha', function( Util ) {
                    
                    $fecha.textContent = Util.dateAddddDDMMyyyy( fecha );
					
					if ( callback ) {
                    	callback();
					}
                });
            });
        },
        
        /**
         * Llamamos a la base de datos y le damos arrancar
         * @private
         */
        _iniciarBd: function() {
            
            if ( 'indexedDB' in window === false ) {
                
                R07.Elementos.damePorId( 'ResumenDevocional', function( $resumen ) {
                    $resumen.textContent = 'Tu navegador no soporta el tener una base de datos local, resulta ser imprescindible para poder funcionar';
                });
                return;
            }
            
            R07.Cargador.dame( 'Omnibox', function( Omnibox ) {
                
                Omnibox.inicia();
            });
            
            R07.Cargador.dame( 'Db', function( BD ) {
                
                BD.iniciar( 'r07', function() {
                    BD.trae( null, function( devocional ) {
                        
						R07.Omnibox.escribeHoraInicio( devocional );
						R07.DEVOCIONAL = devocional;
                    });
                });
            });
        }
        
    };
})();