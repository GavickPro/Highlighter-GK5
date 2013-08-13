window.addEvent("domready",function(){		// initialize the configuration manager
	var configManager = new HighlighterGK5ConfigManager();
	
	// initialize ColorPicker
	DynamicColorPicker.auto(".color-field");
	// sliding options
	var modblock = $$('div[id^="module-sliders"]')[0];
	var baseW = modblock.getSize().x;
	var minW = 640;
	
	modblock.getParent().setStyle('position','relative');
	
	if(baseW < minW) {
		modblock.setStyles({
			"position": "absolute",
			"background": "white",
			"width": baseW + "px",
			"padding": "5px",
			"border-radius": "3px",
			"-webkit-box-shadow": "-8px 0 15px #aaa",
			"-moz-box-shadow": "-8px 0 15px #aaa",
			"box-shadow": "-8px 0 15px #aaa",
			"-webkit-box-sizing": "border-box",
			"-moz-box-sizing": "border-box",
			"-ms-box-sizing": "border-box",
			"box-sizing": "border-box"
		});
		
		var WidthFX = new Fx.Morph(modblock, {duration: 150});
		var mouseOver = false;
	
		modblock.addEvent('mouseenter', function() {
			mouseOver = true;

			WidthFX.start({
				'width': minW,
				'margin-left': (-1 * (minW - baseW))
			});
		});

		modblock.addEvent('mouseleave', function() {
			mouseOver = false;
			(function() {
				if(!mouseOver) {
					WidthFX.start({
						'width': baseW,
						'margin-left': 0
					});
				}
			}).delay(750);
		});
	}
		
	// fix the Joomla! behaviour
	$$('.panel h3.title').each(function(panel) {
		panel.addEvent('click', function(){
			if(panel.hasClass('pane-toggler')) {
				(function(){ 
					panel.getParent().getElement('.pane-slider').setStyle('height', 'auto'); 
				}).delay(750);

				(function() {
					var myFx = new Fx.Scroll(window, { duration: 150 }).toElement(panel);
				}).delay(250);
			}
		});
	});
	
	// limits
	document.id('jform_params_title_limit_type').inject(document.id('jform_params_title_limit_type').getParent().getNext(), 'bottom');
	document.id('jform_params_title_limit').getParent().getPrevious().dispose();
	document.id('jform_params_desc_limit_type').inject(document.id('jform_params_desc_limit_type').getParent().getNext(), 'bottom');
	document.id('jform_params_desc_limit').getParent().getPrevious().dispose();
	// other form operations
	$$('.input-pixels').each(function(el){el.getParent().innerHTML = el.getParent().innerHTML + "<span class=\"unit\">px</span>"});
	$$('.input-percents').each(function(el){el.getParent().innerHTML = el.getParent().innerHTML + "<span class=\"unit\">%</span>"});
	$$('.input-minutes').each(function(el){el.getParent().innerHTML = el.getParent().innerHTML + "<span class=\"unit\">minutes</span>"});
	$$('.input-ms').each(function(el){el.getParent().innerHTML = el.getParent().innerHTML + "<span class=\"unit\">ms</span>"});
	// switchers
	$$('.gk_switch').each(function(el){
		el.setStyle('display','none');
		var style = (el.value == 1) ? 'on' : 'off';
		var switcher = new Element('div',{'class' : 'switcher-'+style});
		switcher.inject(el, 'after');
		switcher.addEvent("click", function(){
			if(el.value == 1){
				switcher.setProperty('class','switcher-off');
				el.value = 0;
			}else{
				switcher.setProperty('class','switcher-on');
				el.value = 1;
			}
		});
	});
	// demo link
	new Element('a', { 'href' : 'http://mootools.net/demos/?demo=Transitions', 'target' : '_blank',  'id' : 'gkDemoLink', 'html' : 'Demo'  }).inject(document.id('jform_params_animation_fun'), 'after');	
	// help link
	var link = new Element('a', { 'class' : 'gkHelpLink', 'href' : 'http://www.gavick.com/highlighter-gk5.html', 'target' : '_blank' })
	link.inject($$('div.panel')[$$('div.panel').length-1].getElement('h3'), 'bottom');
	link.addEvent('click', function(e) { e.stopPropagation(); });
	//
	new DataSources();
	new Animations();
	// AMM fix
	document.getElements('#module-sliders .panel').each(function(el, i) {
		if(el.getParent().getProperty('id') == 'module-sliders' && el.getElement('h3').getProperty('id') != 'assignment-options' && el.getElement('h3').getProperty('id') != 'permissions') {
			el.addClass('highlightergk5-panel');
		} else if(el.getParent().getProperty('id') == 'module-sliders'){
			el.addClass('non-highlightergk5-panel');
		}
	});
});