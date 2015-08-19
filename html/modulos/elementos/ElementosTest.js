/**
 * @author Héctor Fernando Hurtado
 */

/* global document, R07, console */

( function() {
    
    var spanPrueba = document.createElement( 'span' );
    var ID_PRUEBA  = 'ElementosSpanPrueba';
    spanPrueba.id  = ID_PRUEBA;
    
    document.querySelector( 'body' ).appendChild( spanPrueba );
    
    R07.Elementos.damePorId( ID_PRUEBA, function( elemento ) {
        console.assert( elemento,                                               'Existe el Elemento' );
        console.assert( elemento.id === ID_PRUEBA,                              'Efectivamente es el elemento de prueba' );
        console.assert( R07.Elementos.elementosPorId[ ID_PRUEBA ] === elemento, 'Existe el elemento en el caché' );

        document.querySelector( 'body' ).removeChild( spanPrueba );
    });
})();