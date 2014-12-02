<?php

/**
* Helper file
* @package News Highlighter GK5
* @Copyright (C) 2009-2013 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @version $Revision: 4.0.0 $
**/

// access restriction
defined('_JEXEC') or die('Restricted access');
// import com_content route helper & JString class for UTF-8 problems
require_once (JPATH_SITE.DS.'components'.DS.'com_content'.DS.'helpers'.DS.'route.php');
jimport('joomla.utilities.string'); 


class NH_GK5_Helper {
	var $config = array(); // configuration array
	var $content = array(); // array with generated content
	var $module_id = 0; // module id used in JavaScript
	var $source = null;
	
	// module initialization
	function init($module, $params) {
        // Basic settings
		$this->config = $params->toArray();
		$this->config['module_id'] = $this->module_id;
		// detect the data source
		$this->source = $this->config["data_source"];
		// if the user set engine mode to Mootools
		if($this->config['engine_mode'] == 'mootools') {
			// load the MooTools framework to use with the module
			JHtml::_('behavior.framework', true);
		} else {
			// if the user specify to include the jQuery framework - load newest jQuery 1.7.* 
			$doc = JFactory::getDocument();
			// generate keys of script section
			$headData = $doc->getHeadData();
			$headData_keys = array_keys($headData["scripts"]);
			// set variable for false
			$engine_founded = false;
			// searching phrase jquery in scripts paths
			if(array_search('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"', $headData_keys) > 0) {
				$engine_founded = true;
			}
			//
			if(!$engine_founded && $this->config['include_jquery'] == 1) {
				$doc->addScript('https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js');
			}
			$uri = JURI::getInstance();
			// include jQuery easing animations
			$doc->addScript($uri->root().'modules/mod_highlighter_gk5/interface/scripts/jquery.easing.js');
		}	
	}
	
	function parseParams($data){
			print_r('data');
			print_r($data);
	        $array = array();
	 
	        foreach (get_object_vars((object) $data) as $k => $v)
	        {
	        	echo $k;
	        	echo $v;
	            if (is_object($v))
	            {
	                $array[$k] = $this->asArray($v);
	            }
	            else
	            {
	                $array[$k] = $v;
	            }
	        }
	 
	        return $array;
	    }
	
	function getDatas() {
		$db = JFactory::getDBO();
		
		if( $this->source == "com_content_all" ||
			$this->source == "com_categories" ||
	        $this->source == "com_articles") {	
			// getting instance of Joomla! com_content source class
			if(!class_exists('NH_GK5_Joomla_Source')) require_once (dirname(__FILE__).DS.'gk_classes'.DS.'gk.source.joomla.php');
			$newsClass = new NH_GK5_Joomla_Source();
			// Getting list of categories
			$categories = $newsClass->getSources($this->config);
			// getting content
			$this->content = $newsClass->getArticles($categories, $this->config, $this->config['news_amount']);	 	
		} else if( $this->source == "k2_all" ||
			$this->source == "k2_categories" ||
	        $this->source == "k2_tags" ||
	        $this->source == "k2_articles") {
			// getting insance of K2 source class
			if(!class_exists('NH_GK5_K2_Source')) require_once (dirname(__FILE__).DS.'gk_classes'.DS.'gk.source.k2.php');
            $newsClass = new NH_GK5_K2_Source();
			// Getting list of categories
			$categories = $newsClass->getSources($this->config);
			// getting content
			$this->content = $newsClass->getArticles($categories, $this->config, $this->config['news_amount']);		 
		} else if($this->source == 'xml_file') {
			// getting insance of K2 source class
			if(!class_exists('NH_GK5_XML_Source')) require_once (dirname(__FILE__).DS.'gk_classes'.DS.'gk.source.xml.php');
			$newsClass = new NH_GK5_XML_Source();
			// Getting list of categories
			$categories = $newsClass->getSources($this->config);
			// getting content
			$this->content = $newsClass->getArticles($categories, $this->config, $this->config['news_amount']);	
		} else if($this->source == 'json_file') {
			// getting insance of K2 source class
			if(!class_exists('NH_GK5_JSON_Source')) require_once (dirname(__FILE__).DS.'gk_classes'.DS.'gk.source.json.php');
			$newsClass = new NH_GK5_JSON_Source();
			// Getting list of categories
			$categories = $newsClass->getSources($this->config);
			// getting content
			$this->content = $newsClass->getArticles($categories, $this->config, $this->config['news_amount']);
		}
	}
	
	// RENDERING LAYOUT
	function renderLayout() {	
    		// tables which will be used in generated content
    		$nh_content = array();
    		// Generating content 
    		$uri = JURI::getInstance();
    		$utils = new NH_GK5_Utils(); 
    		//
    		for ($i = 0; $i < count($this->content); $i++) {	
				
    			$news_text = $this->content[$i]['text'];
   				$news_title = $this->content[$i]['title'];
                $news_link = '';
                // links
                
                if($this->config["data_source"] == "k2_all" ||
                $this->config["data_source"] == "k2_categories" ||
		        $this->config["data_source"] == "k2_tags" ||
		        $this->config["data_source"] == "k2_articles") {
	                $news_id = $this->content[$i]['id'];
	                $news_cat_id = $this->content[$i]['cid'];
	                $news_cat_alias = $this->content[$i]['cat_alias'];
	                $news_alias = $this->content[$i]['alias'];
	                require_once (JPATH_SITE.DS.'components'.DS.'com_k2'.DS.'helpers'.DS.'route.php');
	               	$news_link = urldecode(JRoute::_(K2HelperRoute::getItemRoute($news_id.':'.urlencode($news_alias), $news_cat_id.':'.urlencode($news_cat_alias))));
		        } else if($this->config["data_source"] == "json_file" || $this->config["data_source"] == "xml_file") {
		        	$news_link = $this->content[$i]['url'];
		        } else {
   					$news_link = JRoute::_(ContentHelperRoute::getArticleRoute($this->content[$i]['id'], $this->content[$i]['cid']));
                }
                // REMOVE XHTML		
                if($this->config['clean_xhtml'] == TRUE) $news_text = strip_tags($news_text);
    			// PARSING PLUGINS
    			if($this->config['parse_plugins'] == TRUE) $news_text = JHTML::_('content.prepare', $news_text);	
    			// CLEANING PLUGINS
    			if($this->config['clean_plugins'] == TRUE) $news_text = preg_replace("/\{.+?\}/", "", $news_text);			
    			// LIMITS
    			$news_text = $utils->cutText($news_text, $this->config['desc_limit'], $this->config['desc_limit_type'], '');
    			$news_title = $utils->cutText($news_title, $this->config['title_limit'], $this->config['title_limit_type'], '');
                // GENERATE CONTENT	
                $news_content = '<span>';              
    			if( $this->config['news_as_links'] ) $news_content .= '<a href="'.$news_link.'">'; 
                if( $this->config['show_title'] ){   $news_content .= '<span>' . $news_title . '</span>';  }
                if( $this->config['show_desc'])  {    $news_content .= ': ';
                                                             $news_content .= $news_text; }
                if( $this->config['news_as_links'] ) $news_content .= '</a>';
                                                     $news_content .= '</span>';   
    			// creating table with news content
    			array_push($nh_content, $news_content);
    		}
		
		/** GENERATING FINAL XHTML CODE START **/
		// create instances of basic Joomla! classes
		$document = JFactory::getDocument();
		$uri = JURI::getInstance();
		// add stylesheets to document header
		if($this->config["useCSS"] == 1) $document->addStyleSheet( $uri->root().'modules/mod_highlighter_gk5/interface/css/style.css', 'text/css' );
		// init $headData variable
		$headData = false;
		// add CSS rules
		$document->addStyleDeclaration('#gkHighlighterGK5-'.$this->config['module_id'].' .gkHighlighterInterface span.text { color: '.$this->config['introtext_color'].'; } #gkHighlighterGK5-'.$this->config['module_id'].' .gkHighlighterInterface { background-color: '.$this->config['interface_bg'].'; border-radius: '.$this->config['interface_radius'].'px; -moz-border-radius: '.$this->config['interface_radius'].'px; -webkit-border-radius: '.$this->config['interface_radius'].'px; }');	
		
		if($this->config['animation_type'] == 'flipx' || $this->config['animation_type'] == 'fadeLeft' || $this->config['animation_type'] == 'opacity' || $this->config['animation_type'] == 'bar') {
			$document->addStyleDeclaration('.gkHighlighterItem {
			-webkit-animation-duration: '.$this->config['animation_speed'].'ms;
				-ms-animation-duration: '.$this->config['animation_speed'].'ms;
			   -moz-animation-duration: '.$this->config['animation_speed'].'ms;
			     -o-animation-duration: '.$this->config['animation_speed'].'ms;
			        animation-duration: '.$this->config['animation_speed'].'ms;
			}');
		}
		
		if($this->config['animation_type'] == 'bar') {
			$document->addStyleDeclaration('.bar .gkHighlighterItem {
				-webkit-transition: opacity '.$this->config['animation_speed'].'ms, -webkit-transform '.$this->config['animation_speed'].'ms;
				-moz-transition: opacity '.$this->config['animation_speed'].'ms, -moz-transform '.$this->config['animation_speed'].'ms;
				-o-transition: opacity '.$this->config['animation_speed'].'ms, -o-transform '.$this->config['animation_speed'].'ms;
				transition: opacity '.$this->config['animation_speed'].'ms, transform '.$this->config['animation_speed'].'ms;
			}');
			
			$document->addStyleDeclaration('.bar .gkHighlighterWrapperSub {
				-webkit-transition: -webkit-transform '.$this->config['animation_speed'].'ms;
				-moz-transition: -moz-transform '.$this->config['animation_speed'].'ms;
				-o-transition: -o-transform '.$this->config['animation_speed'].'ms;
				transition: transform '.$this->config['animation_speed'].'ms;
			}');
		}
		
		// add scripts with automatic mode to document header
		if($this->config['useScript'] == 2) {
			// getting module head section datas
			unset($headData);
			$headData = $document->getHeadData();
			// generate keys of script section
			$headData_keys = array_keys($headData["scripts"]);
			// set variable for false
			$engine_founded = false;
			// searching phrase mootools in scripts paths
			if($this->config['engine_mode'] == 'mootools') {
				if(array_search($uri->root().'modules/mod_highlighter_gk5/interface/scripts/engine.mootools.js', $headData_keys) > 0) $engine_founded = true;
				// if mootools file doesn't exists in document head section
				if(!$engine_founded){ 
					// add new script tag connected with mootools from module
					$document->addScript($uri->root().'modules/mod_highlighter_gk5/interface/scripts/engine.mootools.js');
				}
			} else {
				if(array_search($uri->root().'modules/mod_highlighter_gk5/interface/scripts/engine.jquery.js', $headData_keys) > 0) $engine_founded = true;
				// if jquery file doesn't exists in document head section
				if(!$engine_founded){ 
					// add new script tag connected with mootools from module
					$document->addScript($uri->root().'modules/mod_highlighter_gk5/interface/scripts/engine.jquery.js');
				}
			
			}
		}
		// generate Highlighter GK5 configuration array
		$config_data = array(
			"animationType" =>		$this->config['animation_type'],
			"animationSpeed" =>		$this->config['animation_speed'],
			"animationInterval" => 	$this->config['animation_interval'],
			"animationFun" =>		$this->config['animation_fun'],
			"mouseover" =>		($this->config['hover_anim']) ? 'true' : 'false'
		);
		// store it as JSON
		$config_data = str_replace('"', '\'', json_encode($config_data));
		require(JModuleHelper::getLayoutPath('mod_highlighter_gk5', 'default'));
	}
}
