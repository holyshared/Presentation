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

function FullScreen(){};

FullScreen.implement({

	invoke: function(slide){
		var opts = slide.options;
		var full = opts.fullScreen || false;
		if (!full){
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

//		var container = slide.getContainer();
		for (var i = 0; l = slide.getLength(), i < l; i++){
			var content = slide.getContent(i).toElement();
			content.setStyle('height', height);
		}
	}

});

Bootstrap.FullScreen = FullScreen;

Presentation.addInitializer(new Bootstrap.FullScreen());

}(window, document, Presentation, Presentation.Bootstrap));
