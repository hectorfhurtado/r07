/**
 * @author    Héctor Fernando Hurtado
 */

/* global R07, Event */

( function()
{
    R07.Omnibox =
	{
        /**
         * Inicia le Omnibox agregando los EventListeners a los botones que contiene
         */
        inicia: function( devocional )
		{
			return R07.Cargador.dame( 'Elementos' ).then( function( Elementos )
			{
                return Elementos.damePorId( 'OmniboxCronometroBtn' );
			}).then( function( $cronometroBtn )
			{
				// Al oprimir el mouse, hacemos como que oprimimos el cronóemtro para comenzar
				$cronometroBtn.addEventListener( 'mousedown', this._mousedownCronometroHandler, false );
				$cronometroBtn.addEventListener( 'click', this._clickCronometroHandler, false );

				// Luego de que termine la animación del cronómetro encogiéndose, mostramos la hora de inicio
				$cronometroBtn.addEventListener( 'transitionend', this._transitionEndHandler, false );
			}.bind( this )).then( function()
			{
				// Agregamos los Event handlers para la flecha de la izquierda
				return R07.Elementos.damePorId( 'OmniboxIzqBtn' );
			}).then( function( $botonIzq )
			{
				$botonIzq.addEventListener( 'click', this._clickBotonIzquierdoHandler, false );
			
				// Agregamos los Event handlers para la flecha de la izquierda
				return R07.Elementos.damePorId( 'OmniboxDerBtn' );
			}.bind( this )).then( function( $botonDer )
			{
				$botonDer.addEventListener( 'click', this._clickBotonDerechoHandler, false );
				
				return R07.Elementos.damePorId( 'OmniboxBusqueda' );
            }.bind( this )).then( function( $inputBusqueda )
			{
				$inputBusqueda.addEventListener( 'change', this._buscarFechaHandler, false );
				$inputBusqueda.addEventListener( 'blur',   this._buscarFechaHandler, false );
				$inputBusqueda.addEventListener( 'animationend', this._quitarAnimacionHandler, false );
				
				this.actualiza( devocional );
				
				return true;
			}.bind( this ));
        },
		
		/**
		 * Necesitamos saber cuándo mostrar la hora para que no compita por el espacion con el cronómetro cuando este está grande.
		 * Una vez termina la animación del cronóemtro puede verse la hora
		 * @returns {Object} Promise
		 */
		_transitionEndHandler: function()
		{
			if ( this.classList.contains( 'cronometroGrande' )) return;

			return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas )
			{
				$horas.classList.remove( 'invisible' );
			});
		},
		
		/**
		 * Toma en cuenta los estados en los que debe estar el cronómetro en cada click
		 * @returns {Object} Promise
		 */
		_clickCronometroHandler: function()
		{
			return R07.Cargador.dame( 'UtilidadFecha' ).then( function( Util )
			{
				var fecha = new Date();
				var evento;
				
				// Esto aplicac para el tercer click en adelante
				if ( this.classList.contains( 'busqueda' ))
				{
					this.classList.add( 'buscando' );
					
					return R07.Elementos.damePorId( 'OmniboxBusqueda' ).then( function( $input )
					{
						$input.classList.remove( 'inexistente');
						$input.focus();
						
						return $input;
					}).then( function( $input )
					{
						$input.classList.remove( 'colapsado');
					});
				}
				
				// Esto es en el segundo click
				if ( this.classList.contains( 'cronometroCorriendo' ))
				{
					this.classList.remove( 'cronometroGrande', 'oprimido', 'cronometroCorriendo' );
					this.classList.add( 'busqueda' );

					R07.Omnibox.devocional.horafin = Util.traeHoras( fecha ) + ':' + Util.traeMinutos( fecha );
					
					evento = new CustomEvent( 'actualizaDevocional', { detail: R07.Omnibox.devocional });
					this.dispatchEvent( evento );
					
					return R07.Omnibox.escribeHoraFin( R07.Omnibox.devocional.horafin );
				}

				// Esto es en el primer click
				if ( this.classList.contains( 'cronometroGrande' ))
				{
					this.classList.remove( 'cronometroGrande', 'oprimido' );
					this.classList.add( 'cronometroCorriendo' );

					R07.Omnibox.devocional.horainicio = Util.traeHoras( fecha ) + ':' + Util.traeMinutos( fecha );
					
					evento = new CustomEvent( 'actualizaDevocional', { detail: R07.Omnibox.devocional });
					this.dispatchEvent( evento );
					
					return R07.Omnibox.escribeHoraInicio( R07.Omnibox.devocional.horainicio );
				}
			}.bind( this ));
		},  // _clickCronometroHandler
		
		_mousedownCronometroHandler: function()
		{
			this.classList.add( 'oprimido' );
		},
		
		_clickBotonIzquierdoHandler: function()
		{
			var evento = new Event( 'traeFechaAnterior' );

			this.dispatchEvent( evento );
		},
		
		_clickBotonDerechoHandler: function()
		{
			var evento = new Event( 'traeFechaSiguiente' );

			this.dispatchEvent( evento );
		},
		
		/**
		 * Valida si lo ingresado en el Input para buscar fecha es correcto, de no ser así, le indica al usuario de manera visual.
		 * De estar todo correcto, lanza un evento para que controlador maestro traiga la información solicitada
		 */
		_buscarFechaHandler: function()
		{
			if ( this.value === '' ) return;
			
			if ( /\d{4}\-\d{1,2}\-\d{1,2}/.test( this.value ))
			{
				var fechaSplit = this.value.split( '-' );
				var evento     = new CustomEvent( 'traeFecha', { detail: new Date( fechaSplit[ 0 ], fechaSplit[ 1 ], fechaSplit[ 2 ])});
				
				this.dispatchEvent( evento );
				
				this.value = '';
			}
			else
			{
				this.value = '';
				
				this.classList.add( 'error' );
			}
		},
		
		_quitarAnimacionHandler: function()
		{
			this.classList.remove( 'error' );
		},
		
		
		/**
		 * Cuando hay un cambio en el devocional por la BD, debemos ajustar el UI para reflejar el cambio y la referencia que tenemos del devocional
		 * @param   {Object}  devocional El devocional que viene de la BD
		 * @returns {Promise} Esta función devuelve una promesa al estar el UI basado en ellas
		 */
		actualiza: function( devocional )
		{
			this.devocional = devocional;
			
			return this.actualizaUI( devocional );
		},
		
        /**
         * Al oprimir por primera vez el botón del reloj, el usuario puede saber a qué hora comenzó
         * a hacer su devocional
         * @param {String} La hora de inicio
         * @return {Object} Promise
         */
        escribeHoraInicio: function( horainicio )
		{
			return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas )
			{
				$horas.children[ 0 ].textContent = horainicio ? horainicio : '--';
			});
        },
		
		/**
		 * Se necesita mostrar a qué hora temrina el devocional el usuario
		 * @param {Object} devocional
		 */
		escribeHoraFin: function( horafin )
		{
			return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas )
			{
				$horas.children[ 1 ].textContent = horafin ? horafin : '--';
			});
		},
        
        /**
         * Solo debe aparecer la flecha de la derecha en el omnibox cuando la fecha mostrada es diferente al día de hoy
         * @param   {Date}   fecha La fecha que viene del devocional
         * @return {Object} Promise
         */
        debeMostrarFlechaDerecha: function( fecha )
		{
            var hoy = new Date();
			
            if ( fecha.getFullYear() === hoy.getFullYear() &&
                 fecha.getMonth()    === hoy.getMonth() &&
                 fecha.getDate()     === hoy.getDate()
               )
			{
                return R07.Elementos.damePorId( 'OmniboxDerBtn' ).then( function( $btnDer )
				{    
                    $btnDer.classList.add( 'invisible' );
                });
            }
            else
			{
                return R07.Elementos.damePorId( 'OmniboxDerBtn' ).then( function( $btnDer )
				{
                    $btnDer.classList.remove( 'invisible' );
                });
            }
        },
		
		/**
		 * Cada vez que cambia el dato del devocional debemos saber si el usuario debe ver el cronómetro para comenzar con su tiempo con Dios
		 * @param {Object} devocional El objeto con el devocional de la base de datos
		 * @return {Object} Promise
		 */
		actualizaUI: function( devocional )
		{
			return R07.Elementos.damePorId( 'OmniboxCronometroBtn' ).then( function( $cronometro )
			{
				// para cuando no hay datos en el devocional
				if ( !devocional.horainicio )
				{
					$cronometro.classList.add( 'cronometroGrande' );
					$cronometro.classList.remove( 'oprimido', 'cronometroCorriendo', 'busqueda', 'buscando' );
					
					return this._actualizaHorasYBusqueda( devocional, { horaVisible: false });
				}
				// Para cuando hay datos en hora de inicio, pero no hora de fin
				if ( !devocional.horafin )
				{
					$cronometro.classList.add( 'cronometroCorriendo' );
					$cronometro.classList.remove( 'cronometroGrande', 'busqueda', 'buscando' );
					
					return this._actualizaHorasYBusqueda( devocional, { horaVisible: true });
				}
				// Para cuando hay datos en hora de fin
				$cronometro.classList.add( 'busqueda' );
				$cronometro.classList.remove( 'cronometroGrande', 'cronometroCorriendo', 'oprimido', 'buscando' );

				return this._actualizaHorasYBusqueda( devocional, { horaVisible: true });
			}.bind( this ));
		},
		
		/**
		 * Muestra o esconde la hora de incio y fin según el valor del devocional y opcion
		 * Esconde siempre el input de búsqueda y le adiciona o quita las clases por defecto que no debe tener
		 * @param   {Object} devocional El devocional 'actualizado'
		 * @param   {Object} opcion     Contiene si debe verde o no la hora de inicio y fin, lo ponemos en objeto para que se sepa qué se hace al invocar la función
		 * @returns {Object} Promise
		 */
		_actualizaHorasYBusqueda: function( devocional, opcion )
		{
			return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas )
			{
				if ( opcion.horasVisible )  $horas.classList.remove( 'invisible' );
				else 						$horas.classList.add( 'invisible' );
			}).then( function()
			{
				this.escribeHoraInicio( devocional.horainicio );
				this.escribeHoraFin( devocional.horafin );
				this.debeMostrarFlechaDerecha( devocional.fecha );
			}.bind( this )).then( function()
			{
				return R07.Elementos.damePorId( 'OmniboxBusqueda' );
			}).then( function( $input )
			{
				$input.classList.remove( 'error' );
				
				return $input.classList.add( 'colapsado', 'inexistente' );
			});
		}
    };
})();