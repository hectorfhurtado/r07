/**
 * @author Héctor Fernando Hurtado
 * @description Pruebas para el Módulo Db
 */

/* global R07, console */

( function() {
    
    R07.Db.iniciar( 'test', function( db ) {
        
        console.assert( db, 'Existe la BD por parte del IndexedDB' );
        
        R07.Db.trae( null, function( respuesta ) {
            
            console.assert( respuesta.devocional === '', 'Cuando está vacía regresa un nuevo objeto para el devocional' );
        });
    });
})();