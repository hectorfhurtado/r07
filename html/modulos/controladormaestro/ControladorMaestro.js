/**
 * @author nando
 * @description Se encarga de coordinar a todos los módulos de la app
 */

/* global R07, window  */

( function() {
    
    R07.ControladorMaestro = {
        
        /**
         * El inicio de esta módulo
         */
        inicia: function() {
            this._mostrarElementosIniciales( this._cambiaMensajePrincipal.bind( this ));
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
        
        _iniciarBd: function() {
            
            if ( 'indexedDB' in window === false ) {
                
                R07.Elementos.damePorId( 'ResumenDevocional', function( $resumen ) {
                    $resumen.textContent = 'Tu navegador no soporta el tener una base de datos local, resulta ser imprescindible para poder funcionar';
                });
                return;
            }
            
            
            R07.Cargador.dame( 'Db', function( ) {
                
            });
        }
        
    };
})();