/**
 * @author Héctor Fernando Hurtado
 */

/* global R07 */

( function() {
    
    var prueba =  R07.UtilidadFecha.dateAddddDDMMyyyy( new Date( 2015, 7, 31 ));
    
    console.assert( prueba === 'Lunes 31 Agosto 2015', 'Hace el cambio entre Date y fecha con día de la semana');
})();