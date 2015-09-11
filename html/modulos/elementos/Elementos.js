/**
 * @author Héctor Fernando Hurtado
 * 
 * @description Se encarga de tener una referencia a los elementos del DOM de la app
 */

/* global R07, document */

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
            
            if ( id in this.elementosPorId ) {
                callback( this.elementosPorId[ id ]);
                return;
            }
            
            this.elementosPorId[ id ] = document.getElementById( id );
            callback( this.elementosPorId[ id ]);
        },
		
		/**
		 * A veces necesitamos elementos que pueden encontrarse con u nselector normal, pero si
		 * el elemento tienen ID, es mejor guardarlo para después
		 * @param {String}   selector El selector para encontrar al elemento en el DOM
		 * @param {Function} callback Le pasamos el Elemento encontrado o null
		 */
		damePorSelector: function( selector, callback ) {
			
			var $elemento = document.querySelector( selector );
			
			if ( $elemento.id ) {
				this.elementosPorId[ $elemento.id ] = $elemento;
			}
			
			callback( $elemento );
			$elemento = null;
		}
    };
})();