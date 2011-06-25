/*
---
name: ScrapSlide.Slide

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class
  - ScrapSlide/ScrapSlide

provides: [ScrapSlide.Slide]

...
*/

(function(slide){

slide.Slide = new Class({

	_current: 0,	
	_panels: [],

	initialize: function(){
		
	},

	addPanel: function(panel){
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


	isValid: function(){
		var index = this.getCurrentIndex();
		return this._isValid(index);
	},

	_isValid: function(index){
		var count = this.getLength();
		return (index > 0 && index <= count) ? true : false;
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
	
}(ScrapSlide));
