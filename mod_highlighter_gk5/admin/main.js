jQuery(document).ready(function() {
	
	// initialize the configuration manager
	var configManager = new HighlighterGK5ConfigManager();
	
	jQuery('.gkFormLine.hasText').each(function (i, el) {
		jQuery(el).parent().css('margin-left', '20px');
		jQuery(el).parents().eq(1).find('.control-label').css('display', 'none');
	});
	
	jQuery('#jform_params_about_us-lbl').parent().css('display', 'none');
	jQuery('#gk_about_us').parent().css({marginLeft: 0});
	jQuery('#config_manager_form').parent().css({marginLeft: 0});
	jQuery('#jform_params_data_source-lbl').parents().eq(1).find('.controls').append(jQuery('#jform_params_data_source'));
	
	jQuery('.input-pixels').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">px</span></div>")});
	jQuery('.input-minutes').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">minutes</span></div>")});
	jQuery('.input-percents').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">%</span></div>")});
	jQuery('.input-ms').each(function(i, el){jQuery(el).parent().html("<div class=\"input-prepend\">" + jQuery(el).parent().html() + "<span class=\"add-on\">ms</span></div>")});
	jQuery('.input-times').each(function(i, el){ jQuery(el).parent().find('#jform_params_img_width').after('<span class=\"add-on\">&times;</span>');});
		

	
	// demo link	
	/*var demo = new jQuery('<a>', { 'class' : 'gkDemoLink', 'href' : 'http://mootools.net/demos/?demo=Transitions', 'target' : '_blank' });
	jQuery('#jform_params_animation_fun_chzn').append(demo);
	demo.click( function(e) { e.preventDefault(); e.stopPropagation(); });
	
	// help link
	var link = new jQuery('<a>', { 'class' : 'gkHelpLink', 'href' : 'http://www.gavick.com/highlighter-gk5.html', 'target' : '_blank' });
	jQuery('div.accordion-group').eq(jQuery('div.accordion-group').length-2).find('.accordion-heading').append(link);
	link.click( function(e) { e.preventDefault(); e.stopPropagation(); });*/
		
	//
	new DataSources();
	new Animations();
	
});
