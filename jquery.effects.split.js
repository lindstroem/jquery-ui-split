/*
 * testoff
 */

var defaultOptions = {
	easing : 'linear', // jQuery easing, The easing to use
	distance : 1, // move element to/from where * parent.height()
	direction : 'bottom', // the direction the fade should use.
	reverse : false, // Boolean
	random : false, // float
	interval : false, // Number, miliseconds before each piece animation
						// (optional)
	fade : true, // Boolean, indicates if the pieces should fade.
	rows : 5, // Number of rows
	cols : 5, // Number of rows
	crop : false
// Boolean, show pieces outside of the main element.
};

/** Do not use direction * */
$.effects.splitExplode = function( o, show ) {
	var docHeight = $( document ).height(), docWidth = $( document ).width();

	/* show is either 1 or null */
	show = show || 0;

	var options = o.options = $
			.extend(
					{},
					defaultOptions,
					o.options,
					{

						// piece animate function
						animate : function( interval, duration, x, y,
								parentCoords ) {
							var offset = this.offset(), height = this
									.outerHeight(), width = this.outerWidth(), distance = options.distance * 2, properties = {
								opacity : show ? 1 : 0
							}, maxTop = docHeight - height, maxLeft = docWidth
									- width, delay = 0, randomX = 0, randomY = 0;

							/* sets the offset relative to the parent offset */
							offset = {
								top : offset.top - parentCoords.top,
								left : offset.left - parentCoords.left
							};

							this.css( 'opacity', show ? 0 : '' );

							if ( options.random ) {
								var seed = ( Math.random() * options.random )
										+ Math.max( 1 - options.random, 0 );
								distance *= seed;
								duration *= seed;

								// To syncronize, give each piece an appropriate
								// delay so they end together
								// delay = ((show && options.sync) || (!show &&
								// !options.sync)) ? (options.duration -
								// duration) : 0;

								randomX = Math.random() - 0.5;
								randomY = Math.random() - 0.5;
							}

							var distanceY = ( ( parentCoords.height - height ) / 2 - height
									* y ), distanceX = ( ( parentCoords.width - width ) / 2 - width
									* x ), distanceXY = Math.sqrt( Math.pow(
									distanceX, 2 )
									+ Math.pow( distanceY, 2 ) ), offsetTo = {
								top : parseInt( offset.top - distanceY
										* distance + distanceXY * randomY ),
								left : parseInt( offset.left - distanceX
										* distance + distanceXY * randomX )
							};

							if ( show ) {
								this.css( offsetTo );
								properties.top = offset.top;
								properties.left = offset.left;
							} else {
								this.css( offset );
								properties.top = offsetTo.top;
								properties.left = offsetTo.left;
							}

							this.delay( delay ).animate( properties, duration,
									options.easing );
						}
					} );
	/* sends the options to the split animation */
	$.effects.splitAnim.call( this, o, show );
};

$.effects.splitConverge = function( o ) {
	$.effects.splitExplode.call( this, o, 1 );
};

$.effects.splitPinwheel = function( o, show ) {
	/* show is either 1 or null */
	show = show || 0;

	var options = o.options = $
			.extend(
					{},
					defaultOptions,
					o.options,
					{

						// piece animate function
						animate : function( interval, duration, x, y,
								parentCoords ) {
							var random = options.random ? Math
									.abs( options.random ) : 0, randomDelay = Math
									.random()
									* duration, uniformDelay = ( options.reverse ) ? ( ( ( options.rows + options.cols ) - ( x + y ) ) * interval )
									: ( ( x + y ) * interval ), delay = randomDelay
									* Math.abs( options.random )
									+ Math.max( 1 - Math.abs( options.random ),
											0 ) * uniformDelay, width = this
									.outerWidth(), height = this.outerHeight(), rowOdd = !( y % 2 ), colOdd = !( x % 2 ), startProperties = this
									.offset(), properties = {}, distanceX = options.distance
									* parentCoords.width, distanceY = options.distance
									* parentCoords.height;

							startProperties = {
								top : startProperties.top - parentCoords.top,
								left : startProperties.left - parentCoords.left,
								width : width,
								height : height
							};

							properties = $.extend( {}, startProperties );

							// If we have only rows or columns, ignore the other
							// dimension
							if ( options.cols == 1 ) {
								colOdd = !rowOdd;
							} else if ( options.rows == 1 ) {
								rowOdd = colOdd;
							}

							if ( options.fade ) {
								properties.opacity = show ? 1 : 0;
								startProperties.opacity = 1;
							}

							if ( colOdd ) {
								if ( rowOdd ) {
									properties.top = properties.top + height
											* options.distance;
								} else {
									properties.left = properties.left + width
											* options.distance;
								}
							}

							if ( colOdd != rowOdd ) {
								properties.width = width
										* ( 1 - options.distance );
							} else {
								properties.height = height
										* ( 1 - options.distance );
							}
							;

							if ( show ) {
								this.css( properties );
								if ( options.fade )
									this.css( 'opacity', 0 );
								properties = startProperties;
							}

							this.delay( delay ).animate( properties, duration,
									options.easing );

						}
					} );
	/* sends the options to the split animation */
	$.effects.splitAnim.call( this, o, show );
};

$.effects.splitUnPinwheel = function( o ) {
	$.effects.splitPinwheel.call( this, o, 1 );
};

$.effects.splitDisintegrate = function( o, show ) {
	var docHeight = $( document ).height(), docWidth = $( document ).width();

	/* show is either 1 or null */
	show = show || 0;

	var options = o.options = $
			.extend(
					{},
					defaultOptions,
					o.options,
					{

						// piece animate function
						animate : function( interval, duration, x, y,
								parentCoords ) {

							var random = options.random ? Math
									.abs( options.random ) : 0, randomDelay = Math
									.random()
									* ( options.rows + options.cols )
									* interval, uniformDelay = ( options.reverse || options.distance < 0 ) ? ( ( x + y ) * interval )
									: ( ( ( options.rows + options.cols ) - ( x + y ) ) * interval ), delay = randomDelay
									* random
									+ Math.max( 1 - random, 0 )
									* uniformDelay, offset = this.offset(), width = this
									.outerWidth(), height = this.outerHeight(), maxTop = docHeight
									- height, maxLeft = docWidth - width, properties = offset, top, left;

							offset = {
								top : offset.top - parentCoords.top,
								left : offset.left - parentCoords.left
							};

							properties = $.extend( {}, offset );
							if ( options.fade ) {
								properties.opacity = show ? 1 : 0;
								this.css( 'opacity', show ? 0 : '' );
							}

							if ( options.direction.indexOf( 'bottom' ) !== -1 ) {
								top = offset.top + parentCoords.height
										* options.distance;
								top = top > maxTop ? maxTop : top;
							} else if ( options.direction.indexOf( 'top' ) !== -1 ) {
								top = offset.top - parentCoords.height
										* options.distance;
								top = top < 0 ? 0 : top;
							}

							if ( options.direction.indexOf( 'right' ) !== -1 ) {
								left = offset.left + parentCoords.width
										* options.distance;
								left = left > maxLeft ? maxLeft : left;
							} else if ( options.direction.indexOf( 'left' ) !== -1 ) {
								left = offset.left - parentCoords.width
										* options.distance;
								left = left < 0 ? 0 : left;
							}

							if ( options.direction.indexOf( 'right' )
									|| options.direction.indexOf( 'left' ) )
								show ? this.css( 'left', left )
										: properties.left = left;
							if ( options.direction.indexOf( 'top' )
									|| options.direction.indexOf( 'bottom' ) )
								show ? this.css( 'top', top )
										: properties.top = top;

							this.delay( delay ).animate( properties, duration,
									options.easing );
						}
					} );
	/* sends the options to the split animation */
	$.effects.splitAnim.call( this, o, show );
};

$.effects.splitBuild = function( o ) {
	$.effects.splitDisintegrate.call( this, o, 1 );
};

$.effects.splitShear = function( o, show ) {
	var docHeight = $( document ).height(), docWidth = $( document ).width();
	/* show is either 1 or null */
	show = show || 0;

	var options = o.options = $
			.extend(
					{},
					defaultOptions,
					o.options,
					{

						// piece animate function
						animate : function( interval, duration, x, y,
								parentCoords ) {
							var random = options.random ? Math
									.abs( options.random ) : 0, randomDelay = Math
									.random()
									* duration, uniformDelay = ( options.reverse ) ? ( ( ( options.rows + options.cols ) - ( x + y ) ) * interval )
									: ( ( x + y ) * interval ), delay = randomDelay
									* Math.abs( options.random )
									+ Math.max( 1 - Math.abs( options.random ),
											0 ) * uniformDelay, rowOdd = !( y % 2 ), colOdd = !( x % 2 ), offset = this
									.offset(), properties = offset, distanceX = options.distance
									* parentCoords.width, distanceY = options.distance
									* parentCoords.height;

							offset = {
								top : offset.top - parentCoords.top,
								left : offset.left - parentCoords.left
							};

							properties = $.extend( {}, offset );

							this.css( 'opacity', show ? 0 : '' );

							// If we have only rows or columns, ignore the other
							// dimension
							if ( options.cols == 1 ) {
								colOdd = rowOdd;
							} else if ( options.rows == 1 ) {
								rowOdd = !colOdd;
							}

							if ( colOdd == rowOdd ) {
								properties.left = !colOdd ? offset.left
										- distanceX : offset.left + distanceX;
							} else {
								properties.top = !colOdd ? offset.top
										- distanceY : offset.top + distanceY;
							}

							if ( show ) {
								// Bug: it should work just by switching
								// properties and offset but somehow this won't
								// work. therefore we takes and configure a new
								// offset.
								var newOffset = this.offset();
								newOffset = {
									top : newOffset.top - parentCoords.top,
									left : newOffset.left - parentCoords.left
								};
								this.css( properties );
								properties = newOffset;
							}

							properties.opacity = show ? 1 : 0;

							this.delay( delay ).animate( properties, duration,
									options.easing );

						}
					} );

	/* sends the options to the split animation */
	$.effects.splitAnim.call( this, o, show );

};

$.effects.splitUnShear = function( o ) {
	$.effects.splitShear.call( this, o, 1 );
};

/*******************************************************************************
 * Don't use fade and direction TODO: make the fading comming from the
 * options.direction.
 ******************************************************************************/
$.effects.blockSplitFadeOut = function( o, show ) {
	var docHeight = $( document ).height(), docWidth = $( document ).width();
	/* show is either 1 or null */
	show = show || 0;

	/* Internal callback to run before animation has started */
	function beforeAnimate( ) {
		this.css( {
			opacity : show ? 0 : 1
		} );
	}

	var options = o.options = $
			.extend(
					{},
					defaultOptions,
					o.options,
					{
						beforeAnimate : beforeAnimate,

						// animation piece function
						animate : function( interval, duration, x, y,
								parentCoords ) {
							options.random = options.random || 0;
							var randomDelay = Math.random() * duration, uniformDelay = ( options.reverse ) ? ( ( ( options.rows + options.cols ) - ( x + y ) ) * interval )
									: ( ( x + y ) * interval ), delay = randomDelay
									* Math.abs( options.random )
									+ Math.max( 1 - Math.abs( options.random ),
											0 ) * uniformDelay;

							// make the animation
							this.delay( delay ).animate( {
								opacity : show
							}, duration, options.easing );
						}
					} );
	/* sends the options to the split animation */
	$.effects.splitAnim.call( this, o, show );
};

$.effects.blockSplitFadeIn = function( o ) {
	$.effects.blockSplitFadeOut.call( this, o, 1 );
};

$.effects.splitAnim = function( o, show ) {
	var options = o.options;

	// To ensure that the element is hidden/shown correctly
	if ( show ) {
		this.css( 'opacity', 0 ).show();
	} else {
		this.css( 'opacity', 1 ).show();
	}

	return this
			.queue( function( ) {
				var $this = $( this ), height = $this.outerHeight(), width = $this
						.outerWidth(), position = $this.offset(), interval = options.interval
						|| o.duration / ( options.rows + options.cols * 2 ), duration = o.duration
						- ( options.rows + options.cols ) * interval, parentCoords = $
						.extend( position, {
							width : width,
							height : height
						} ), pieceHeight = Math.ceil( height / options.rows ), pieceWidth = Math
						.ceil( width / options.cols ), $container = $(
						'<div></div>' ).css( {
					position : 'absolute',
					padding : 0,
					margin : 0,
					border : 0,
					top : position.top + "px",
					left : position.left + "px",
					height : height + "px",
					width : width + "px",
					background : 0,
					overflow : options.crop ? 'hidden' : 'visible',
					zIndex : $this.css( 'z-index' )
				} ).insertAfter( $this ), $pieces = [], $cloner = $(
						'<div></div>' ).css( {
					position : 'absolute',
					border : 0,
					padding : 0,
					margin : 0,
					height : pieceHeight + "px",
					width : pieceHeight + "px",
					overflow : "hidden"
				} ), $clonerContent = $this.clone().css( {
					position : 'static',
					opacity : ''
				} ).show();

				var x, y, pieceTop, pieceLeft, ly = options.rows, lx = options.cols;

				// creating the pieces.
				for ( y = 0; y < ly; y++ ) {
					for ( x = 0; x < lx; x++ ) {

						pieceTop = y * pieceHeight;
						pieceLeft = x * pieceWidth;

						$pieces.push(
						// Makes a clone for each piece
						$cloner.clone().html(
						// Inserting the cloned clonerContent into the clone
						$clonerContent.clone().css( {
							marginTop : -pieceTop + "px",
							marginLeft : -pieceLeft + "px"
						} ) ).css( {
							left : pieceLeft + "px",
							top : pieceTop + "px"
						// Adds the piece to the container
						} ).appendTo( $container ) );
					}
				}

				// If element is to be hidden we make it invisible until the
				// transformation is done and then hide it.
				if ( !show ) {
					$this.css( 'visibility', 'hidden' );
				}

				for ( y = 0; y < ly; y++ ) {
					for ( x = 0; x < lx; x++ ) {
						var $piece = $pieces[ y * ly + x ];
						$.type( options.beforeAnimate ) === 'function'
								&& options.beforeAnimate.call( $piece );

						// call the animation for each piece.
						options.animate.call( $piece, interval, duration, x, y,
								parentCoords );
					}
				}

				setTimeout( function( ) {
					// Ensures that the element is hidden/shown correctly
					if ( show ) {
						$this.css( 'opacity', '' ).show();
					} else {
						$this.css( {
							opacity : '',
							visibility : ''
						} ).hide();
					}

					// normal object expecting domElement so give it
					$.type( o.callback ) === 'function'
							&& o.callback.call( $this[ 0 ] );

					$this.dequeue();
					$container.detach();
				}, o.duration );
			} );
};