// class used with data sources
var Animations = function() {
	// array of the configuration
	this.animations = null;
	this.initialize();
};

Animations.prototype = {
	
	initialize: function() {
		// binding
		var $this = this;
		// set the array of configuration
		this.animations = [];
		// get the data sources
		jQuery('#jform_params_animation_type').find('option').each(function(i, item) {
			item = jQuery(item);
			var value = item.val();
			$this.animations.push(value);
		});
		
		// init
		this.changeValue();
		
		// add events
		jQuery('#jform_params_animation_type').on('blur', function() { $this.changeValue() });
		jQuery('#jform_params_animation_type').on('focus', function() { $this.changeValue() });
		jQuery('#jform_params_animation_type').on('change', function() { $this.changeValue() });
	},
	
	changeValue: function() {
		// binding
		var $this = this;
		// get the data source value ..
		var animation_value = jQuery('#jform_params_animation_type').val();
		
				
		// hide unsupported parameters
		if(animation_value == 'flipx' || animation_value == 'fadeLeft' || animation_value == 'opacity' || animation_value == 'bar') {
			jQuery('#jform_params_animation_fun').parents().eq(1).css('display', 'none');
		} else {
			jQuery('#jform_params_animation_fun').parents().eq(1).css('display', 'block');
			
		}
	}
};