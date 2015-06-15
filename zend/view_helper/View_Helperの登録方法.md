```php
// コントローラ内
$this->view->addHelperPath(APPLICATION_PATH.'/My/View/Helper','My_View_Helper');


$viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('viewRenderer');
if ($viewRenderer->view === null) {
    $viewRenderer->initView();
}
$viewRenderer->view->addHelperPath(APPLICATION_PATH.'/My/View/Helper','My_View_Helper');


$layout = Zend_Layout::getMvcInstance();
$view = $layout->getView();
$view->addHelperPath(APPLICATION_PATH.'/My/View/Helper','My_View_Helper');

<div>
<?= $this->strUpper($this->val); ?> 
</div>
```