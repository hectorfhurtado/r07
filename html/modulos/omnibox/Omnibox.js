/**
 * @author    Héctor Fernando Hurtado
 */

/* global R07, Event */

( function() {
    
    R07.Omnibox = {
        
        /**
         * Inicia le Omnibox agregando los EventListeners a los botones que contiene
         */
        inicia: function( devocional ) {
            
			return R07.Cargador.dame( 'Elementos' ).then( function( Elementos ) {
                
                return Elementos.damePorId( 'OmniboxCronometroBtn' );
				
			}).then( function( $cronometroBtn ) {
				
				// Al oprimir el mouse, hacemos como que oprimimos el cronóemtro para comenzar
				$cronometroBtn.addEventListener( 'mousedown', this._mousedownCronometroHandler, false );
					
				$cronometroBtn.addEventListener( 'click', this._clickCronometroHandler, false );

				// Luego de que termine la animación del cronómetro encogiéndose, mostramos la hora de inicio
				$cronometroBtn.addEventListener( 'transitionend', this._transitionEndHandler, false );

			}.bind( this )).then( function() {
				
				// Agregamos los Event handlers para la flecha de la izquierda
				return R07.Elementos.damePorId( 'OmniboxIzqBtn' );
			}).then( function( $botonIzq ) {
					
				$botonIzq.addEventListener( 'click', this._clickBotonIzquierdoHandler, true );
			
				// Agregamos los Event handlers para la flecha de la izquierda
				return R07.Elementos.damePorId( 'OmniboxDerBtn' );
			}.bind( this )).then( function( $botonDer ) {
					
				$botonDer.addEventListener( 'click', this._clickBotonDerechoHandler, true );
				
            }.bind( this )).then( function() {
				
				this.cambioDevocional( devocional )
				return true
			}.bind( this ));
        },
		
		_transitionEndHandler: function() {
			
			// Solo queremos que se vean las horas cuando estamos encogiendo el botón, no cuando se activa el mouseDown
			if ( this.classList.contains( 'cronometroGrande' )) {
				return;
			}

			R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas ) {
				$horas.classList.remove( 'invisible' );
			});
		},
		
		_clickCronometroHandler: function() {
			
			return R07.Cargador.dame( 'UtilidadFecha' ).then( function( Util ) {
				
				var fecha = new Date()
				
				if ( this.classList.contains( 'cronometroCorriendo' )) {

					this.classList.remove( 'cronometroGrande' );
					this.classList.remove( 'oprimido' );
					this.classList.remove( 'cronometroCorriendo' );

					R07.Omnibox.escribeHoraFin( R07.Omnibox.devocional.horafin );
				}

				if ( this.classList.contains( 'cronometroGrande' )) { // && this.classList.contains( 'cronometroCorriendo' ) === false ) {

					this.classList.remove( 'cronometroGrande' );
					this.classList.remove( 'oprimido' );
					this.classList.add( 'cronometroCorriendo' );

					R07.Omnibox.devocional.horainicio = Util.traeHoras( fecha ) + ':' + Util.traeMinutos( fecha )
					R07.Omnibox.escribeHoraInicio( R07.Omnibox.devocional.horainicio );
				}

				var evento = new CustomEvent( 'actualizaDevocional', R07.Omnibox.devocional );
				this.dispatchEvent( evento );
			}.bind( this ))
			
		},
		
		_mousedownCronometroHandler: function() {
			
			this.classList.add( 'oprimido' );
		},
		
		_clickBotonIzquierdoHandler: function() {
			var evento = new Event( 'traeFechaAnterior' );

			this.dispatchEvent( evento );
		},
		
		_clickBotonDerechoHandler: function() {
			var evento = new Event( 'traeFechaSiguiente' );

			this.dispatchEvent( evento );
		},
		
		/**
		 * Cuando hay un cambio en el devocional por la BD, debemos ajsutar el UI para reflejar el cambio
		 * @param   {Object}  devocional El devocional que viene de la BD
		 * @returns {Promise} Esta función devuelve una promesa al estar el UI basado en ellas
		 */
		cambioDevocional: function( devocional ) {
			this.devocional = devocional
			
			return this.actualizaUI( devocional )
		},
		
        /**
         * Al oprimir por primera vez el botón del reloj, el usuario puede saber a qué hora comenzó
         * a hacer su devocional
         */
        escribeHoraInicio: function( devocional ) {
            
			return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas ) {

				if ( devocional.horainicio ) {
					$horas.children[ 0 ].textContent = devocional.horainicio;
				}
				else {
					$horas.children[ 0 ].textContent = '--';
				}
			}.bind( this ));
        },
		
		/**
		 * Se necesita mostrar a qué hora temrina el devocional el usuario
		 * @param {Object} devocional
		 */
		escribeHoraFin: function( devocional ) {
                
			return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas ) {

				if ( devocional.horafin ) {
					$horas.children[ 1 ].textContent = devocional.horafin;
				}
				else {
					$horas.children[ 1 ].textContent = '--';
				}
			});
		},
        
        /**
         * Solo debe aparecer la flecha de la derecha en el omnibox cuando la fecha mostrada es diferente al día de hoy
         * @param   {Date}   fecha La fecha que viene del devocional
         * @return {Object} Promise
         */
        debeMostrarFlechaDerecha: function( fecha ) {
			
            var hoy = new Date();
            
            if ( fecha.getFullYear() === hoy.getFullYear() &&
                fecha.getMonth() === hoy.getMonth() &&
                fecha.getDate() === hoy.getDate()
            ) {
                
                return R07.Elementos.damePorId( 'OmniboxDerBtn' ).then( function( $btnDer ) {    
                    $btnDer.classList.add( 'invisible' );
                });
            }
            else {
                
                return R07.Elementos.damePorId( 'OmniboxDerBtn' ).then( function( $btnDer ) {
                    $btnDer.classList.remove( 'invisible' );
                });
            }
        },
		
		/**
		 * Cada vez que cambia el dato del devocional debemos saber si el usuario debe ver el cronómetro para comenzar con su tiempo con Dios
		 * @param {Object} devocional El objeto con el devocional de la base de datos
		 */
		actualizaUI: function( devocional ) {
			
			return R07.Elementos.damePorId( 'OmniboxCronometroBtn' ).then( function( $cronometro ) {
				
				if ( !devocional.horainicio ) {
					$cronometro.classList.add( 'cronometroGrande' );
					$cronometro.classList.remove( 'cronometroCorriendo' );
					
					return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas ) {
						$horas.classList.add( 'invisible' );
					}).then( function() {
						this.escribeHoraInicio( this.devocional )
						this.escribeHoraFin( this.devocional )
					}.bind( this ));
				}
				
				if ( !devocional.horafin ) {
					
					$cronometro.classList.remove( 'cronometroGrande' );
					$cronometro.classList.add( 'cronometroCorriendo' );
					
					return R07.Elementos.damePorId( 'OmniboxHoras' ).then( function( $horas ) {
						$horas.classList.remove( 'invisible' );
					});	// TODO(Nando): Continuar aquí con la actualización de la hora inicio y fin
				}
				
				if ( devocional.horafin ) {
					
					$cronometro.classList.remove( 'cronometroGrande' );
					$cronometro.classList.remove( 'cronometroCorriendo' );
					$cronometro.classList.add( 'inexistente' );
					
					return R07.Elementos.damePorId( 'OmniboxHoras' ).then(  function( $horas ) {
						$horas.classList.remove( 'invisible' );
					});
				}
			}.bind( this ));
		}
		
    };
})();