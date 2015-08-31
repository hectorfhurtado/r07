/**
 * @author Héctor Fernando Hurtado
 */

/* global R07 */

( function() {
    
    R07.UtilidadFecha = {
        
        DIA_SEMANA: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
        MESES: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
        
        /**
         * CAmbia una fecha al formato díaSemana DD mes YYYY
         * @param     {Date} fecha
         * @return    {String}
         */
        dateAddddDDMMyyyy: function( fecha ) {
            var diaSemana = this.DIA_SEMANA[ fecha.getDay() ];
            var mes       = this.MESES[ fecha.getMonth() ];
            
            return diaSemana + ' ' + fecha.getDate() + ' ' + mes + ' ' + fecha.getFullYear();
        }
    };
})();