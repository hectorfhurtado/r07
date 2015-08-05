/**
 * @author nando
 * @description Se encarga de coordinar a todos los módulos de la app
 */

/* global R07, Promise */

( function() {
    
    R07.ControladorMaestro = {
        
        /**
         * El inicio de esta módulo
         */
        inicia: function() {
            this._mostrarElementosIniciales();
        },
        
        /**
         * Muestra los elementos de la página inicial que al comienzo están escondidos porque no se tiene acceso a JavaScript al cargarr
         * @returns {Promise}    Puede regresar una promesa si está habilitado
         * @private
         */
        _mostrarElementosIniciales: function() {
            
            if ( R07.hasPromise ) {
                
                return Promise( function( resolve ) {
                    
                    R07.Cargador.dame( 'Elementos' ).then( function( Elementos ) {
                        return Elementos.damePorId( 'DescargaBtn' );
                    }).then( function( $descargarBtn ) {
                        return $descargarBtn.classList.remove( 'invisible' );
                    }).then( function() {
                        return R07.Elementos.damePorId( 'OmniboxIzqBtn' );
                    }).then( function( $izqBtn ) {
                        return $izqBtn.classList.remove( 'invisible' );
                    }).then( function() {
                        return R07.Elementos.damePorId( 'OmniboxCronometroBtn' );
                    }).then( function( $cronometroBtn ) {
                        return $cronometroBtn.classList.remove( 'invisible' );
                    }).then( function() {
                        resolve();
                    });
                });
            }
        }
        
    };
})();