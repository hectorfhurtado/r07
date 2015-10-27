/**
 * @author Héctor Fernando Hurtado
 *         @description Se encarga de mostrar y manejar el editor del devocional llevando cuenta del libro y capítulo en el que va el usuario
 */

/* global R07, Promise */

( function() {
	
	R07.Editor = {
		
		inicia: function() {
			
			this._traeDOM()
		},
		
		/**
		 * Se encarga de traer el template para el módulo de Edición del Devocional
		 * @returns {Object} Promise
		 */
		_traeDOM: function() {
			
			return new Promise( function( resolve ) {
				
				var xhr = new XMLHttpRequest()
				// xhr.setRequestHeader( 'Content-type', 'text/html' )
				
				xhr.addEventListener( 'load', function() {
					
					R07.Elementos.damePorSelector( 'body' ).then( function( $body ) {
						
						$body.insertAdjacentHTML( 'beforeEnd', this.responseText )
						resolve()
					}.bind( this ))	
				})
				
				xhr.open( 'GET', 'modulos/editor/Editor.html' )
				xhr.send()
			})
		}
	}
})()