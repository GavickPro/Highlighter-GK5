<?php
defined('JPATH_BASE') or die;
jimport('joomla.form.formfield');

class JFormFieldAsset extends JFormField {
        protected $type = 'Asset';

        protected function getInput() {
            $doc = JFactory::getDocument();
   			$doc->addScript(JURI::root().$this->element['path'].'class.configmanager.js');
   			$doc->addScript(JURI::root().$this->element['path'].'class.datasources.js');
   			$doc->addScript(JURI::root().$this->element['path'].'class.animations.js');
            $doc->addScript(JURI::root().$this->element['path'].'main.js');
            $doc->addStyleSheet(JURI::root().$this->element['path'].'style.css');        
            return null;
        }
}
?>