/**
 * @author Héctor Fernando Hurtado
 * @description La interfaz con la que realizaremos las transacciones a la BD
 */

/* global R07, indexedDB, console, Promise */

( function() {
    
    R07.Db = {
        
        /**
         * Inicializa la Base de datos y crea el objeto Devocional para guardar los devocionales
         * @param {String}   nombreDb El nombre de la base de datos
         * @param {Function} callback Le pasamos la base de datos
         */
        iniciar: function( nombreDb ) {
			
			return new Promise( function( resolver, rechazar ) {
				
				var req = indexedDB.open( nombreDb, 1 );

				req.onerror = function( e ) {
					console.log( 'R07.Db.iniciar(). Hubo un error al intentar abrir la BD' );
					rechazar( new Error( e ));
				};

				req.onupgradeneeded = function( e ) {
					var db = e.currentTarget.result;

					if ( !db.objectStoreNames.contains( 'devocional' )) {
						db.createObjectStore( 'devocional', { keyPath: 'date' });
					}
				}.bind( this );

				req.onsuccess = function( e ) {
					this.db = e.target.result;

					resolver( this );
				}.bind( this );
			}.bind( this ));
            
        },
        
        /**
         * Busca en el indexedDB registro para el devocional con la fecha suministrada
         * @param {Date}     fecha    La fecha a buscar
         * @param {Function} callback Le pasamos lo encontrado en la BD o un objeto para el devocional nuevo
         */
        trae: function( fecha ) {
			
			return new Promise( function( resolver, rechazar ) {
				
				if ( !this.db ) {
					rechazar( new Error( 'No tengo instancia de la Base de Datos' ));
					return;
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

					resolver( this.dato );
				}.bind( this );
			}.bind( this ));
            
        },
		
		/**
		 * Necesitamos guardar los cambios realizados en el devocional
		 * @param {Object} dato
		 */
		actualizaDato: function( dato ) {
			
			return new Promise( function( resolver, rechazar ) {
				
				if ( !this.db ) {
					rechazar( new Error( 'No tengo instancia de la Base de Datos' ));
					return;
				}

				dato.date = dato.fecha.getTime();

				this.db.transaction([ 'devocional' ], 'readwrite' ).objectStore( 'devocional' ).put( dato ).onerror = function( e ) {
					rechazar (console.log( e ));
				};
				
				resolver();
			}.bind( this ));
			
		}
    };
})();