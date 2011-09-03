/*
---
name: Presentation.Bootstrap.FontScaler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation

provides:
  - Presentation.Bootstrap.FontScaler
...
*/

(function(win, doc, Presentation, Bootstrap){

function FontScaler() {
	this.ratio = 1.3;
};

FontScaler.implement({

	invoke: function(slide){
		var opts = slide.options;
		var height = 0, width = 0;

		var ratio = (!opts.font) ? this.ratio : opts.font.width / opts.font.height;

		if (win.innerHeight) {
			height = win.innerHeight;
			width = win.innerWidth;
		} else if (doc.documentElement.clientHeight) {
			height = doc.documentElement.clientHeight;
			width = doc.documentElement.clientWidth;
		} else if (doc.body.clientHeight) {
			height = doc.body.clientHeight;
			width = doc.body.clientWidth;
		}
		var dimension = (width > height * ratio) ? height : width / ratio;
		var fontsize = dimension / 42;

		$(document.body).setStyle('font-size', fontsize + 'px');
	}

});

Bootstrap.FontScaler = FontScaler;

Presentation.addInitializer(new Bootstrap.FontScaler());

}(window, document, Presentation, Presentation.Bootstrap));
