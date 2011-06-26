/*
---
name: ScrapSlide.SlidePanel

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class
  - ScrapSlide/ScrapSlide
  - ScrapSlide/ScrapSlide.Slide

provides: [ScrapSlide.SlidePanel]

...
*/

(function(slide){
	
slide.SlidePanel = new Class({

	_index: null,
	_slide: null,
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

	setSlide: function(slideUI){
		if (!Type.isSlide(slideUI)) {
			throw new TypeError('The specified value is not a slide.');
		}
		this._slide = slideUI;
		return this;
	},

	getSlide: function(){
		return this._slide;
	},

	isCurrent: function(){
		return (this.getIndex() == this._slide.getCurrentIndex()) ? true : false;
	},

	isChild: function(slide){
		return (this.getSlide() == slide) ? true : false;
	},

	prev: function(){
		if (!this.getSlide()) {
			throw new Error('The slide is not set.');
		}
		this.getSlide().prev();
	},

	next: function(){
		if (!this.getSlide()) {
			throw new Error('The slide is not set.');
		}
		this.getSlide().next();
	}

});

}(ScrapSlide));
