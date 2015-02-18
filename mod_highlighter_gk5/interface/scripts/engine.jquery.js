/**
* Main script file
* @package Highlighter GK5
* @Copyright (C) 2009-2013 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @version $Revision: GK5 1.0 $
**/


jQuery.noConflict();

jQuery(document).ready(function() {
	jQuery('.gkHighlighterGK5').each(function(i, el) {	
		new NHGK5(el);
	});
});
		

var NHGK5 = function(module) {
	// init class fields
	this.init_fields(module);
};


NHGK5.prototype = {
	module: null,
	options: null,
	prev: false,
	next: false,
	barCounter: 0,
	item_anim: false,
	wrapper : null,
	
	init_fields: function(module) {
		var animTypes = {};
		// animation match array
		animTypes['Fx.Transitions.linear'] = 'linear';
		animTypes['Fx.Transitions.Quad.easeIn'] = 'easeInQuad';
		animTypes['Fx.Transitions.Quad.easeOut'] = 'easeOutQuad';
		animTypes['Fx.Transitions.Quad.easeInOut'] = 'easeInOutQuad';
		animTypes['Fx.Transitions.Cubic.easeIn'] = 'easeInCubic';
		animTypes['Fx.Transitions.Cubic.easeOut'] = 'easeOutCubic';
		animTypes['Fx.Transitions.Cubic.easeInOut'] = 'easeInOutCubic';
		animTypes['Fx.Transitions.Quart.easeIn'] = 'easeInQuart';
		animTypes['Fx.Transitions.Quart.easeOut'] = 'easeOutQuart';
		animTypes['Fx.Transitions.Quart.easeInOut'] = 'easeInOutQuart';
		animTypes['Fx.Transitions.Quint.easeIn'] = 'easeInQuint';
		animTypes['Fx.Transitions.Quint.easeOut'] = 'easeOutQuint';
		animTypes['Fx.Transitions.Quint.easeInOut'] = 'easeInOutQuint';
		animTypes['Fx.Transitions.Pow.easeIn'] = 'easeInExpo';
		animTypes['Fx.Transitions.Pow.easeOut'] = 'easeOutExpo';
		animTypes['Fx.Transitions.Pow.easeInOut'] = 'easeInOutExpo';
		animTypes['Fx.Transitions.Expo.easeIn'] = 'easeInExpo';
		animTypes['Fx.Transitions.Expo.easeOut'] = 'easeOutExpo';
		animTypes['Fx.Transitions.Expo.easeInOut'] = 'easeInOutExpo';
		animTypes['Fx.Transitions.Circ.easeIn'] = 'easeInCirc';
		animTypes['Fx.Transitions.Circ.easeOut'] = 'easeOutCirc';
		animTypes['Fx.Transitions.Circ.easeInOut'] = 'easeInOutCirc';
		animTypes['Fx.Transitions.Sine.easeIn'] = 'easeInSine';
		animTypes['Fx.Transitions.Sine.easeOut'] = 'easeOutSine';
		animTypes['Fx.Transitions.Sine.easeInOut'] = 'easeInOutSine';
		animTypes['Fx.Transitions.Back.easeIn'] = 'easeInBack';
		animTypes['Fx.Transitions.Back.easeOut'] = 'easeOutBack';
		animTypes['Fx.Transitions.Back.easeInOut'] = 'easeInOutBack';
		animTypes['Fx.Transitions.Bounce.easeIn'] = 'easeInBounce';
		animTypes['Fx.Transitions.Bounce.easeOut'] = 'easeOutBounce';
		animTypes['Fx.Transitions.Elastic.easeIn'] = 'easeInElastic';
		animTypes['Fx.Transitions.Elastic.easeOut'] = 'easeOutElastic';
		animTypes['Fx.Transitions.Elastic.easeInOut'] = 'easeInOutElastic';
		
		this.module = jQuery(module);
		this.module.addClass('acitve');
		this.options = jQuery.parseJSON(this.module.attr('data-config').replace(/'/g,"\""));
		this.options.wrapper = module;
		this.wrapper = jQuery(this.options.wrapper).find('.gkHighlighterWrapper');
		this.options.speed = this.options.animationSpeed;
		this.options.interval = this.options.animationInterval;
		this.options.fun = animTypes[this.options.animationFun];
		this.options.type = this.options.animationType;
		this.options.mouseOver =  this.options.mouseover;
		this.options.wrapper = jQuery(this.options.wrapper);
		
		var modInterface = jQuery(this.options.wrapper).find('.gkHighlighterInterface');
		//
		if (modInterface) {
			if (modInterface.find('.next')) {
				this.prev = jQuery(this.options.wrapper).find('.prev');
				this.next = jQuery(this.options.wrapper).find('.next');
			}
			this.wrapper.css('margin-' + jQuery(this.options.wrapper).find('.gkHighlighterInterface').attr('data-pos'), jQuery(this.options.wrapper).find('.gkHighlighterInterface').width() + 25 + "px");
		}

		if (this.wrapper.find('.nowrap')) {
			this.wrapper.find('.nowrap').css('position', 'static');
		}
		
		switch(this.options.type) {
			case 'linear' 			: this.linear(); break;
			case 'slides' 			: this.slides(); break;
			case 'slidesBottom' 	: this.slidesBottom(); break;
			case 'slidesLayerBottom': this.slidesLayerBottom(); break;
			case 'slidesLayer'		: this.slidesLayer(); break;
			case 'flipx'			: this.flipx(); break;
			case 'fadeLeft' 		: this.fadeLeft(); break;
			case 'opacity'			: this.opacity(); break;
			case 'bar'				: if(this.isIE()) {
										this.options.type = 'flipx';
										this.flipx(); 
									} else { this.bar(); } break;
		}
	},
	isIE : function() {
	  var myNav = navigator.userAgent.toLowerCase();
	  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	},
	// linear animation type - infite scroller
	linear: function() {
		var $this = this;
			$this.options.wrapper = jQuery($this.options.wrapper);
			var nowrap = $this.options.wrapper.find('.nowrap');  
			nowrap = jQuery(nowrap);
			$this.w = 0;
			$this.stopped = false;
			$this.options.wrapper.find('.nowrap > span').each(function(i, elmt){ 
				$this.w += jQuery(elmt).width();
			});
			
			$this.w += 80;
			
			$this.options.wrapper.find('.gkHighlighterWrapperSub').css('overflow', 'hidden'); 
			
			var time = (($this.w+$this.options.wrapper.width())/$this.options.speed) * 1000;
			var w = $this.options.wrapper.width();
			var width = $this.w,
		    containerwidth = w,
		    left = containerwidth;
			
			function tick() {	
				if($this.stopped === false) {		
			    	if(--left < -width){
			          left = containerwidth;   
					}
					nowrap.css("margin-left", left + "px");	     
			      	setTimeout(tick, time/width);
		      }
		    }
		
			    tick();
		if ($this.options.mouseOver == 'true') {
			nowrap.mouseenter(function () {
				$this.stopped = true;
			});
			nowrap.mouseleave(function () {
				$this.stopped = false;
				tick();
			});
		}
	},
	// opacity animation
	opacity: function () {
		var $this = this;
		$this.items = $this.options.wrapper.find('.gkHighlighterItem');
		$this.wrapper.css('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		jQuery($this.items[0]).addClass('gk-active');
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		$this.items.each(function (j, elm) {
			elm = jQuery(elm);
			elm.css('z-index', $this.items.length - j);
			if (j !== 0) {
				elm.css('opacity', 0);
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('fadeOut');
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					clearTimeout($this.timer);
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').css('opacity', 1);
					jQuery($this.items[$this.actual]).addClass('gk-active');
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('fadeOut');
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					clearTimeout($this.timer);
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').css('opacity', 1);
					jQuery($this.items[$this.actual]).addClass('gk-active');
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	// fade from left side animation
	fadeLeft: function () {
		var $this = this;
		$this.items = $this.options.wrapper.find('.gkHighlighterItem');
		$this.wrapper.css('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		jQuery($this.items[0]).addClass('gk-active');
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		jQuery($this.items).each(function (j, elm) {
			elm = jQuery(elm);
			elm.css('z-index', $this.items.length - j);
			if (j !== 0) {
				elm.addClass('invisible');
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('fadeOutLeft');
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					clearTimeout($this.timer);
					jQuery($this.items[$this.actual]).css('opacity', 0);
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem');
					jQuery($this.items[$this.actual]).addClass('gk-active');
					setTimeout(function () {
						jQuery($this.items[$this.actual]).addClass('fadeInLeft');
					}, $this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('fadeOutLeft');
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					clearTimeout($this.timer);
					jQuery($this.items[$this.actual]).css('opacity', 0);
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem');
					jQuery($this.items[$this.actual]).addClass('gk-active');
					setTimeout(function () {
						jQuery($this.items[$this.actual]).addClass('fadeInLeft');
					},$this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	// flip rotation, based on CSS3 transitions
	flipx: function () {
		var $this = this;
		$this.options.wrapper = jQuery($this.options.wrapper);
		$this.items = $this.options.wrapper.find('.gkHighlighterItem');
		$this.wrapper.css('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		jQuery($this.items[0]).addClass('gk-active');
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);

		$this.items.each(function (j, elm) {
			jQuery(elm).css('z-index', $this.items.length - j);
			if (j !== 0) { jQuery(elm).css('opacity', 0);}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('flipOutX').css('opacity', 0);
					$this.actual++;
					if ($this.actual > $this.items.length - 1) {
						$this.actual = 0;
					}
					clearTimeout($this.timer);

					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem');
					jQuery($this.items[$this.actual]).addClass('gk-active');
					setTimeout(function () {
						jQuery($this.items[$this.actual]).addClass('flipInX').css('opacity', 1);
						console.log('added');
					},$this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('flipOutX').css('opacity', 0);
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					clearTimeout($this.timer);
					jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem');
					jQuery($this.items[$this.actual]).addClass('gk-active');
					setTimeout(function () {
						jQuery($this.items[$this.actual]).addClass('flipInX').css('opacity', 1);
					},$this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	// slides to top animation
	slides: function () {
		var $this = this;
		$this.items = jQuery(this.options.wrapper).find('.gkHighlighterItem');
		jQuery($this.items[0]).addClass('gk-active');
		
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		}, $this.options.interval);
		//
		jQuery($this.items).each(function(j, elm) {
			jQuery(elm).css('display', 'block');
			
			if (j !== 0) {
				this.animPlay = true;
				jQuery(elm).animate({opacity: 0}, $this.options.speed, "linear", function() {
					$this.animPlay = false;
				});
			}
			if ($this.options.type !== 'linear'){ /*$this.effects2[j].set('top', 0);*/
				jQuery(elm).animate({top: 0}, $this.options.speed, "linear");
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					this.animPlay = true;
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).css('top', 0).animate({opacity: 0}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]);
					jQuery($this.items[$this.actual]).animate({top: 24}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun});
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});		
					jQuery($this.items[$this.actual]).addClass('gk-active');				
					jQuery($this.items[$this.actual]).css('top', -24).animate({top: 0},  {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun});
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					this.animPlay = true;
					$this.items.addClass('gk-active');
					jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).css('top', 0).animate({top: -24}, {queue: false, duration: parseInt($this.options.speed,10), easing : $this.options.fun});
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).addClass('gk-active');
					jQuery($this.items[$this.actual]).css('top', 24).animate({top: 0}, {queue: false, duration: parseInt($this.options.speed,10), easing : $this.options.fun});
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	// slides to top animation
	slidesBottom: function () {
		var $this = this;
		$this.items = jQuery(this.options.wrapper).find('.gkHighlighterItem');
		jQuery($this.items[0]).addClass('gk-active');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		}, $this.options.interval);
		//
		jQuery($this.items).each(function(j, elm) {
			jQuery(elm).css('display', 'block');
			jQuery(elm).css('z-index', $this.items.length - j);
			if (j !== 0) {
				this.animPlay = true;
				jQuery(elm).animate({opacity: 0}, $this.options.speed, "linear", function() {
					$this.animPlay = false;
				});
			}
			if ($this.options.type !== 'linear'){ /*$this.effects2[j].set('top', 0);*/
				jQuery(elm).animate({top: 0}, $this.options.speed, "linear");
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					this.animPlay = true;
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).css('top', 0).animate({opacity: 0}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]);
					jQuery($this.items[$this.actual]).animate({top: -24}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun});
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});	
					jQuery($this.items[$this.actual]).addClass('gk-active');					
					jQuery($this.items[$this.actual]).css('top', 24).animate({top: 0},  {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun});
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					this.animPlay = true;
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).css('top', 0).animate({top: 24}, {queue: false, duration: parseInt($this.options.speed,10), easing : $this.options.fun});
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).addClass('gk-active');
					jQuery($this.items[$this.actual]).css('top', -24).animate({top: 0}, {queue: false, duration: parseInt($this.options.speed,10), easing : $this.options.fun});
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	setRotation: function(rotation) {
		// set z-rotiation
		jQuery(this.options.wrapper).find('.gkHighlighterWrapperSub').css({
			'-webkit-transform': rotation,
			'-moz-transform': rotation,
			'-ms-transform': rotation,
			'-o-transform': rotation,
			'transform': rotation
		});
	},
	// 3D rotating bar animation
	bar: function () {
		var $this = this;
		$this.options.wrapper = jQuery($this.options.wrapper);
		$this.items = $this.options.wrapper.find('.gkHighlighterItem');
		$this.wrapper.addClass('bar');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		jQuery($this.items[0]).addClass('gk-active');
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		jQuery($this.items).each(function (j, elm) {
			switch(j) {
				case 0 : jQuery(elm).addClass('front'); break;
				case 1 : jQuery(elm).addClass('bottom'); break;
				case 2 : jQuery(elm).addClass('back'); break;
				case 3 : jQuery(elm).addClass('top'); break;
				default: jQuery(elm).attr('class', 'gkHighlighterItem gkHidden'); break;
			
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					$this.actual++;
					$this.barCounter++;	
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					var rotation = 'rotateX(' + $this.barCounter * -90 + 'deg)';
					clearTimeout($this.timer);
					$this.setRotation(rotation);
					jQuery($this.items[$this.actual]).addClass('gk-active');
					//
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					$this.actual--;
					$this.barCounter--;
					if ($this.actual > $this.items.length - 1) {
						$this.actual = 0;
					}
					var rotation = 'rotateX(' + $this.barCounter * -90 + 'deg)';
					jQuery($this.items[$this.actual]).addClass('gk-active');
					clearTimeout($this.timer);
					$this.setRotation(rotation);
					//
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	// slides to bottom animation (layer)
	slidesLayer: function () {
		var $this = this;
		$this.items = $this.options.wrapper.find('.gkHighlighterItem');
		$this.wrapper.css('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		jQuery($this.items[0]).addClass('gk-active');
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		jQuery($this.items).each(function (j, elm) {
			jQuery(elm).css('z-index', $this.items.length - j);
			if (j !== 0) {
				jQuery(elm).css('opacity', 0);
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					this.animPlay = true;
					$this.items.removeClass('gk-active');
					jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).css('top', 0).animate({top: -jQuery($this.items[$this.actual]).height()}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						jQuery($this.items[$this.actual]).css({top: 0,'z-index':1});
					}});
					var counter = 0;
					// reorder items by z-index  
					for (var i = $this.actual; i < $this.items.length; i++) {
						jQuery($this.items[i]).css('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						jQuery($this.items[i]).css('z-index', jQuery($this.items[$this.items.length - 1]).css('z-index') - 1 - i);
					}
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					jQuery($this.items[$this.actual]).addClass('gk-active');
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).css('top', 0).animate({top: -jQuery($this.items[$this.actual]).height()}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						jQuery($this.items[$this.actual]).css({top: 0,'z-index':1});
					}});
					var counter = 0;
					// reorder items by z-index  
					for (var i = $this.actual; i < $this.items.length; i++) {
						jQuery($this.items[i]).css('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						jQuery($this.items[i]).css('z-index', jQuery($this.items[$this.items.length - 1]).css('z-index') - 1 - i);
					}

					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).addClass('gk-active');
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);

					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	// slides to bottom animation (layer)
	slidesLayerBottom: function () {
		var $this = this;
		$this.items = $this.options.wrapper.find('.gkHighlighterItem');
		$this.wrapper.css('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		jQuery($this.items[0]).addClass('gk-active');
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		jQuery($this.items).each(function (j, elm) {
			jQuery(elm).css('z-index', $this.items.length - j);
			if (j !== 0) {
				jQuery(elm).css('opacity', 0);
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.mouseenter(function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.mouseleave(function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).css('top', 0).animate({top: jQuery($this.items[$this.actual]).height()}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						jQuery($this.items[$this.actual]).css({top: 0,'z-index':1});
					}});
					var counter = 0;
					// reorder items by z-index  
					for (var i = $this.actual; i < $this.items.length; i++) {
						jQuery($this.items[i]).css('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						jQuery($this.items[i]).css('z-index', jQuery($this.items[$this.items.length - 1]).css('z-index') - 1 - i);
					}
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					this.animPlay = true;
					jQuery($this.items[$this.actual]).addClass('gk-active');
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.click(function (e) {
				e.preventDefault();
				if (!$this.animPlay) {
					$this.items.removeClass('gk-active');
					this.animPlay = true;
					jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					jQuery($this.items[$this.actual]).css('top', 0).animate({top: jQuery($this.items[$this.actual]).height()}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						jQuery($this.items[$this.actual]).css({top: 0,'z-index':1});
					}});
					var counter = 0;
					// reorder items by z-index  
					for (var i = $this.actual; i < $this.items.length; i++) {
						jQuery($this.items[i]).css('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						jQuery($this.items[i]).css('z-index', jQuery($this.items[$this.items.length - 1]).css('z-index') - 1 - i);
					}
			
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					this.animPlay = true;
					jQuery($this.items[$this.actual]).addClass('gk-active');
					jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
						$this.animPlay = false;
					}});
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);

					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	timerFunc: function () {
		var $this = this;
		var height = this.items[$this.actual].getSize().y;
		if ($this.mouseIsOver === false) {
			if (this.options.type === 'slides') {
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
				jQuery($this.items[$this.actual]).css('top', 0).animate({top: -height}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun});
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: parseInt($this.options.speed,10), easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
				jQuery($this.items[$this.actual]).css('top', height).animate({top: 0}, {queue: false, duration: parseInt($this.options.speed,10), easing : $this.options.fun});
			} else if (this.options.type === 'slidesBottom') {
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
				jQuery($this.items[$this.actual]).css('top', 0).animate({top: height}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun});
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
				jQuery($this.items[$this.actual]).css('top', -height).animate({top: 0}, {queue: false, duration: parseInt($this.options.speed, 10), easing : $this.options.fun});
			} else if (this.options.type === 'flipx') {
				jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('flipOutX').css('opacity', 0);
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem');
				setTimeout(function () {
					jQuery($this.items[$this.actual]).addClass('flipInX').css('opacity', 1);
				},$this.options.speed);
			} else if (this.options.type === 'bar') {
				$this.actual++;
				$this.barCounter++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				if (!jQuery($this.items[$this.actual]).hasClass('front') && 
					!jQuery($this.items[$this.actual]).hasClass('bottom') && 
					!jQuery($this.items[$this.actual]).hasClass('back') && 
					!jQuery($this.items[$this.actual]).hasClass('top')
				){
					// hide elements
					$this.items.each(function (i, el) {
						el = jQuery(el);
						el.attr('class', 'gkHighlighterItem gkHidden');
						el.addClass('');
					});
					var face = $this.actual;
					jQuery($this.items[face]).attr('class', 'gkHighlighterItem');
					jQuery($this.items[face]).addClass('front');
	
					// create new 4 faces (order: front, bottom, back, top)
					for (var i = 0; i < 3; i++) {
						face++;
						if (face > $this.items.length - 1) { face = 0; }
						jQuery($this.items[face]).attr('class', 'gkHighlighterItem');
						if (i === 0) {
							jQuery($this.items[face]).addClass('bottom');
						} else if (i === 1) {
							jQuery($this.items[face]).addClass('back');
						} else {
							jQuery($this.items[face]).addClass('top');
						}
					}
				}
				// reset classes from previous faces
				jQuery($this.items).each(function (i, el) {
					el = jQuery(el);
					if (!el.hasClass('front') && 
						!el.hasClass('bottom') && 
						!el.hasClass('back') && 
						!el.hasClass('top')
					){
						el.attr('class', 'gkHighlighterItem').addClass('gkHidden');
					}
				});
	
				var rotation = 'rotateX(' + $this.barCounter * -90 + 'deg)';
				$this.setRotation(rotation);
			} else if (this.options.type === 'opacity') {
				jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('fadeOut');
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				jQuery($this.items[$this.actual]).css('opacity', 1);
				jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem');
			} else if (this.options.type === 'fadeLeft') {
				jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem').addClass('fadeOutLeft');
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				jQuery($this.items[$this.actual]).css('opacity', 0);
				jQuery($this.items[$this.actual]).attr('class', 'gkHighlighterItem');
				setTimeout(function () {
					jQuery($this.items[$this.actual]).addClass('fadeInLeft');
				},$this.options.speed);
			} else if (this.options.type === 'slidesLayerBottom') {
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
				jQuery($this.items[$this.actual]).css('top', 0).animate({top: jQuery($this.items[$this.actual]).height()}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					jQuery($this.items[$this.actual]).css({top: 0,'z-index':1});
				}});
				var counter = 0;
				// reorder items by z-index  
				for (var i = $this.actual; i < $this.items.length; i++) {
					jQuery($this.items[i]).css('z-index', $this.items.length - counter);
					counter++;
				}
				for (i = 0; i < $this.actual; i++) {
					jQuery($this.items[i]).css('z-index', jQuery($this.items[$this.items.length - 1]).css('z-index') - 1 - i);
				}
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
			} else if (this.options.type === 'slidesLayer') {
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 0}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
				jQuery($this.items[$this.actual]).css('top', 0).animate({top: -jQuery($this.items[$this.actual]).height()}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					jQuery($this.items[$this.actual]).css({top: 0,'z-index':1});
				}});
				var counter = 0;
				// reorder items by z-index  
				for (var i = $this.actual; i < $this.items.length; i++) {
					jQuery($this.items[i]).css('z-index', $this.items.length - counter);
					counter++;
				}
				for (i = 0; i < $this.actual; i++) {
					jQuery($this.items[i]).css('z-index', jQuery($this.items[$this.items.length - 1]).css('z-index') - 1 - i);
				}
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				this.animPlay = true;
				jQuery($this.items[$this.actual]).animate({opacity: 1}, {queue: false, duration: $this.options.speed, easing : $this.options.fun,  complete: function() {
					$this.animPlay = false;
				}});
			}
		}
	}
};
