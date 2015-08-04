/**
 * @author Héctor Fernando Hurtado
 * @description Se encarga de reemplazar el cargador que está basado en callbacks por uno basado en promesas
 */

/* global R07, document, Promise */

( function() {
    
    R07.Cargador = {
       /**
         * Devolvemos el módulo a través del callback. No usamos promesas porque al comienzo no sabemos si las podemos usar
         * @param {          String   } modulo   El nombre del módulo
         * @param {Function} callback La manera como hacemos saber que fue cargado el módulo solicitado
         */
        dame: function( modulo ) {

            return new Promise( function( resolve ) {
                
                var script  = document.createElement( 'script' );
                script.type = 'text/javascript';
                script.src  = `modulos/${ modulo.toLocaleLowerCase() }/${ modulo }.js`;

                document.querySelector( 'head' ).appendChild( script );

                function alCargar() {
                    script.removeEventListener( 'load', alCargar );
                    document.querySelector( 'head' ).removeChild( script );
                    script = null;
                    resolve();
                }

                script.addEventListener( 'load', alCargar );
            }.bind( this )).then( function() {
                
                if ( R07.DEBUG ) {
                    this.pruebaModulo( modulo );
                }
            }.bind( this ));
        },

        /**
         * Si está habilitado el modo debug, carga el archivo de pruebas
         * @param {String} modulo [[Description]]
         */
        pruebaModulo: function( modulo ) {
            
            var script  = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.src  = `modulos/${ modulo.toLowerCase() }/${ modulo }Test.js`;
            
            document.querySelector( 'head' ).appendChild( script );
            
            function alCargar() {
                script.removeEventListener( 'load', alCargar );
                document.querySelector( 'head' ).removeChild( script );
                script = null;
            }
                        
            script.addEventListener( 'load', alCargar );
        }
    };
})();