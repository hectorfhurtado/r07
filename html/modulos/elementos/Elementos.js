/**
 * @author Héctor Fernando Hurtado
 * 
 * @description Se encarga de tener una referencia a los elementos del DOM de la app
 */

/* global R07, Promise, document */

( function() {
    
    R07.Elementos = {
        
        elementosPorId: {},                // Contiene la lista de elementos del DOM de la app, es un caché para ello
        
        /**
         * Devuelve el elemento del DOM en una promesa o por callback según se necesite.
         * Guarda el elemento en el caché
         * @param   {String}   id       El ID del elemento
         * @param   {Function} callback Cuando no se puede usar promesas se debe pasar el callback
         * @returns {Promise}  Retornamos la promesa
         */
        damePorId: function( id, callback ) {
            
            if ( R07.hasPromise ) {
                
                if ( id in this.elementosPorId ) {
                    return new Promise.resolve( this.elementosPorId[ id ]);
                }
                
                return new Promise( function( resolve ) {    
                    this.elementosPorId[ id ] = document.getElementById( id );
                    
                    resolve( this.elementosPorId[ id ]);
                }.bind( this ));
            }
            
            if ( id in this.elementosPorId ) {
                callback( this.elementosPorId[ id ]);
                return;
            }
            
            this.elementosPorId[ id ] = document.getElementById( id );
            callback( this.elementosPorId[ id ]);
        }
    };
})();