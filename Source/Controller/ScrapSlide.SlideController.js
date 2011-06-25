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

provides: [ScrapSlide.SlideController]

...
*/

(function(slide){

slide.SlideController = new Class({

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

}(ScrapSlide));
