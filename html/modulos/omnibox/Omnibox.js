/**
 * @author    Héctor Fernando Hurtado
 */

/* global R07, Event */

( function() {
    
    R07.Omnibox = {
        
        /**
         * Inicia le Omnibox agregando los EventListeners a los botones que contiene
         */
        inicia: function() {
            
            R07.Cargador.dame( 'Elementos', function( Elementos ) {
                
                Elementos.damePorId( 'OmniboxCronometroBtn', function( $cronometroBtn ) {
					$cronometroBtn.classList.add( 'cronometroGrande' );
                    
					// Luego de que termine la animación del cronómetro encogiéndose, mostramos la hora de inicio
					$cronometroBtn.addEventListener( 'transitionend', function() {

						// cuando oprimimos las flechas para cambiar de día, corre este eventHandler, por lo que no queremos que
						// se vea la hora con un dato errado
						if ( this.classList.contains( 'cronometroGrande' )) {
							return;
						}

						Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
							$horas.classList.remove( 'invisible' );
						});
					}, false );
					
					// TODO(nando): Al estar corriendo el cronómetro, debe poner la hora de fin
                    $cronometroBtn.addEventListener( 'click', function() {
						
						if ( this.classList.contains( 'cronometroCorriendo' )) {
							this.classList.remove( 'cronometroGrande' );
							this.classList.remove( 'oprimido' );
							this.classList.remove( 'cronometroCorriendo' );
							
							R07.Omnibox.escribeHoraFin( R07.DEVOCIONAL );
						}
						
						if ( this.classList.contains( 'cronometroGrande' ) && this.classList.contains( 'cronometroCorriendo' ) === false ) {
							
							this.classList.remove( 'cronometroGrande' );
							this.classList.remove( 'oprimido' );
							this.classList.add( 'cronometroCorriendo' );

						}
						
						var evento = new Event( 'actualizaDevocional' );
						this.dispatchEvent( evento );
                        
                    }, false );
					
					// Al oprimir el mouse, hacemos como que oprimimos el cronóemtro para comenzar
					$cronometroBtn.addEventListener( 'mousedown', function() {    
						this.classList.add( 'oprimido' );
					}, false );
					
                });
                
				// Agregamos los Event handlers para la flecha de la izquierda
				Elementos.damePorId( 'OmniboxIzqBtn', function( $botonIzq ) {
					
					$botonIzq.addEventListener( 'click', function() {
						var evento = new Event( 'traeFechaAnterior' );
						
						this.dispatchEvent( evento );
					}, true );
				});
				
				// Agregamos los Event handlers para la flecha de la izquierda
				Elementos.damePorId( 'OmniboxDerBtn', function( $botonDer ) {
					
					$botonDer.addEventListener( 'click', function() {
						var evento = new Event( 'traeFechaSiguiente' );
						
						this.dispatchEvent( evento );
					}, true );
				});
            });
        },
        
        /**
         * Al oprimir por primera vez el botón del reloj, el usuario puede saber a qué hora comenzó
         * a hacer su devocional
         * @para    {Object}    devocional  Es el objeto que está guardado en la BD con la info del devocional
         */
        escribeHoraInicio: function( devocional ) {
            
            var fecha = new Date();
            
            R07.Cargador.dame( 'UtilidadFecha', function( util ) {
                
                R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
                    
                    if ( devocional.horainicio ) {
                        $horas.children[ 0 ].textContent = devocional.horainicio;
                    }
					else {
                    	$horas.children[ 0 ].textContent = devocional.horainicio = util.traeHoras( fecha ) + ':' + util.traeMinutos( fecha );
					}
                });
            });
        },
		
		/**
		 * Se necesita mostrar a qué hora temrina el devocional el usuario
		 * @param {Object} devocional
		 */
		escribeHoraFin: function( devocional ) {
			var fecha = new Date();
			
			R07.Cargador.dame( 'UtilidadFecha', function( util ) {
                
                R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
                    
                    if ( devocional.horafin ) {
                        $horas.children[ 1 ].textContent = devocional.horafin;
                    }
					else if ( devocional.horainicio && devocional.horafin === null ) {
                    	$horas.children[ 1 ].textContent = devocional.horafin = util.traeHoras( fecha ) + ':' + util.traeMinutos( fecha );
					}
					else {
						$horas.children[ 1 ].textContent = '--:--';
					}
                });
            });
		},
        
        /**
         * Solo debe aparecer la flecha de la derecha en el omnibox cuando la fecha mostrada es diferente al día de hoy
         * @param   {Date}  fecha   La fecha que viene del devocional
         */
        debeMostrarFlechaDerecha: function( fecha ) {
			
            var hoy = new Date();
            
            if ( fecha.getFullYear() === hoy.getFullYear() &&
                fecha.getMonth() === hoy.getMonth() &&
                fecha.getDate() === hoy.getDate()
            ) {
                
                R07.Elementos.damePorId( 'OmniboxDerBtn', function( $btnDer ) {    
                    $btnDer.classList.add( 'invisible' );
                });
            }
            else {
                
                R07.Elementos.damePorId( 'OmniboxDerBtn', function( $btnDer ) {
                    $btnDer.classList.remove( 'invisible' );
                });
            }
        },
		
		/**
		 * Cada vez que cambia el dato del devocional debemos saber si el usuario debe ver el cronómetro para comenzar con su tiempo con Dios
		 * @param {Object} devocional El objeto con el devocional de la base de datos
		 */
		verificaCronometro: function( devocional ) {
			
			R07.Elementos.damePorId( 'OmniboxCronometroBtn', function( $cronometro ) {
				
				if ( !devocional.horainicio ) {
					$cronometro.classList.add( 'cronometroGrande' );
					$cronometro.classList.remove( 'cronometroCorriendo' );
					
					R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
						$horas.classList.add( 'invisible' );
					});
					
					return;
				}
				
				if ( !devocional.horafin ) {
					
					$cronometro.classList.remove( 'cronometroGrande' );
					$cronometro.classList.add( 'cronometroCorriendo' );
					
					R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
						$horas.classList.remove( 'invisible' );
					});
					
					return;
				}
				
				if ( devocional.horafin ) {
					
					$cronometro.classList.remove( 'cronometroGrande' );
					$cronometro.classList.remove( 'cronometroCorriendo' );
					$cronometro.classList.add( 'inexistente' );
					
					R07.Elementos.damePorId( 'OmniboxHoras', function( $horas ) {
						$horas.classList.remove( 'invisible' );
					});
					
					return;
				}
				
			});
		}
    };
})();