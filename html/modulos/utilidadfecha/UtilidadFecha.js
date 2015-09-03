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
        },
        
        /**Extrae la hora de una fecha, agregando un cero al número si es menor a 10
         * @param   {Date} fecha
         * @returns {String} 
         */
        traeHoras: function( fecha ) {
            var horas = fecha.getHours();
            
            return horas < 10 ? '0' + horas : '' + horas;
        },
        
        /**
         * Extrae los minutos de la fecha suministrada agregando un cero si es menor a 10
         * @param   {Date}     fecha
         * @returns {String} 
         */
        traeMinutos: function( fecha ) {
            var minutos = fecha.getMinutes();
            
            return minutos < 10 ? '0' + minutos : '' + minutos;
        }
    };
})();