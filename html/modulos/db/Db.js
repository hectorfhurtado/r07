/**
 * @author Héctor Fernando Hurtado
 * @description La interfaz con la que realizaremos las transacciones a la BD
 */

/* global R07, indexedDB */

( function() {
    
    R07.Db = {
        
        /**
         * Inicializa la Base de datos y crea el objeto Devocional para guardar los devocionales
         * @param {String}   nombreDb El nombre de la base de datos
         * @param {Function} callback Le pasamos la base de datos
         */
        iniciar: function( nombreDb, callback ) {
            
            var req = indexedDB.open( nombreDb, 1 );
            
            req.onerror = function( e ) {
                console.log( 'R07.Db.iniciar(). Hubo un error al intentar abrir la BD' );
                throw new Error( e );
            };
            
            req.onupgradeneeded = function( e ) {
                var db = e.currentTarget.result;
                
                if ( !db.objectStoreNames.contains( 'devocional' )) {
                    db.createObjectStore( 'devocional', { keyPath: 'date' });
                }
            }.bind( this );
            
            req.onsuccess = function( e ) {
                this.db = e.target.result;
                
                callback( this.db );
            }.bind( this );
        }
    };
})();