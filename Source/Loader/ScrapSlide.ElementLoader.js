/*
---
name: ScrapSlide.ElementLoader

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Element
  - ScrapSlide/ScrapSlide
  - ScrapSlide/ScrapSlide.Loader
  - ScrapSlide/ScrapSlide.SlidePanel

provides: [ScrapSlide.ElementLoader]

...
*/

(function(slide){

slide.ElementLoader = new Class({

	Extends: slide.Loader,

	load: function(element){
		var panels = [];
		var elements = element.getElements('section');
		elements.each(function(element){
			var panel = new slide.SlidePanel();
			panels.push(panel);
		});
		this.fireEvent('complete', [panels]);
		return panels;
	}

});

/**
 * var slide = ScrapSlide.create(document.body, {
 * 	opt1: value1,
 * 	opt2: value2
 * });
 */
Object.append(ScrapSlide, {

	create: function(element, options){
		var slideUI = new slide.Slide(options);

		var loader = new slide.ElementLoader({
			onComplete: function(panels){
				slideUI.addPanels(panels);
			}
		});
		loader.load(element);

		return slideUI;
	}

});

}(ScrapSlide));
