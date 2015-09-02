/**
 * @author Héctor Fernando Hurtado
 * @description La interfaz con la que realizaremos las transacciones a la BD
 */

/* global R07, indexedDB, console */

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
        },
        
        /**
         * Busca en el indexedDB registro para el devocional con la fecha suministrada
         * @param {Date}     fecha    La fecha a buscar
         * @param {Function} callback Le pasamos lo encontrado en la BD o un objeto para el devocional nuevo
         */
        trae: function( fecha, callback ) {
            
            if ( !this.db ) {
                throw new Error( 'No tengo instancia de la Base de Datos' );
            }
            
            var fechaABuscar = fecha || new Date();
            var fechaIndex   = new Date( fechaABuscar.getFullYear(), fechaABuscar.getMonth(), fechaABuscar.getDate(), 0, 0, 0, 0 ).getTime();
            
            this.db.transaction([ 'devocional' ], 'readonly' ).objectStore( 'devocional' ).get( fechaIndex ).onsuccess = function( e ) {
                if ( e.target.result ) {
                    e.target.result.fecha = new Date( e.target.result.date );
                    this.dato = e.target.result;
                }
                else {
                    this.dato = {
                        fecha     : new Date( fechaIndex ),
                        horainicio: null,
                        horafin   : null,
                        devocional: '',
                        texto     : '',
                        capitulo  : '',
                        libro     : ''
                    };
                }
                
                callback( this.dato );
            }.bind( this );
        }
    };
})();