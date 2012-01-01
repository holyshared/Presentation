cd C:\var\www\tools\packager
php packager build Presentation/Presentation Presentation/Filter Presentation/Helper Presentation/Helper.Keyboard Presentation/Helper.Page Presentation/Helper.Controller > presentation-standard.js
php packager build Presentation/Presentation Presentation/Filter Presentation/Helper Presentation/Helper.Swipe Presentation/Helper.Keyboard Presentation/Helper.Page Presentation/Helper.Controller > presentation-ipad.js
php packager build Presentation.Bootstrap/Filter Presentation.Bootstrap/Keyboard Presentation.Bootstrap/Page Presentation.Bootstrap/Controller > presentation-bootstrap-standard.js
php packager build Presentation.Bootstrap/Filter Presentation.Bootstrap/Keyboard Presentation.Bootstrap/Page Presentation.Bootstrap/Controller Presentation.Bootstrap/Swipe > presentation-bootstrap-ipad.js
