/**
 * @author Héctor Fernando Hurtado
 */

/* global R07, console */

( function()
{
	R07.Pruebas_DEBUG.then( function()
	{
		var prueba =  R07.UtilidadFecha.dateAddddDDMMyyyy( new Date( 2015, 7, 31 ));
		
		console.assert( prueba === 'Lunes 31 Agosto 2015', 'Hace el cambio entre Date y fecha con día de la semana');
		
		prueba = R07.UtilidadFecha.traeHoras( new Date( 2015, 7, 31, 5, 15 ));
		
		console.assert( prueba === '05', 'Trae la hora de la fecha suministrada' );
		
		prueba = R07.UtilidadFecha.traeMinutos( new Date( 2015, 7, 31, 5, 15 ));
		
		console.assert( prueba === '15', 'Trae los minutos de la fecha suministrada' );
		
		console.info( 'Termina pruebas para UtilidadFecha.js' );
	});
})();