Presentation
===========================================

How to use
-------------------------------------------


### Components

* Presentation/Presentation
* Presentation/Filter
* Presentation/Helper
* Presentation/Helper.Keyboard
* Presentation/Helper.Swipe
* Presentation/Helper.Page
* Presentation/Helper.Controller

### Use package list

php packager register /path/to/PowerTools/custom-event/package.yml
php packager register /path/to/PowerTools/mobile/package.yml
php packager register /path/to/Helper/package.yml
php packager register /path/to/Moostrap/package.yml
php packager register /path/to/Presentation/package.yml
php packager register /path/to/Presentation.Bootstrap/package.yml

### Standard build

php packager build Presentation/Presentation Presentation/Filter Presentation/Helper Presentation/Helper.Keyboard Presentation/Helper.Page Presentation/Helper.Controller > presentation-standard.js

### iPad standard build

php packager build Presentation/Presentation Presentation/Filter Presentation/Helper Presentation/Helper.Swipe Presentation/Helper.Keyboard Presentation/Helper.Page Presentation/Helper.Controller > presentation-ipad.js

### Bootstrap include build
php packager build Presentation.Bootstrap/Filter Presentation.Bootstrap/Keyboard Presentation.Bootstrap/Page Presentation.Bootstrap/Controller > presentation-bootstrap-standard.js
