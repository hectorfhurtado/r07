/**
 * @author Héctor Fernando Hurtado
 *         @description Se encarga de mostrar y manejar el editor del devocional llevando cuenta del libro y capítulo en el que va el usuario
 */

/* global R07, Promise */

( function()
{
	R07.Editor =
	{
		devocional: {},
		
		LIBROS:
		[
			'Génesis',     'Éxodo',        'Levítico',         'Números',          'Deuteronomio',    'Josué',        'Jueces',
			'Rut',         '1 Samuel',     '2 Samuel',         '1 Reyes',          '2 Reyes',         '1 Crónicas',   '2 Crónicas',
			'Esdras',       'Nehemías',     'Ester',            'Job',              'Salmos',          'Proverbios',   'Eclesiastés',
			'Cantares',    'Isaías',       'Jeremías',         'Lamentaciones',    'Ezequiel',        'Daniel',       'Oseas',
			'Joel',        'Amós',         'Abdías',           'Jonás',            'Miqueas',         'Nahúm',        'Habacuc',
			'Sofonías',    'Hageo',        'Zacarías',         'Malaquías',        'Mateo',           'Marcos',       'Lucas',
			'Juan',        'Hechos',       'Romanos',          '1 Corintios',      '2 Corintios',     'Gálatas',      'Efesios',
			'Filipenses',  'Colosenses',   '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo',       '2 Timoteo',    'Tito',
			'Filemón',     'Hebreos',      'Santiago',         '1 Pedro',          '2 Pedro',         '1 Juan',       '2 Juan',
			'3 Juan',      'Judas',        'Apocalipsis'
		],
		
		CAPITULOS:
		[
			50,  40,  27,  36,  34,  24,  21,
			4,   31,  24,  22,  25,  29,  36,
			10,  13,  10,  42,  150, 31,  12,
			8,   66,  52,  5,   48,  12,  14,
			3,   9,   1,   4,   7,   3,   3,
			3,   2,   14,  4,   28,  16,  24,
			21,  28,  16,  16,  13,  6,   6,
			4,   4,   5,   3,   6,   4,   3,
			1,   13,  5,   5,   3,   5,   1,
			1,   1,   22
		],
		
		inicia: function()
		{
			return this._traeDOM()
				.then( this._arrancaInputCapitulos.bind( this ))
				.then( this._arrancaInputLibros.bind( this ))
				.then( this._arrancaListeners.bind( this ))
				.then( this._iniciaDataList.bind( this ));
		},
		
		/**
		 * Se encarga de traer el template para el módulo de Edición del Devocional
		 * @returns {Object} Promise
		 */
		_traeDOM: function()
		{
			return new Promise( function( resolve )
			{
				var xhr          = new XMLHttpRequest();
				xhr.responseType = 'text';
				
				xhr.addEventListener( 'load', xhrHandler, false );
				
				function xhrHandler()
				{
					R07.Elementos.damePorSelector( 'body' ).then( function( $body )
					{
						$body.insertAdjacentHTML( 'beforeEnd', this.responseText );
						
						xhr.removeEventListener( 'load', xhrHandler, false );
						xhr = null;
						
						resolve();
					}.bind( this ));
				}
				
				xhr.open( 'GET', 'modulos/editor/Editor.html' );
				xhr.send();
			});
		},
		
		/**
		 * Se encarga de escribir en el Input de libros el libro en el que va el usuario.
		 * La primera vez escribe Génesis que es el primer libro
		 * @private
		 * @return	{Promise}
		 */
		_arrancaInputLibros: function()
		{
			var libro = this.LIBROS[ 0 ];
			
			if ( !this.devocional || !this.devocional.libro )
			{
				if ( this.ultimoLibro ) libro = this.ultimoLibro.libro;
				
				return R07.Elementos.damePorId( 'EditorLibro' ).then( function( $libro )
				{
					$libro.value = libro;
					libro        = null;
				}.bind( this ));
			}
		},
		
		/**
		 * Cuando no hay información de capítulo, debe mostrar el primero
		 * @private
		 * @return {Promise}
		 */
		_arrancaInputCapitulos: function()
		{
			var capitulo    = '1';
			var numCapitulo = null;
			var indiceLibro = null;
			
			if ( !this.devocional || !this.devocional.capitulo )
			{
				this.ultimoLibro = JSON.parse( localStorage.getItem( 'ultimoCapitulo' ));
				
				if ( this.ultimoLibro )
				{
					numCapitulo = parseInt( this.ultimoLibro.capitulo, 10 ) + 1;
					indiceLibro = this.LIBROS.indexOf( this.ultimoLibro.libro );
					
					if ( this.CAPITULOS[ indiceLibro ] < numCapitulo )
					{
						capitulo = '1';
						this.ultimoLibro.libro = (( indiceLibro + 1 ) < this.LIBROS.length ) ? this.LIBROS[ indiceLibro + 1 ] : this.LIBROS[ 0 ];
					}
					else
					{
						capitulo = `${ numCapitulo }`;
					}
				}
				
				return R07.Elementos.damePorId( 'EditorCapitulo' ).then( function( $capitulo )
				{
					$capitulo.value = capitulo;
				}.bind( this ));
			}
		},	// _arrancaInputCapitulos
		
		/**
		 * Guarda la información de la lectura en el browser para arrancar la próxima vez con esta información
		 * @return	{Promise}
		 * @private
		 */
		_guardar: function()
		{
			return Promise.all([
				R07.Elementos.damePorId( 'EditorLibro' ),
				R07.Elementos.damePorId( 'EditorCapitulo' ),
			]).then( function( $elementos )
			{
				var info =
				{
					libro   : $elementos[ 0 ].value,
					capitulo: $elementos[ 1 ].value
				};
				
				localStorage.setItem( 'ultimoCapitulo', JSON.stringify( info ));
			});
		},
		
		/**
		 * Al momento de oprimir el botón de guardar es necesario actualizar la información en la BD
		 * @returns {Object} Promise
		 */
		_arrancaListeners: function()
		{
			return Promise.all([
				R07.Elementos.damePorId( 'EditorGuardarBtn' ),
				R07.Elementos.damePorId( 'EditorCancelarBtn' ),
				R07.Elementos.damePorId( 'EditorLibro' ),
			]).then( function( $elementos )
			{
				var $botonGuardar = $elementos[ 0 ];
				$botonGuardar.addEventListener( 'click', this._clickBotonGuardarHandler.bind( this, $botonGuardar ), false );
				
				var $botonCancelar = $elementos[ 1 ];
				$botonCancelar.addEventListener( 'click', this._clickBotonCancelarHandler.bind( this, $botonCancelar ), false );
				
				var $inputLibros    = $elementos[ 2 ]
				$inputLibros.addEventListener( 'change', this._changeInputLibrosHandler, false )
				
				// Quitamos referencia a los objetos del DOM
				$botonGuardar = $botonCancelar = $inputLibros = null
			}.bind( this ));
		},
		
		_clickBotonGuardarHandler: function( $botonGuardar )
		{
			this._actualizaDevocional().then(function()
			{
				var evento = new CustomEvent( 'actualizaDevocional', { detail: this.devocional });
				$botonGuardar.dispatchEvent( evento );
				
				this._lanzaEventoSaleEditor( $botonGuardar );
			}.bind( this ));
			
			this._guardar();
		},
		
		_clickBotonCancelarHandler: function( $botonCancelar, e )
		{
			e.stopPropagation();
			this._lanzaEventoSaleEditor( $botonCancelar );
		},
		
		_changeInputLibrosHandler: function()
		{
			R07.Elementos.damePorId( 'EditorCapitulo' ).then( function( $inputCapitulos )
			{
				$inputCapitulos.value = '1'
			})
		},
		
		_lanzaEventoSaleEditor: function( $elemento )
		{
			$elemento.dispatchEvent( new CustomEvent( 'saleEditor' ));
		},
		
		/**
		 * Actualizar la referencia al devocional para poder lanzar la actualización con la información de los campos del devocional
		 * @returns {Object} Promise
		 */
		_actualizaDevocional: function()
		{
			return Promise.all([
				R07.Elementos.damePorId( 'EditorLibro' ),
				R07.Elementos.damePorId( 'EditorCapitulo' ),
				R07.Elementos.damePorId( 'EditorDevocional' )
			]).then( function( $elementos )
			{
				R07.Editor.devocional.libro      = $elementos[ 0 ].value;
				R07.Editor.devocional.capitulo   = $elementos[ 1 ].value;
				R07.Editor.devocional.devocional = $elementos[ 2 ].value.trim();
			});
		},
		
		/**
		 * Para la lista que tenemos definida de libros, llenamos el datalist para que el usuario reciba ayuda por si no se acuerda cómo se llama un libro
		 * @returns {Object} Promise
		 * @private
		 */
		_iniciaDataList: function()
		{
			return R07.Elementos.damePorId( 'EditorLibrosList' ).then( function( $lista )
			{
				var fragmente = document.createDocumentFragment()
				
				this.LIBROS.forEach( function( libro )
				{
					var opcion = document.createElement( 'option' );
					opcion.value = libro;
					
					fragmente.appendChild( opcion )
				});
				
				$lista.appendChild( fragmente )
			}.bind( this ));
		},
		
		/**
		 * Se encarga de actualizar los datos del UI con el objeto devocional suministrado
		 * @param   {Object} devocional 
		 * @returns {Object} Promise
		 */
		actualizaDevocional: function( devocional )
		{
			this.devocional = devocional;

			return Promise.all([
				R07.Elementos.damePorId( 'EditorLibro' ),
				R07.Elementos.damePorId( 'EditorCapitulo' ),
				R07.Elementos.damePorId( 'EditorDevocional' )
			]).then( function( $elementos )
			{
				if ( devocional.libro )      $elementos[ 0 ].value = devocional.libro;
				if ( devocional.capitulo )   $elementos[ 1 ].value = devocional.capitulo;
				
				$elementos[ 2 ].value = devocional.devocional ? devocional.devocional : '';
			});
		}
	};
})();
