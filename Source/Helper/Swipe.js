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
  - Presentation.Helper.Swipe
...
*/

(function(Presentation, HelperNamespace){

//Swipe helper's option is added to options of Presentation.Slide.
//Presentation.Slide.implement({
//	options: { swipe: true }
//});

/**
 * var helper = new Presentation.Swipe();
 */
HelperNamespace.Swipe = new Class({

	Extends: Helper.Swipe,

	initialize: function(){
		this.addMethods({
			left: 'next',
			right: 'prev'
		});
	}

});

}(Presentation, Presentation.Helper));
