/**
 * @author    Héctor Fernando Hurtado
 */

/* global R07, Event */

( function() {
    
    R07.Omnibox = {
        
        /**
         * Inicia le Omnibox agregando los EventListeners a los botones que contiene
         */
        inicia: function() {
            
            R07.Cargador.dame( 'Elementos', function( Elementos ) {
                
                Elementos.damePorId( 'OmniboxCronometroBtn', function( $cronometroBtn ) {
					$cronometroBtn.classList.add( 'cronometroGrande' );
                    
                    $cronometroBtn.addEventListener( 'click', function() {
                        this.classList.remove( 'cronometroGrande' );
						this.classList.remove( 'oprimido' );
						this.classList.add( 'cronometroCorriendo' );
						
                        // Luego de que termine la animación del cronómetro encogiéndose, mostramos la hora de inicio
                        this.addEventListener( 'transitionend', function() {
                            Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
                                $horas.classList.remove( 'invisible' );
                            });
                        }, false );
                        
                    }, false );
					
					// Al oprimir el mouse, hacemos como que oprimimos el cronóemtro para comenzar
					$cronometroBtn.addEventListener( 'mousedown', function() {    
						this.classList.add( 'oprimido' );
					}, false );
					
                });
                
				// Agregamos los Event handlers para la flecha de la izquierda
				Elementos.damePorId( 'OmniboxIzqBtn', function( $botonIzq ) {
					
					$botonIzq.addEventListener( 'click', function() {
						var evento = new Event( 'traeFechaAnterior' );
						
						this.dispatchEvent( evento );
					}, true );
				});
            });
        },
        
        /**
         * Al oprimir por primera vez el botón del reloj, el usuario puede saber a qué hora comenzó
         * a hacer su devocional
         * @para    {Object}    devocional  Es el objeto que está guardado en la BD con la info del devocional
         */
        escribeHoraInicio: function( devocional ) {
            
            var fecha = new Date();
            
            R07.Cargador.dame( 'UtilidadFecha', function( util ) {
                
                R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
                    
                    if ( devocional.horainicio ) {
                        $horas.children[ 0 ].textContent = devocional.horainicio;
                    }
					else {
                    	$horas.children[ 0 ].textContent = devocional.horainicio = util.traeHoras( fecha ) + ':' + util.traeMinutos( fecha );
					}
                });
            });
        }
    };
})();