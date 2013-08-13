// class used with data sources
var DataSources = new Class({
	// array of the configuration
	datasources: null,
	
	initialize: function() {
		// binding
		var $this = this;
		// set the array of configuration
		this.datasources = [];
		// get the data sources
		document.id('jform_params_data_source').getElements('option').each(function(item, i) {
			var value = item.getProperty('value');
			$this.datasources.push(value);
		});
		// hide hidden fields
		document.getElements('.gk-hidden-field').each(function(field, i) {
			field.getParent().setStyle('display', 'none');
		});
		
		// init
		this.changeValue();
		
		// add events
		document.id('jform_params_data_source').addEvents({
			'change': function() { $this.changeValue(); },		
			'focus': function() { $this.changeValue(); },
			'blur': function() { $this.changeValue(); }
		});
	},
	
	changeValue: function() {
		// binding
		var $this = this;
		// get the data source value ..
		var data_source_value = document.id('jform_params_data_source').get('value');
		$this.datasources.each(function(source) {
			if(source != data_source_value && document.id('jform_params_'+source)) {
				document.id('jform_params_'+source).getParent().setStyle('display', 'none');	
			} else if(document.id('jform_params_'+source)) {
				document.id('jform_params_'+source).getParent().setStyle('display', 'block');
			}
		});	
		
		// hide unsupported XML/JSON options
		if(data_source_value == 'xml_file' || data_source_value == 'json_file') {
			document.id('jform_params_news_amount').getParent().setStyle('display', 'none');
			document.id('jform_params_news_sort_value').getParent().setStyle('display', 'none');
			document.id('jform_params_news_sort_order').getParent().setStyle('display', 'none');			
			document.id('jform_params_news_since').getParent().setStyle('display', 'none');	
			document.id('jform_params_news_in').getParent().setStyle('display', 'none');	
			document.id('jform_params_news_frontpage').getParent().setStyle('display', 'none');
			document.id('jform_params_unauthorized').getParent().setStyle('display', 'none');
			document.id('jform_params_only_frontpage').getParent().setStyle('display', 'none');
			document.id('jform_params_startposition').getParent().setStyle('display', 'none');
		} else {
			document.id('jform_params_news_amount').getParent().setStyle('display', 'block');
			document.id('jform_params_news_sort_value').getParent().setStyle('display', 'block');
			document.id('jform_params_news_sort_order').getParent().setStyle('display', 'block');			
			document.id('jform_params_news_since').getParent().setStyle('display', 'block');
			document.id('jform_params_news_in').getParent().setStyle('display', 'block');	
			document.id('jform_params_news_frontpage').getParent().setStyle('display', 'block');
			document.id('jform_params_unauthorized').getParent().setStyle('display', 'block');
			document.id('jform_params_only_frontpage').getParent().setStyle('display', 'block');
			document.id('jform_params_startposition').getParent().setStyle('display', 'block');
		}
	}
});