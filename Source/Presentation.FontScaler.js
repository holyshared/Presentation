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

/*
It is inspired to S5 of a simple slide show system.
Simple Standards-based Slide Show System [http://meyerweb.com/eric/tools/s5/]
*/
(function(win, doc, Presentation){

function FontScaler(vsize, hsize) {
	this.vsize = vsize || 700;
	this.hsize = hsize || 1024;
	this.vscale = 22; // both yield 32 (after rounding) at 1024x768
	this.hscale = 32; // perhaps should auto-calculate based on theme's declared value?
};

FontScaler.implement({

	invoke: function(presentation){
		if (win.innerHeight) {
			var vsize = win.innerHeight;
			var hsize = win.innerWidth;
		} else if (doc.documentElement.clientHeight) {
			var vsize = doc.documentElement.clientHeight;
			var hsize = doc.documentElement.clientWidth;
		} else if (doc.body.clientHeight) {
			var vsize = doc.body.clientHeight;
			var hsize = doc.body.clientWidth;
		} else {
			var vsize = this.vsize;  // assuming 1024x768, minus chrome and such
			var hsize = this.hsize; // these do not account for kiosk mode or Opera Show
		}
		var fontsize = Math.min(Math.round(vsize/this.vscale),Math.round(hsize/this.hscale));

		var container =	presentation.getContainer();
		container.setStyle('font-size', fontsize + 'px');
	}

});

Presentation.FontScaler = FontScaler;

Presentation.addInitializer(new Presentation.FontScaler(700, 1024));

}(window, document, Presentation));
