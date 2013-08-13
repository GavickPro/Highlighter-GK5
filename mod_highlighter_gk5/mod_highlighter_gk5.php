<?php
/**
* Main file
* @package News Highlighter GK4
* @Copyright (C) 2009-2010 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @version $Revision: 4.0.0 $
**/
/** access restriction **/
defined('_JEXEC') or die('Restricted access');
if(!defined('DS')){ define('DS',DIRECTORY_SEPARATOR); }
/**	Loading helper class **/
require_once (dirname(__FILE__).DS.'helper.php');
//
if(!class_exists('NH_GK5_Utils')) require_once (dirname(__FILE__).DS.'gk_classes'.DS.'gk.utils.php');
//
$helper = new NH_GK5_Helper();
$helper->init($module, $params);
$helper->getDatas();
$helper->renderLayout();
?>