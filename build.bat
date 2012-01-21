cd C:\var\www\tools\packager
php packager build Presentation/Presentation Presentation/FullScreen Presentation/Filter Presentation/Helper Presentation/Helper.Keyboard Presentation/Helper.Page Presentation/Helper.Controller > C:\var\www\git\Presentation\Build\presentation-standard.js
php packager build Presentation/Presentation Presentation/FullScreen Presentation/Filter Presentation/Helper Presentation/Helper.Swipe Presentation/Helper.Keyboard Presentation/Helper.Page Presentation/Helper.Controller > C:\var\www\git\Presentation\Build\presentation-ipad.js
php packager build Presentation/FullScreen Presentation.Bootstrap/Filter Presentation.Bootstrap/Keyboard Presentation.Bootstrap/Page Presentation.Bootstrap/Controller > C:\var\www\git\Presentation\Build\presentation-bootstrap-standard.js
php packager build Presentation/FullScreen Presentation.Bootstrap/Filter Presentation.Bootstrap/Keyboard Presentation.Bootstrap/Page Presentation.Bootstrap/Controller Presentation.Bootstrap/Swipe > C:\var\www\git\Presentation\Build\presentation-bootstrap-ipad.js

java -jar C:\var\www\tools\yuicompressor\build\yuicompressor-2.4.6.jar -o C:\var\www\git\Presentation\Build\presentation-standard-compressed.js C:\var\www\git\Presentation\Build\presentation-standard.js
java -jar C:\var\www\tools\yuicompressor\build\yuicompressor-2.4.6.jar -o C:\var\www\git\Presentation\Build\presentation-ipad-compressed.js C:\var\www\git\Presentation\Build\presentation-ipad.js
java -jar C:\var\www\tools\yuicompressor\build\yuicompressor-2.4.6.jar -o C:\var\www\git\Presentation\Build\presentation-bootstrap-standard-compressed.js C:\var\www\git\Presentation\Build\presentation-bootstrap-standard.js
java -jar C:\var\www\tools\yuicompressor\build\yuicompressor-2.4.6.jar -o C:\var\www\git\Presentation\Build\presentation-bootstrap-ipad-compressed.js C:\var\www\git\Presentation\Build\presentation-bootstrap-ipad.js
