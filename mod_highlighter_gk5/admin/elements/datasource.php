<?php

defined('JPATH_BASE') or die;

jimport('joomla.form.formfield');

class JFormFieldDataSource extends JFormField {
	//
	protected $type = 'DataSource';
	//
	protected function getInput() {
		// output for options
		$output_options = '';
		// prefix for the language files
		$pre = 'MOD_HIGHLIGHTER_GK5_';
		
		// supported data sources value => name
		$data_sources = array(
			'group_content' =>	'COM_CONTENT_GROUP_NAME',
			'com_content_all' => 'COM_CONTENT_ALL',
			'com_articles' => 'COM_CONTENT_ARTICLES',
			'com_categories' => 'COM_CONTENT_CATEGORIES',
			'group_k2' =>	'COM_K2_GROUP_NAME',
			'k2_all' => 'K2_ALL',
			'k2_items' => 'K2_ITEMS',
			'k2_categories' => 'K2_CATEGORIES',
			'k2_tags' => 'K2_TAGS',
			'group_json' => 'JSON_GROUP_NAME',
			'json_file' => 'JSON_FILE',
			'group_xml' => 'XML_GROUP_NAME',
			'xml_file' => 'XML_FILE'
		);
		$iter = 0;
		
		foreach($data_sources as $value => $title) {
			if(strstr($value, 'group_') != false) {
				if($iter != 0) {
					$output_options .= '</optgroup>'; 
				}
				$output_options .= '<optgroup label="'.JText::_($pre . $title).'">'; 
			} else {
				$output_options .= '<option value="'.$value.'"'.(($this->value == $value) ? ' selected="selected"' : '').'>'.JText::_($pre . $title).'</option>';
			}
			$iter++;
		}
		$output_options .= '</optgroup>';
		// output the select
		echo '<select id="'.$this->id.'" name="'.$this->name.'">'.$output_options.'</select>';
	}
}

/* EOF */