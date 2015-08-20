/**
 * @author Héctor Fernando Hurtado
 * @description Pruebas para el Módulo Db
 */

/* global R07 */

( function() {
    
    R07.Db.iniciar( 'test', function( db ) {
        
        console.assert( db, 'Existe la BD por parte del IndexedDB' );
    });
})();