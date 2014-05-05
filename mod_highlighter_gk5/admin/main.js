jQuery(document).ready(function() {
	
	// initialize the configuration manager
	var configManager = new HighlighterGK5ConfigManager();
	
	// check Joomla! version and add suffix
	if(parseFloat((jQuery('#gk_about_us').data('jversion')).substr(0,3)) >= '3.2') {
		jQuery('#module-form').addClass('j32');
	}
	
	jQuery('.gkFormLine.hasText').each(function (i, el) {
		jQuery(el).parent().css('margin-left', '20px');
		jQuery(el).parents().eq(1).find('.control-label').css('display', 'none');
	});
	
	jQuery('#jform_params_data_source-lbl').parent().parent().find('.controls').append(jQuery('#jform_params_data_source'));	
	jQuery('#jform_params_about_us-lbl').parent().css('display', 'none');
	jQuery('#gk_about_us').parent().css({marginLeft: 0});
	jQuery('#config_manager_form').parent().css({marginLeft: 0});
	
	
	jQuery('.input-pixels').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">px</span></div>")});
	jQuery('.input-minutes').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">minutes</span></div>")});
	jQuery('.input-percents').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">%</span></div>")});
	jQuery('.input-ms').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">ms</span></div>")});
	jQuery('.input-times').each(function(i, el){ jQuery(el).parent().find('#jform_params_img_width').after('<span class=\"add-on\">&times;</span>');});
	
	//
	new DataSources();
	new Animations();
	
});
