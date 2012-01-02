/*
---
name: Presentation.FullScreen

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation

provides:
  - FullScreen
...
*/

(function(win, doc, Presentation){

/*
	var p = new Presentation('id');
	p.displayFullScreen().start();
 */
Presentation.implement({

	displayFullScreen: function(){

		var height = 0;
		if (win.innerHeight) {
			height = win.innerHeight;
		} else if (doc.documentElement.clientHeight) {
			height = doc.documentElement.clientHeight;
		} else if (doc.body.clientHeight) {
			height = doc.body.clientHeight;
		}

		for (var i = 0; l = this.getLength(), i < l; i++){
			var content = this.getContent(i).toElement();
			content.setStyles({
				'height': height,
				'width': '100%',
				'margin-left': '-50%'
			});
		}

		var container = this.getContainerElement();
		container.setStyles({
			'height': height,
			'width': '100%'
		});

		return this;
	}

});

}(this, document, Presentation));
