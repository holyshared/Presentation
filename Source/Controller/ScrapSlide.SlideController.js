/*
---
name: ScrapSlide.SlideController

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Core/Class
  - ScrapSlide/ScrapSlide
  - ScrapSlide/ScrapSlide.SlideController

provides: [ScrapSlide.SlideController, ScrapSlide.SlideConnecter]

...
*/

(function(slide){

slide.SlideController = new Class({

	initialize: function(element, options){
	},

	prev: function(){
	},

	next: function(){
	},

	first: function(){
	},

	last: function(){
	}

});

new Type('SlideController', slide.SlideController);


slide.SlideConnecter = new Class({

	_slide: null,

	setSlide: function(slide){
		if (!Type.isSlideController(slide)){ 
			throw new TypeError('Please specify SlideController.');
		}
		this._slide = slide;
	},

	getSlide: function(){
		return this._slide;
	}

});

}(ScrapSlide));
