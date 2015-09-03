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
                    
                    $cronometroBtn.children[ 0 ].classList.add( 'cronometroGrande' );
                    
                    $cronometroBtn.addEventListener( 'click', function() {
                        var $cronometro = this.children[ 0 ];
                        
                        $cronometro.classList.remove( 'cronometroGrande' );
                        
                        // TODO Adicionar la animación para mover la manecilla
                        
                        // Luego de que termine la animación del cronómetro encogiéndose, mostramos la hora de inicio
                        $cronometro.addEventListener( 'transitionend', function() {
                            
                            Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
                                $horas.classList.remove( 'invisible' );
                            });
                        }, false );
                        
                    }, false );
                });
                
            });
        },
        
        escribeHoraInicio: function( fecha ) {
            
            var fechaHora = fecha || new Date();
            
            R07.Cargador.dame( 'UtilidadFecha', function( util ) {
                
                R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
                    
                    $horas.children[ 0 ].textContent = util.traeHoras( fechaHora ) + ':' + util.traeMinutos( fechaHora );
                });
            });
        }
    };
})();