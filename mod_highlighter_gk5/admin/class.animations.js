
// class used with data sources
var Animations = new Class({
	// array of the configuration
	animations: null,
	
	initialize: function() {
		// binding
		var $this = this;
		// set the array of configuration
		this.animations = [];
		// get the data sources
		document.id('jform_params_animation_type').getElements('option').each(function(item, i) {
			var value = item.getProperty('value');
			$this.animations.push(value);
		});
		
		// init
		this.changeValue();
		
		// add events
		document.id('jform_params_animation_type').addEvents({
			'change': function() { $this.changeValue(); },		
			'focus': function() { $this.changeValue(); },
			'blur': function() { $this.changeValue(); }
		});
	},
	
	changeValue: function() {
		// binding
		var $this = this;
		// get the data source value ..
		var animation_value = document.id('jform_params_animation_type').get('value');
		
				
		// hide unsupported parameters
		if(animation_value == 'flipx' || animation_value == 'fadeLeft' || animation_value == 'opacity' || animation_value == 'bar') {
			document.id('jform_params_animation_fun').getParent().setStyle('display', 'none');
		} else {
			document.id('jform_params_animation_fun').getParent().setStyle('display', 'block');
			
		}
	}
});