<?php

/**
* Joomla! Source Class
* @package Highlighter GK5
* @Copyright (C) 2009-2013 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @version $Revision: 4.0.0 $
**/


// no direct access
defined('_JEXEC') or die('Restricted access');

class NH_GK5_Joomla_Source {
	// Method to get sources of articles
	static function getSources($config) {
		if($config['data_source'] != 'com_content_all') {
			//
			$db = JFactory::getDBO();
			// if source type is section / sections
			$source = false;
			$where1 = '';
			$where2 = '';
			//
			if($config['data_source'] == 'com_categories'){
				$source = $config['com_categories'];
				$where1 = ' c.id = ';
				$where2 = ' OR c.id = ';
			} else {
				$source = strpos($config['com_articles'],',') !== false ? explode(',', $config['com_articles']) : $config['com_articles'];
				$where1 = ' content.id = ';
				$where2 = ' OR content.id = ';	
			}
			//	
			$where = ''; // initialize WHERE condition
			// generating WHERE condition
			for($i = 0;$i < count($source);$i++){
				if(count($source) == 1) $where .= (is_array($source)) ? $where1.$source[0] : $where1.$source;
				else $where .= ($i == 0) ? $where1.$source[$i] : $where2.$source[$i];		
			}
			//
			$query_name = '
				SELECT 
					c.id AS CID
				FROM 
					#__categories AS c
				LEFT JOIN 
					#__content AS content 
					ON 
					c.id = content.catid 	
				WHERE 
					( '.$where.' ) 
					AND 
					c.extension = '.$db->quote('com_content').'
					AND 
					c.published = 1
		        ';	
			// Executing SQL Query
			$db->setQuery($query_name);
			// check if some categories was detected
			if($categories = $db->loadObjectList()) {
				$categories_array = array();
				// iterate through all items 
				foreach($categories as $item) {
					if(!in_array($item->CID, $categories_array)) {
						array_push($categories_array, $item->CID);
					}
				}
				//
				return $categories_array;
			} else {
				// when no categories detected
				return null;
			}
		} else {
			return null;
		}
	}
	// Method to get articles in standard mode 
	static function getArticles($categories, $config, $amount) {	
		//
		$sql_where = '';
		//
		if($categories) {		
			// getting categories ItemIDs
			for($j = 0; $j < count($categories); $j++) {
				$sql_where .= ($j != 0) ? ' OR content.catid = ' . $categories[$j] : ' content.catid = '. $categories[$j];
			}	
		}
		// Overwrite SQL query when user set IDs manually
		if($config['data_source'] == 'com_articles' && $config['com_articles'] != ''){
			// initializing variables
			$sql_where = '';
			$ids = explode(',', $config['com_articles']);
			//
			for($i = 0; $i < count($ids); $i++ ){	
				// linking string with content IDs
				$sql_where .= ($i != 0) ? ' OR content.id = '.$ids[$i] : ' content.id = '.$ids[$i];
			}
		}
		// Arrays for content
		$content = array();
		$news_amount = 0;
		// Initializing standard Joomla classes and SQL necessary variables
		$db = JFactory::getDBO();
		$access_con = '';
		
		$user = JFactory::getUser();	
		if($config['unauthorized'] == '0') {
			$access_con = ' AND content.access IN ('. implode(',', $user->getAuthorisedViewLevels()) .') ';
		}
		if($config['time_offset'] == 0) {
			$date = JFactory::getDate();
		} else {
			$date = JFactory::getDate($config['time_offset'].' hour '.date('Y-m-d H:i:s', strtotime('now')));
		}
		$now  = $date->toSql(true);
		$nullDate = $db->getNullDate();
		// if some data are available
		// when showing only frontpage articles is disabled
		$frontpage_con = '';
		
		if($config['only_frontpage'] == 0 && $config['news_frontpage'] == 0) {
		 	$frontpage_con = ' AND content.featured = 0 ';
		} else if($config['only_frontpage'] == 1) {
			$frontpage_con = ' AND content.featured = 1';
		}
		
		$since_con = '';
		//
		if($config['news_since'] !== '') {
			$since_con = ' AND content.created >= ' . $db->Quote($config['news_since']);
		}
		//
		if($config['news_since'] == '' && $config['news_in'] != '') {
			$since_con = ' AND content.created >= ' . $db->Quote(strftime('%Y-%m-%d 00:00:00', time() - ($config['news_in'] * 24 * 60 * 60)));
		}
		// Ordering string
		$order_options = '';
		// When sort value is random
		if($config['news_sort_value'] == 'random') {
			$order_options = ' RAND() '; 
		}else{ // when sort value is different than random
			$order_options = ' content.'.$config['news_sort_value'].' '.$config['news_sort_order'].' ';
		}	
		// language filters
		$lang_filter = '';
		if (JFactory::getApplication()->getLanguageFilter()) {
			$lang_filter = ' AND content.language in ('.$db->quote(JFactory::getLanguage()->getTag()).','.$db->quote('*').') ';
		}
		
		if($config['data_source'] != 'com_content_all') {
			$sql_where = ' AND ( ' . $sql_where . ' ) ';
		}
		// creating SQL query			
		$query_news = '
		SELECT
			content.id AS iid,
			'.($config['use_title_alias'] ? 'content.alias' : 'content.title').' AS title, 
			content.introtext AS text, 
			content.created AS date, 
			content.publish_up AS date_publish,
			content.hits AS hits,
			content.language AS language,
			content.featured AS frontpage				
		FROM 
			#__content AS content 
		WHERE 
			content.state = 1
                '. $access_con .'   
		 		AND ( content.publish_up = '.$db->Quote($nullDate).' OR content.publish_up <= '.$db->Quote($now).' )
				AND ( content.publish_down = '.$db->Quote($nullDate).' OR content.publish_down >= '.$db->Quote($now).' )
			'.$sql_where.'
			'.$lang_filter.'
			'.$frontpage_con.' 
			'.$since_con.'
		ORDER BY 
			'.$order_options.'
		LIMIT
			'.($config['startposition']).','.($amount + (int)$config['time_offset']).';
		';
		
		// run SQL query
		$db->setQuery($query_news);
		// when exist some results
		if($news = $db->loadAssocList()) {			
			// generating tables of news data
			foreach($news as $item) {	
				$content[] = $item; // store item in array
				$news_amount++;	// news amount
			}
		}
		
		// generate SQL WHERE condition
		$second_sql_where = '';
		for($i = 0; $i < count($content); $i++) {
			$second_sql_where .= (($i != 0) ? ' OR ' : '') . ' content.id = ' . $content[$i]['iid'];
		}
		// second SQL query to get rest of the data and avoid the DISTINCT
		$second_query_news = '
		SELECT
			content.id AS iid,
			content.access AS access,
			categories.title AS catname, 
			users.email AS author_email,
			content.created_by_alias AS author_alias,
			content_rating.rating_sum AS rating_sum,
			content_rating.rating_count AS rating_count,
			CASE WHEN CHAR_LENGTH(content.alias) 
				THEN CONCAT_WS(":", content.id, content.alias) 
					ELSE content.id END as id, 
			CASE WHEN CHAR_LENGTH(categories.alias) 
				THEN CONCAT_WS(":", categories.id, categories.alias) 
					ELSE categories.id END as cid			
		FROM 
			#__content AS content 
			LEFT JOIN 
				#__categories AS categories 
				ON categories.id = content.catid 
			LEFT JOIN 
				#__users AS users 
				ON users.id = content.created_by 			
			LEFT JOIN 
				#__content_rating AS content_rating 
				ON content_rating.content_id = content.id
		WHERE 
			'.$second_sql_where.'
		ORDER BY 
			'.$order_options.'
		';
		
		// run the query
		$db->setQuery($second_query_news);
		// when exist some results
		if($news2 = $db->loadAssocList()) {
			// create the iid array
			$content_iid = array();
			// create the content IDs array
			foreach($content as $item) {
				array_push($content_iid, $item['iid']);
			}
			// generating tables of news data
			foreach($news2 as $item) {						
			    $pos = array_search($item['iid'], $content_iid);
				// check the access restrictions
				$authorised = JAccess::getAuthorisedViewLevels(JFactory::getUser()->get('id'));
				$access = JComponentHelper::getParams('com_content')->get('show_noauth');
				// set the IDs to 0 if the unauthorized items are displayed
				if($config['unauthorized'] == '1') {
					if (!($access || in_array($item['access'], $authorised))) { 
						$item['id'] = 0; 
					}
				}
				// merge the new data to the array of items data
				$content[$pos] = array_merge($content[$pos], (array) $item);
			}
		}
		// the content array
		return $content; 
	}
}

// EOF