/**
* Main script file
* @package Highlighter GK5
* @Copyright (C) 2009-2013 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @version $Revision: GK5 1.0 $
**/

window.addEvent("domready", function () {
	$$('.gkHighlighterGK5').each(function (el, i) {
		var config = JSON.decode(el.get('data-config'));
		el.addClass('active');
		new GKNewsHighligher({
			wrapper: el,
			speed: config.animationSpeed,
			interval: config.animationInterval,
			fun: config.animationFun,
			type: config.animationType,
			mouseOver: config.mouseover
		});
	});
});
var GKNewsHighligher = new Class({
	options: {
		wrapper: null,
		speed: null,
		interval: null,
		fun: null,
		type: null,
		mouseOver: null
	},
	initialize: function (options) {
		this.setOptions(options);
		var $this = this;
		this.prev = null;
		this.next = null;
		this.options.fun = this.options.fun.split(".");
		
		this.barCounter = 0;
		this.item_anim = false;
		this.wrapper = this.options.wrapper.getElement('.gkHighlighterWrapper');
		var modInterface = this.options.wrapper.getElement('.gkHighlighterInterface');
		
		if (modInterface) {
			if (modInterface.getElement('.next')) {
				this.prev = this.options.wrapper.getElement('.prev');
				this.next = this.options.wrapper.getElement('.next');
			}
			$this.wrapper.setStyle('margin-' + this.options.wrapper.getElement('.gkHighlighterInterface').getProperty('data-pos'), this.options.wrapper.getElement('.gkHighlighterInterface').getSize().x + 25 + "px");
		}

		if ($this.wrapper.getElement('.nowrap')) {
			$this.wrapper.getElement('.nowrap').setStyle('position', 'static');
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
	setRotation: function(rotation) {
		// set z-rotiation
		this.options.wrapper.getElement('.gkHighlighterWrapperSub').setStyles({
			'-webkit-transform': rotation,
			'-moz-transform': rotation,
			'-o-transform': rotation,
			'transform': rotation
		});
	},
	// linear animation type - infite scroller
	linear: function() {
		var $this = this;

		var nowrap = $this.options.wrapper.getElement('.nowrap');
		$this.w = 0;
		$this.options.wrapper.getElements('.nowrap > span').each(function (elmt, i) {
			$this.w += elmt.getSize().x;
		});
		$this.w += 80;
		
		$this.options.wrapper.getElement('.gkHighlighterWrapperSub').setStyle('overflow', 'hidden');
		var time = (($this.w + $this.options.wrapper.getSize().x) / $this.options.speed) * 1000;
		var timeOriginal = time;
		var effect = new Fx.Tween(nowrap, {
			duration: time,
			transition: Fx.Transitions.linear,
			onComplete: function () {
				var w = $this.options.wrapper.getSize().x;
				effect.set('margin-left', w);
				effect.start('margin-left', w, -$this.w);
			}
		});
		if ($this.options.mouseOver == 'true') {
			nowrap.addEvent("mouseenter", function () {
				effect.pause();
			});
			nowrap.addEvent("mouseleave", function () {
				effect.resume();
			});
		}
		effect.set('margin-left', $this.options.wrapper.getSize().x);
		effect.start('margin-left', $this.options.wrapper.getSize().x, -$this.w);
	},

	// flip rotation, based on CSS3 transitions
	flipx: function () {
		var $this = this;
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.wrapper.setStyle('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
				//
		$this.items.each(function (elm, j) {
			//elm.setStyle('z-index', $this.items.length - j);
			if (j !== 0) {
				elm.setStyle('opacity', 0);
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('flipOutX').setStyle('opacity', '0');
					$this.actual++;
					if ($this.actual > $this.items.length - 1) {
						$this.actual = 0;
					}
					clearTimeout($this.timer);

					$this.items[$this.actual].set('class', 'gkHighlighterItem');

					setTimeout(function () {
						$this.items[$this.actual].addClass('flipInX').setStyle('opacity', '1');
					},$this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('flipOutX').setStyle('opacity', '0');
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					clearTimeout($this.timer);
					$this.items[$this.actual].set('class', 'gkHighlighterItem');
					setTimeout(function () {
						$this.items[$this.actual].addClass('flipInX').setStyle('opacity', '1');
					},$this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},

	// 3D rotating bar animation
	bar: function () {
		var $this = this;
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.wrapper.addClass('bar');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		$this.items.each(function (elm, j) {
			elm.setStyle('opacity', 0);
			switch(j) {
				case 0 : elm.addClass('front'); elm.setStyle('opacity', 1); break;
				case 1 : elm.addClass('bottom'); break;
				case 2 : elm.addClass('back'); break;
				case 3 : elm.addClass('top'); break;
				default: elm.set('class', 'gkHighlighterItem gkHidden'); break;
			
			}
			
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.actual++;
					$this.barCounter++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					var rotation = 'rotateX(' + $this.barCounter * -90 + 'deg)';
					clearTimeout($this.timer);
					var active = $this.barCounter%$this.items.length;
					$this.items[active].setStyle('opacity', 1);
					$this.setRotation(rotation);
					//
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.actual--;
					$this.barCounter--;
					if ($this.actual > $this.items.length - 1) {
						$this.actual = 0;
					}
					var active = $this.barCounter%$this.items.length;
					$this.items[active].setStyle('opacity', 1);
					var rotation = 'rotateX(' + $this.barCounter * -90 + 'deg)';
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

	// fade from left side animation
	fadeLeft: function () {
		var $this = this;
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.wrapper.setStyle('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		$this.items.each(function (elm, j) {
			elm.setStyle('z-index', $this.items.length - j);
			if (j !== 0) {
				elm.addClass('invisible');
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('fadeOutLeft');
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					clearTimeout($this.timer);
					$this.items[$this.actual].setStyle('opacity', 0);
					$this.items[$this.actual].set('class', 'gkHighlighterItem');
					setTimeout(function () {
						$this.items[$this.actual].addClass('fadeInLeft');
					}, $this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('fadeOutLeft');
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					clearTimeout($this.timer);
					$this.items[$this.actual].set('class', 'gkHighlighterItem');
					setTimeout(function () {
						$this.items[$this.actual].addClass('fadeInLeft');
					},$this.options.speed);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},

	// opacity animation
	opacity: function () {
		var $this = this;
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.wrapper.setStyle('max-height', '20px');
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		$this.items.each(function (elm, j) {
			elm.setStyle('z-index', $this.items.length - j);
			if (j !== 0) {
				elm.setStyle('opacity', 0);
			}
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('fadeOut');
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					clearTimeout($this.timer);
					$this.items[$this.actual].set('class', 'gkHighlighterItem');
					$this.items[$this.actual].setStyle('opacity', 1);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('fadeOut');
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					clearTimeout($this.timer);
					$this.items[$this.actual].set('class', 'gkHighlighterItem');
					$this.items[$this.actual].setStyle('opacity', 1);
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
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.items.setStyle('display', 'block');
		$this.effects1 = [];
		$this.effects2 = [];
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		$this.items.each(function (elm, j) {
			elm.setStyle('z-index', $this.items.length - j);
			$this.effects1[j] = new Fx.Tween(elm, {
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true,
				onStart: function () {
					$this.animPlay = true;
				},
				onComplete: function () {
					$this.animPlay = false;
				}
			});
			$this.effects2[j] = new Fx.Tween(elm, {
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true
			});
			if (j !== 0) $this.effects1[j].set('opacity', 0);
			if ($this.options.type !== 'linear') $this.effects2[j].set('top', 0);
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, -24);
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					$this.effects1[$this.actual].start('opacity', 1);
					$this.effects2[$this.actual].start('top', 24, 0);
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, 24);
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					$this.effects1[$this.actual].start('opacity', 1);
					$this.effects2[$this.actual].start('top', -24, 0);
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},

	// slides to bottom
	slidesBottom: function () {
		var $this = this;
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.items.setStyle('display', 'block');
		$this.effects1 = [];
		$this.effects2 = [];
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer =  setInterval(function () {
			$this.timerFunc();
		}, $this.options.interval);
		//
		$this.items.each(function (elm, j) {
			$this.effects1[j] = new Fx.Tween(elm, {
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true,
				onStart: function () {
					$this.animPlay = true;
				},
				onComplete: function () {
					$this.animPlay = false;
				}
			});
			$this.effects2[j] = new Fx.Tween(elm, {
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true
			});
			if (j !== 0) $this.effects1[j].set('opacity', 0);
			if ($this.options.type !== 'linear') $this.effects2[j].set('top', 0);
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, 24);
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					$this.effects1[$this.actual].start('opacity', 1);
					$this.effects2[$this.actual].start('top', -24, 0);
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, -24);
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					$this.effects1[$this.actual].start('opacity', 1);
					$this.effects2[$this.actual].start('top', 24, 0);
					//
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
		}
	},
	slidesLayer: function () {
		var $this = this;
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.wrapper.setStyle('max-height', '20px');
		$this.effects1 = [];
		$this.effects2 = [];
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		$this.items.each(function (elm, j) {
			elm.setStyle('z-index', $this.items.length - j);
			$this.effects1[j] = new Fx.Tween(elm, {
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true,
				onStart: function () {
					$this.animPlay = true;
				},
				onComplete: function () {
					$this.animPlay = false;
				}
			});
			$this.effects2[j] = new Fx.Tween(elm, {
				onComplete: function () {
					elm.setStyle('top', '0');
					elm.setStyle('z-index', 1);
				},
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true
			});
			if (j !== 0) $this.effects1[j].set('opacity', 0);
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, -$this.items[$this.actual].getSize().y);
					var counter = 0;
					// re-order items by z-index
					for (var i = $this.actual; i < $this.items.length; i++) {
						$this.items[i].setStyle('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						$this.items[i].setStyle('z-index', $this.items[$this.items.length - 1].getStyle('z-index') - 1 - i);
					}
					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					$this.effects1[$this.actual].start('opacity', 1); //
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, -$this.items[$this.actual].getSize().y);
					var counter = 0;
					// re-order items by z-index
					for (var i = $this.actual; i < $this.items.length; i++) {
						$this.items[i].setStyle('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						$this.items[i].setStyle('z-index', $this.items[$this.items.length - 1].getStyle('z-index') - 1 - i);
					}
					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					$this.effects1[$this.actual].start('opacity', 1);
					//
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
		$this.items = $this.options.wrapper.getElements('.gkHighlighterItem');
		$this.wrapper.setStyle('max-height', '20px');
		$this.effects1 = [];
		$this.effects2 = [];
		$this.actual = 0;
		$this.mouseIsOver = false;
		$this.animPlay = false;
		//
		$this.timer = setInterval(function () {
			$this.timerFunc();
		},$this.options.interval);
		//
		$this.items.each(function (elm, j) {
			elm.setStyle('z-index', $this.items.length - j);
			if (j !== 0) {
				elm.setStyle('opacity', 0);
			}

			$this.effects1[j] = new Fx.Tween(elm, {
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true,
				onStart: function () {
					$this.animPlay = true;
				},
				onComplete: function () {
					$this.animPlay = false;
				}
			});
			$this.effects2[j] = new Fx.Tween(elm, {
				onComplete: function () {
					elm.setStyle('top', '0');
					elm.setStyle('z-index', 1);
				},
				duration: $this.options.speed,
				transition: Fx.Transitions[$this.options.fun[2]][$this.options.fun[3]],
				wait: true
			});
		});
		//
		if ($this.options.mouseOver == 'true') {
			$this.wrapper.addEvent("mouseenter", function () {
				$this.mouseIsOver = true;
			});
			$this.wrapper.addEvent("mouseleave", function () {
				$this.mouseIsOver = false;
			});
		}
		if ($this.next) {
			$this.next.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, $this.items[$this.actual].getSize().y);
					var counter = 0;
					// reorder items by z-index  
					for (var i = $this.actual; i < $this.items.length; i++) {
						$this.items[i].setStyle('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						$this.items[i].setStyle('z-index', $this.items[$this.items.length - 1].getStyle('z-index') - 1 - i);
					}

					$this.actual++;
					$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
					$this.effects1[$this.actual].start('opacity', 1); //
					clearTimeout($this.timer);
					$this.timer = setInterval(function () {
						$this.timerFunc();
					},$this.options.interval);
				}
			});
			$this.prev.addEvent('click', function (e) {
				new Event(e).stop();
				if (!$this.animPlay) {
					$this.effects1[$this.actual].start('opacity', 0);
					$this.effects2[$this.actual].start('top', 0, $this.items[$this.actual].getSize().y);
					var counter = 0;
					// reorder items by z-index  
					for (var i = $this.actual; i < $this.items.length; i++) {
						$this.items[i].setStyle('z-index', $this.items.length - counter);
						counter++;
					}
					for (i = 0; i < $this.actual; i++) {
						$this.items[i].setStyle('z-index', $this.items[$this.items.length - 1].getStyle('z-index') - 1 - i);
					}

					($this.actual === 0) ? $this.actual = $this.items.length - 1 : $this.actual--;
					$this.effects1[$this.actual].start('opacity', 1); //
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
				$this.effects1[$this.actual].start('opacity', 0);
				$this.effects2[$this.actual].start('top', 0, -height);
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				$this.effects1[$this.actual].start('opacity', 1);
				$this.effects2[$this.actual].start('top', height, 0);
			} else if (this.options.type === 'flipx') {
				$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('flipOutX');
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				$this.items[$this.actual].set('class', 'gkHighlighterItem');
				setTimeout(function () {
					$this.items[$this.actual].addClass('flipInX');
				},$this.options.speed);
			} else if (this.options.type === 'fadeLeft') {
				$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('fadeOutLeft');
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				$this.items[$this.actual].setStyle('opacity', 0);
				$this.items[$this.actual].set('class', 'gkHighlighterItem');
				setTimeout(function () {
					$this.items[$this.actual].addClass('fadeInLeft');
					
				},$this.options.speed);
			} else if (this.options.type === 'slidesBottom') {
				$this.effects1[$this.actual].start('opacity', 0);
				$this.effects2[$this.actual].start('top', 0, height);
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				$this.effects1[$this.actual].start('opacity', 1);
				$this.effects2[$this.actual].start('top', -height, 0);
			} else if (this.options.type === 'slidesLayer') {
				$this.effects1[$this.actual].start('opacity', 0);
				$this.effects2[$this.actual].start('top', 0, -height);
				var counter = 0;
				// reorder items by z-index  
				for (var i = $this.actual; i < $this.items.length; i++) {
					$this.items[i].setStyle('z-index', $this.items.length - counter);
					counter++;
				}
				for (i = 0; i < $this.actual; i++) {
					$this.items[i].setStyle('z-index', $this.items[$this.items.length - 1].getStyle('z-index') - 1 - i);
				}

				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				$this.effects1[$this.actual].start('opacity', 1);
			} else if (this.options.type == 'slidesLayerBottom') {
				$this.effects1[$this.actual].start('opacity', 0);
				$this.effects2[$this.actual].start('top', 0, height);
				counter = 0;
				// reorder items by z-index  
				for (var i = $this.actual; i < $this.items.length; i++) {
					$this.items[i].setStyle('z-index', $this.items.length - counter);
					counter++;
				}
				for (i = 0; i < $this.actual; i++) {
					$this.items[i].setStyle('z-index', $this.items[$this.items.length - 1].getStyle('z-index') - 1 - i);
				}
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				$this.effects1[$this.actual].start('opacity', 1);
			} else if (this.options.type === 'opacity') {
				$this.items[$this.actual].set('class', 'gkHighlighterItem').addClass('fadeOut');
				$this.actual++;
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				$this.items[$this.actual].setStyle('opacity', 1);
				$this.items[$this.actual].set('class', 'gkHighlighterItem');
			} else if (this.options.type === 'bar') {
				$this.actual++;
				$this.barCounter++;
			
				
				
				$this.actual = ($this.actual > $this.items.length - 1) ? 0 : $this.actual;
				if (!$this.items[$this.actual].hasClass('front') && 
					!$this.items[$this.actual].hasClass('bottom') && 
					!$this.items[$this.actual].hasClass('back') && 
					!$this.items[$this.actual].hasClass('top')
				){
					// hide elements
					$this.items.each(function (el, i) {
						el.set('class', 'gkHighlighterItem gkHidden');
					});
					var face = $this.actual;
					var start = $this.actual;
					$this.items[face].setStyle('opacity', 1);
					$this.items[face].set('class', 'gkHighlighterItem');
					$this.items[face].addClass('front');

					// create new 4 faces (order: front, bottom, back, top)
					for (var i = 0; i < 3; i++) {
						face++;
						if (face > $this.items.length - 1) face = 0;
						$this.items[face].set('class', 'gkHighlighterItem');
						if (i === 0) {
							$this.items[face].addClass('bottom');
						} else if (i === 1) {
							$this.items[face].addClass('back');
						} else {
							$this.items[face].addClass('top');
						}
					}
				}

				// reset classes from previous faces
				$this.items.each(function (el, i) {
					if (!el.hasClass('front') && 
						!el.hasClass('bottom') && 
						!el.hasClass('back') && 
						!el.hasClass('top')
					){
						el.set('class', 'gkHighlighterItem');
						el.addClass('gkHidden');
					}
				});
				
				var active = $this.barCounter%$this.items.length;
				$this.items[active].setStyle('opacity', 1);
				var rotation = 'rotateX(' + $this.barCounter * -90 + 'deg)';
				$this.setRotation(rotation);
				/*var tz = Math.round( ( 40 / 2 ) / 
				  Math.tan( Math.PI / 4 ) );
				  console.log(tz);*/
			}
		}
	}
});
GKNewsHighligher.implement(new Options);
