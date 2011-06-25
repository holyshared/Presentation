/*
---
name: ScrapSlide.NavigatorController

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Core/Class
  - ScrapSlide/ScrapSlide
  - ScrapSlide/ScrapSlide.SlideConnecter

provides: [ScrapSlide.NavigatorController]

...
*/

(function(slide){

slide.NavigatorController = new Class({

	Implements: [SlideConnecter],

	prev: function(){
		this._slide.prev();
	},

	next: function(){
		this._slide.prev();
	},

	first: function(){
		this._slide.prev();
	},

	last: function(){
		this._slide.prev();
	}

});

new Type('NavigatorController', slide.NavigatorController);


slide.SlideController.implemnt({

	_navigator: null,

	setNavigator: function(nav){
		if (!Type.isNavigatorController(nav)){
			throw new TypeError('Please specify NavigatorController.');
		}
		nav.setSlide(this);
		this._navigator = nav;
	},

	getNavigator: function(){
		return this._navigator;
	}

});

}(ScrapSlide));
