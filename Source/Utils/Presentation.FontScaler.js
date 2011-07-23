/*
---
name: Presentation.FontScaler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation

provides:
  - Presentation.FontScaler
...
*/

(function(win, doc, Presentation){

function FontScaler(ratio) {
	this.ratio = ratio || 1.3;
};

FontScaler.implement({

	invoke: function(slide){
		var height = 0, width = 0;

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
		var dimension = (width > height * this.ratio) ? height : width / this.ratio;
		var fontsize = dimension / 42;

		$(document.body).setStyle('font-size', fontsize + 'px');
	}

});

Presentation.FontScaler = FontScaler;

Presentation.addInitializer(new Presentation.FontScaler(1024 / 768));

}(window, document, Presentation));
