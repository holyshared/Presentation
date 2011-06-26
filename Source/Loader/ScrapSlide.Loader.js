/*
---
name: ScrapSlide.Loader

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class
  - Core/Events
  - Core/Options
  - ScrapSlide/ScrapSlide

provides: [ScrapSlide.Loader]

...
*/

(function(slide){

slide.Loader = new Class({

	Implements: [Events, Options]

});
	
}(ScrapSlide));
