/*
---
name: ScrapSlide.Panel

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - ScrapSlide/ScrapSlide.Item

provides: [ScrapSlide.Panel]

...
*/

(function(slide){
	
slide.Panel = new Class({

	Extends: slide.Item,

	_index: null,
	_element: null,

	initialize: function(element, options){
		this.parent(options);
		this.setElement(element);
	},

	getElement: function(){
		return this._element;
	},

	setElement: function(element){
		if (!Type.isElement(element)) {
			throw new TypeError('The specified value is not a element.');
		}
		this._element = element;
		return this;
	}

});

new Type('ScrapSlidePanel', slide.Panel);

}(ScrapSlide));
