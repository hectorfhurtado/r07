/**
 * @author Héctor Fernando Hurtado
 *         @description Se encarga de mostrar y manejar el editor del devocional llevando cuenta del libro y capítulo en el que va el usuario
 */

/* global R07, Promise */

( function() {
	
	R07.Editor = {
		
		LIBROS: [
			'Génesis',     'Éxodo',        'Levítico',         'Números',          'Deuteronomio',    'Josué',        'Jueces',
			'Rut',         '1 Samuel',     '2 Samuel',         '1 Reyes',          '2 Reyes',         '1 Crónicas',   '2 Crónicas',
			'Edras',       'Nehemías',     'Ester',            'Job',              'Salmos',          'Proverbios',   'Eclesiastés',
			'Cantares',    'Isaías',       'Jeremías',         'Lamentaciones',    'Ezequiel',        'Daniel',       'Oseas',
			'Joel',        'Amós',         'Abdías',           'Jonás',            'Miqueas',         'Nahúm',        'Habacuc',
			'Sofonías',    'Hageo',        'Zacarías',         'Malaquías',        'Mateo',           'Marcos',       'Lucas',
			'Juan',        'Hechos',       'Romanos',          '1 Corintios',      '2 Corintios',     'Gálatas',      'Efesios',
			'Filipenses',  'Colosenses',   '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo',       '2 Timoteo',    'Tito',
			'Filemón',     'Hebreos',      'Santiago',         '1 Pedro',          '2 Pedro',         '1 Juan',       '2 Juan',
			'3 Juan',      'Judas',        'Apocalipsis'
		],
		
		CAPITULOS: [
			50,  40,  27,  36,  34,  24,  21,
			4,   31,  24,  31,  25,  29,  36,
			10,  13,  10,  42,  150, 31,  12,
			8,   66,  52,  5,   48,  12,  14,
			3,   9,   1,   4,   7,   3,   3,
			3,   2,   14,  4,   28,  16,  24,
			21,  28,  16,  16,  13,  6,   6,
			4,   4,   5,   3,   6,   4,   3,
			1,   13,  5,   5,   3,   5,   1,
			1,   1,   22
		],
		
		inicia: function() {
			
			this._traeDOM()
				.then( this._arrancaInputLibros.bind( this ))
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
		},
		
		/**
		 * Se encarga de escribir en el Input de libros el libro en el que va el usuario.
		 * La primera vez escribe Génesis que es el primer libro
		 * @private
		 * @return	{Promise}
		 */
		_arrancaInputLibros: function () {
			
			if ( !this.devocional || !this.devocional.libro ) {
				
				return R07.Elementos.damePorId( 'EditorLibro' ).then( function( $libro ) {
					
					$libro.value = this.LIBROS[ 0 ]
				}.bind( this ))
			}
		}
	}
})()