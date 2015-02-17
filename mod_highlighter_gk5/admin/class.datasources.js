// class used with data sources
var DataSources = function() {
	// array of the configuration
	this.datasources = null;
	this.initialize();
};
	


DataSources.prototype = {

	initialize: function() {
		// binding
		var $this = this;
		// set the array of configuration
		this.datasources = [];
		// get the data sources
		jQuery('#jform_params_data_source').find('option').each(function(i, item) {
			var value = jQuery(item).val();
			$this.datasources.push(value);
		});
		
		
		// init
		this.changeValue();
		jQuery('#jform_params_data_source').on('blur', function() { $this.changeValue() });
		jQuery('#jform_params_data_source').on('focus', function() { $this.changeValue() });
		jQuery('#jform_params_data_source').on('change', function() { $this.changeValue() });
	},
	
	changeValue: function() {
		// binding
		var $this = this;
		// get the data source value ..
		var data_source_value = jQuery('#jform_params_data_source').val();
		jQuery($this.datasources).each(function(i,source) {
			if(source != data_source_value && jQuery('#jform_params_'+source)) {
				jQuery('#jform_params_'+source).parents().eq(1).css('display', 'none');	
			} else if(jQuery('#jform_params_'+source)) {
				jQuery('#jform_params_'+source).parents().eq(1).css('display', 'block');
			}
		});	
		// hide unsupported XML/JSON options
		if(data_source_value == 'xml_file' || data_source_value == 'json_file') {
			jQuery('#jform_params_news_amount').parents().eq(1).css('display', 'none');
			jQuery('#jform_params_news_sort_value').parents().eq(1).css('display', 'none');
			jQuery('#jform_params_news_sort_order').parents().eq(1).css('display', 'none');			
			jQuery('#jform_params_news_since').parents().eq(2).css('display', 'none');	
			jQuery('#jform_params_news_in').parents().eq(1).css('display', 'none');	
			jQuery('#jform_params_news_frontpage').parents().eq(1).css('display', 'none');
			jQuery('#jform_params_unauthorized').parents().eq(1).css('display', 'none');
			jQuery('#jform_params_only_frontpage').parents().eq(1).css('display', 'none');
			jQuery('#jform_params_startposition').parents().eq(1).css('display', 'none');
		} else {
			jQuery('#jform_params_news_amount').parents().eq(1).css('display', 'block');
			jQuery('#jform_params_news_sort_value').parents().eq(1).css('display', 'block');
			jQuery('#jform_params_news_sort_order').parents().eq(1).css('display', 'block');			
			jQuery('#jform_params_news_since').parents().eq(2).css('display', 'block');
			jQuery('#jform_params_news_in').parents().eq(1).css('display', 'block');	
			jQuery('#jform_params_news_frontpage').parents().eq(1).css('display', 'block');
			jQuery('#jform_params_unauthorized').parents().eq(1).css('display', 'block');
			jQuery('#jform_params_only_frontpage').parents().eq(1).css('display', 'block');
			jQuery('#jform_params_startposition').parents().eq(1).css('display', 'block');
		}
	}
};
