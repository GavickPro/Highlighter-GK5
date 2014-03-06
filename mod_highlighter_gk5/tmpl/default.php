<?php
/**
* Highlighter GK5 - default layout
* @package Joomla!
* @Copyright (C) 2008-2013 Gavick.com
* @ All rights reserved
* @ Joomla! is Free Software
* @ Released under GNU/GPL License : http://www.gnu.org/copyleft/gpl.html
* @version $Revision: 1.5.1 $
**/


// access restriction
defined('_JEXEC') or die('Restricted access');
?>
<div class="gkHighlighterGK5" id="gkHighlighterGK5-<?php echo $this->config['module_id']; ?>" data-config="<?php echo $config_data; ?>">
    <?php if($this->config['interface'] == 1 || $this->config['introtext'] == 1) : ?>
    <div class="gkHighlighterInterface" data-pos="<?php echo $this->config['interface_pos']; ?>">
        <?php if($this->config['introtext']) : ?>
        <span class="text"><?php echo $this->config['introtext_value']; ?></span>
        <?php endif; ?>
        <?php if($this->config['interface'] && $this->config['animation_type'] !== 'linear') : ?>
        <div><a href="#" class="prev"></a>
        <a href="#" class="next"></a></div>
        <?php endif; ?>
    </div>
    <?php endif; ?>
    <div class="gkHighlighterWrapper">
    	<div class="gkHighlighterWrapperSub">
        <?php if($this->config['animation_type'] == 'linear') : ?>
        <div class="nowrap">
        <?php endif; ?>
            <?php for($i = 0;$i < count($nh_content); $i++) : ?>
                <?php if($this->config['animation_type'] != 'linear') : ?>
                	<div class="gkHighlighterItem"><?php echo $nh_content[$i]; ?></div>
                <?php else : ?>
                	<?php echo $nh_content[$i]; ?>
                <?php endif; ?>
            <?php endfor; ?>
        <?php if($this->config['animation_type'] == 'linear') : ?>
        </div>
        <?php endif; ?>
    </div>
    </div>
</div>
