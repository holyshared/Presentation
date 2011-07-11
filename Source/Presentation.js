/*
---
name: Presentation

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Array
  - Core/Function
  - Core/Type
  - Core/Class
  - Core/Element.Style

provides:
  - Presentation
  - Presentation.Content
  - Presentation.Container
...
*/

(function(){

var Presentation = this.Presentation = new Class({

	initialize: function(element){
		this.container = new Presentation.Container(element);
	},

	first: function(){
		var first = this.container.getFirstContent();
		var between = this.container.getFirstBetweenContents();
		first.center();
		between.invoke('backward');
	},

	prev: function(){
		var current = this.container.getCurrentContent();
		var prev = this.container.getPrevContent();
		current.backward();
		prev.center();
	},

	next: function(){
		var current = this.container.getCurrentContent();
		var next = this.container.getNextContent();
		current.forward();
		next.center();
	},

	last: function(){
		var last = this.container.getLastContent();
		var between = this.container.getFirstBetweenContents();
		last.center();
		between.invoke('forward');
	}

});


var methods = [  
	'addContent',
	'addContents',
	'removeContent',
	'removeContents',
	'getCurrentIndex',
	'getCurrentContent',
	'setCurrentIndex',
	'setCurrentContent',
	'getContent',
	'getLength'
];
var mixin = {};
methods.each(function(method){
	mixin[method] = function(){
		this.container.apply(this.container, arguments);
	};
});
Presentation.implement(mixin);




Presentation.Container = new Class({

	index: 0,
	contents: [],

	initialize: function(contents){
		if (contents){
			this.addContents(contents);
		}
	},

	addContent: function(content){
		if (!Type.isPresentationContent(content)) {
			throw new TypeError('It is not PresentationContent.');
		}
		this.contents.push(content);
		return this;
	},

	addContents: function(contents){
		contents.each(function(content){
			this.addContent(content);
		}, this);
		return this;
	},

	removeContent: function(content){
		if (!Type.isPresentationContent(content)) {
			throw new TypeError('It is not PresentationContent.');
		}
		this.contents.erase(content);
	},

	removeContents: function(contents){
		contents.each(function(content){
			this.removeContent(content);
		}, this);
		return this;
	},

	getCurrentIndex: function(){
		return this.index;
	},

	getCurrentContent: function(){
		var index = this.getCurrentIndex();
		return this.getContent(index);
	},

	getContent: function(index){
		return this.contents[index];
	},

	getLength: function(){
		return this.contents.length;
	},

	getFirstContent: function(){
		this.index = 0;
		return this.getContent(this.index);
	},

	getLastContent: function(){
		this.index = this.getLength() - 1;
		return this.getContent(this.index);
	},

	getBeforeContents: function(){
		var contents = [];
		var end = this.getCurrentIndex();
		for (var i = 0; i < end; i++) {
			contents.push(this.getContent(i));
		}
		return contents;
	},

	getAfterContents: function(){
		var contents = [];
		var start = this.getCurrentIndex();
		var end = this.getLength();
		for (var i = start + 1; i < end; i++) {
			contents.push(this.getContent(i));
		}
		return contents;
	},

	getNextContent: function(){
		var nextIndex = this.index + 1;
		if (!this.isValid(nextIndex)) {
			throw new TypeError('The index has come first at the end.');
		}
		return this.getContent(++this.index);
	},

	getPrevContent: function(){
		var prevIndex = this.index - 1;
		if (!this.isValid(prevIndex)) {
			throw new TypeError('The index has come first at the end.');
		}
		return this.getContent(--this.index);
	},

	isValid: function(index){
		return (index > 0 && index < this.getLength()) ? true : false;
	}

});


Presentation.Content = new Class({

	initialize: function(element){
		this.element = element;
	},

	forward: function(){
		this.element.setStyle('left', '150%');
	},

	backward: function(){
		this.element.setStyle('left', '0%');
	},

	center: function(){
		this.element.setStyle('left', '50%');
	},

	toElement: function(){
		return this.element;
	}

});

new Type('PresentationContent', Presentation.Content);

}());
