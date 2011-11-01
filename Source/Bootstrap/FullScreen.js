/*
---
name: Presentation.Bootstrap.FullScreen

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Bootstrap

provides:
  - Presentation.Bootstrap.FullScreen
...
*/

(function(win, doc, Presentation, Bootstrap){

Bootstrap.FullScreen = {

	handler: function(presentation, configuration){

		if (configuration === false) {
			return;
		}

		var height = 0;
		if (win.innerHeight) {
			height = win.innerHeight;
		} else if (doc.documentElement.clientHeight) {
			height = doc.documentElement.clientHeight;
		} else if (doc.body.clientHeight) {
			height = doc.body.clientHeight;
		}

		for (var i = 0; l = presentation.getLength(), i < l; i++){
			var content = presentation.getContent(i).toElement();
			content.setStyle('height', height);
		}
		$(presentation).setStyle('height', height);

		this.success();
	}

};

Bootstrap.register('fullscreen', Bootstrap.FullScreen);

}(window, document, Presentation, Presentation.Bootstrap));
