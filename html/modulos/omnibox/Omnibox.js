/**
 * @author    Héctor Fernando Hurtado
 */

/* global R07 */

( function() {
    
    R07.Omnibox = {
        
        /**
         * Inicia le Omnibox agregando los EventListeners a los botones que contiene
         */
        inicia: function() {
            
            R07.Cargador.dame( 'Elementos', function( Elementos ) {
                
                Elementos.damePorId( 'OmniboxCronometroBtn', function( $cronometroBtn ) {
                    
                    var $svg = $cronometroBtn.children[ 0 ];
					$svg.classList.add( 'cronometroGrande' );
                    
//                    $cronometroBtn.addEventListener( 'click', function() {
                    $svg.addEventListener( 'click', function() {
//                        var $cronometro = this.children[ 0 ];
//                        
//                        $cronometro.classList.remove( 'cronometroGrande' );
//						$cronometro.classList.remove( 'oprimido' );
//						$cronometro.classList.add( 'cronometroCorriendo' );
//						
//                        // Luego de que termine la animación del cronómetro encogiéndose, mostramos la hora de inicio
//                        $cronometro.addEventListener( 'transitionend', function() {
                        
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
					
					// TODO: No corre en Firefox
					
					// Al oprimir el mouse, hacemos como que oprimimos el cronóemtro para comenzar
//					$cronometroBtn.addEventListener( 'mousedown', function() {
					$svg.addEventListener( 'mousedown', function() {
						var $cronometro = this.children[ 0 ];
                        
						$cronometro.classList.add( 'oprimido' );
					}, false )
					
                });
                
            });
        },
        
        escribeHoraInicio: function( devocional ) {
            
            var fecha = new Date();
            
            R07.Cargador.dame( 'UtilidadFecha', function( util ) {
                
                R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
                    
                    $horas.children[ 0 ].textContent = devocional.horainicio = util.traeHoras( fecha ) + ':' + util.traeMinutos( fecha );
                });
            });
        }
    };
})();