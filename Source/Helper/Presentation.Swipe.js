/*
---
name: Presentation.Swipe

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Helper/Helper.Swipe

provides:
  - Presentation.Swipe
...
*/


(function(Presentation){

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

}(Presentation));
