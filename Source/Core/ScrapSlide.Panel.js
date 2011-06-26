/*
---
name: ScrapSlide.Panel

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - ScrapSlide/ScrapSlide.Item

provides: [ScrapSlide.Panel]

...
*/

(function(slide){
	
slide.Panel = new Class({

	Extends: slide.Item,

	_index: null,
	_element: null,

	initialize: function(element){
		this._element = element;
	},

	getIndex: function(){
		return this._index;
	},

	setIndex: function(index){
		if (!Type.isNumber(index)) {
			throw new TypeError('The specified value is not a integer.');
		}
		this._index = index;
		return this;
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
