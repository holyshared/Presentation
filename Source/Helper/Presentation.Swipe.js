/*
---
name: Presentation.Swipe

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper
  - Helper/Helper.Swipe

provides:
  - Presentation.Swipe
...
*/

(function(Presentation){

//Swipe helper's option is added to options of Presentation.Slide.
Presentation.Slide.implement({
	options: { swipe: true }
});

/**
 * var helper = new Presentation.Swipe();
 */
Presentation.Swipe = new Class({

	Extends: Helper.Swipe,

	initialize: function(){
		this.addMethods({
			left: 'next',
			right: 'prev'
		});
	}

});

//Please input sentences that translate into here.
Presentation.addInitializer(function(slide) {
	var opts = slide.options;
	if (!opts.swipe) {
		return;
	}
	slide.addHelper(new Presentation.Swipe());
});

}(Presentation));
