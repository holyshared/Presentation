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
