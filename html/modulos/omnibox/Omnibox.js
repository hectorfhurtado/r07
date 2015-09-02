/**
 * @author    Héctor Fernando Hurtado
 */

/* global R07 */

( function() {
    
    R07.Omnibox = {
        
        inicia: function() {
            
            R07.Cargador.dame( 'Elementos', function( Elementos ) {
                
                Elementos.damePorId( 'OmniboxCronometroBtn', function( $cronometroBtn ) {
                    
                    $cronometroBtn.children[ 0 ].classList.add( 'cronometroGrande' );
                    
                    $cronometroBtn.addEventListener( 'click', function() {
                        
                        this.children[ 0 ].classList.remove( 'cronometroGrande' );
                    }, false );
                });
            });
        }
    };
})();