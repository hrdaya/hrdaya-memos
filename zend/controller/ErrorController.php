class ErrorController extends Zend_Controller_Action
{
    public function errorAction()
    {
        $errors = $this->_getParam('error_handler');
 
        switch ($errors->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ROUTE:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                // 404 エラー -- コントローラあるいはアクションが見つかりません
                $this->getResponse()->setRawHeader('HTTP/1.1 404 Not Found');
                break;
            default:
                // アプリケーションのエラー
                break;
        }
 
        // 前回の内容を消去します
        $this->getResponse()->clearBody();
 
        $this->view->content = $content;
    }
}