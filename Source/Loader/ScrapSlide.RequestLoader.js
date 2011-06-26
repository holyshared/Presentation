/*
---
name: ScrapSlide.RequestLoader

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Request.HTML
  - ScrapSlide/ScrapSlide.Panel
  - ScrapSlide/ScrapSlide.Loader

provides: [ScrapSlide.RequestLoader]

...
*/

(function(slide){

slide.RequestLoader = new Class({

	Extends: slide.Loader,

	load: function(){
		var request = new Request.HTML({
			onSuccess: function(tree, elements, html, scripts){
				var panels = [];
				elements.each(function(element){
					var panel = new slide.Panel();
					panels.push(panel);
				});
				this.fireEvent('complete', [panels]);
			}
		});
		request.send();
	}

});

/**
 * var slide = ScrapSlide.load('path/to', {
 * 	opt1: value1,
 * 	opt2: value2
 * });
 */
Object.append(ScrapSlide, {

	load: function(){
		var slide = new slide.Slide({});
		var loader = new ScrapSlide.RequestLoader({
			onComplete: function(panels){
				slide.addPanels(panels);
			}
		});
		loader.load();
		return slide;
	}

});

}(ScrapSlide));
