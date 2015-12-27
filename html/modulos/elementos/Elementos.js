/**
 * @author Héctor Fernando Hurtado
 * 
 * @description Se encarga de tener una referencia a los elementos del DOM de la app
 */

/* global R07, document, Promise */

( function()
{
    R07.Elementos =
	{
        elementosPorId: {},		// Contiene la lista de elementos del DOM de la app, es un caché para ello
        
        /**
         * Devuelve el elemento del DOM en una promesa o por callback según se necesite.
         * Guarda el elemento en el caché
         * @param   {String}   id       El ID del elemento
         * @returns {Promise}  Retornamos la promesa
         */
        damePorId: function( id )
		{
			return new Promise( function( resolver )
			{
				if ( id in this.elementosPorId )
				{
					resolver( this.elementosPorId[ id ]);
					return;
				}
				this.elementosPorId[ id ] = document.getElementById( id );
				
				resolver( this.elementosPorId[ id ]);
			}.bind( this ));
        },
		
		/**
		 * A veces necesitamos elementos que pueden encontrarse con u nselector normal, pero si
		 * el elemento tienen ID, es mejor guardarlo para después
		 * @param {String} selector El selector para encontrar al elemento en el DOM
		 * @return {Object} Promise con el elementos solicitado
		 */
		damePorSelector: function( selector )
		{
			return new Promise( function( resolver )
			{
				var $elemento = document.querySelector( selector );

				if ( $elemento.id ) this.elementosPorId[ $elemento.id ] = $elemento;

				resolver( $elemento );
				
				$elemento = null;
			}.bind( this ));
		}
    };
})();