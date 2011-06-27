/*
---
name: ScrapSlide.Slide

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Object
  - Core/Type
  - Core/Class
  - Core/Events
  - Core/Options
  - ScrapSlide/ScrapSlide

provides: [ScrapSlide.Slide, ScrapSlide.Item]

...
*/

(function(slide){

slide.Slide = new Class({

	Implements: [Options, Events],

	_current: 0,
	_panels: [],

	options: {
	},

	initialize: function(options){
		this.setOptions(options);
	},

	addPanel: function(panel){
		if (!Type.isScrapSlideItem(panel)) {
			throw new TypeError('The specified value is not a slide item.');
		}
		panel.setSlide(this);
		this._panels.push(panel);
	},

	addPanels: function(panels){
		var self = this;
		panels.each(function(panel){
			self.addPanel(panel);
		});
	},

	removePanel: function(panel){
		this._panels.erase(panel);		
	},

	removePanels: function(panels){
		var self = this;
		panels.each(function(panel){
			self.removePanel(panel);
		});
	},

	getCurrentIndex: function(){
		return this._current;
	},

	setCurrentIndex: function(index){
		if (!this._isValid(index)) {
			throw new TypeError('');
		}
		this._current = index;
	},

	isValid: function(){
		var index = this.getCurrentIndex();
		return this._isValid(index);
	},

	_isValid: function(index){
		var count = this.getLength();
		return (index > 0 && index <= count) ? true : false;
	},

	getLength: function(){
		return this._panels.length;
	},

	prev: function(){
		var prevIndex = this.getCurrentIndex() - 1;
		if (this.isValid(prevIndex)) {
			this.setCurrentIndex(prevIndex);
		}
	},

	next: function(){
		var nextIndex = this.getCurrentIndex() + 1;
		if (this.isValid(nextIndex)) {
			this.setCurrentIndex(nextIndex);
		}
	},

	first:function(){
		this.setCurrentIndex(0);
	},

	last: function(){
		var last = this.getLength();
		this.setCurrentIndex(last);
	}

});

new Type('ScrapSlide', slide.Slide);



slide.Item = new Class({

	Implements: [Options, Events],

	options: {
		index: null,
		slide: null
	},

	_slide: null,
	_index: null,

	initialize: function(options){
		this.setOptions(this._prepare(options));
	},

	_prepare: function(options){
		var props = Object.subset(options || {}, ['index', 'slide']);
		for (var key in props){
			var setter = 'set' + key.capitalize();
			this[setter](props[key]);
			delete options[key];
		}
		return options;
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
		if (!Type.isScrapSlide(slideUI)) {
			throw new TypeError('The specified value is not a slide.');
		}
		this._slide = slideUI;
		return this;
	},

	getSlide: function(){
		return this._slide;
	},

	isCurrent: function(){
		return (this.getIndex() == this.getSlide().getCurrentIndex()) ? true : false;
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

new Type('ScrapSlideItem', slide.Item);


}(ScrapSlide));
