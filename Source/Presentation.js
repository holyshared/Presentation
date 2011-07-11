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
  - Core/Options
  - Core/Events
  - Core/Element.Style

provides:
  - Presentation
  - Presentation.Content
  - Presentation.Container
...
*/

(function(){

var Presentation = this.Presentation = new Class({

	Implements: [Events, Options],

	options: {
		slide: 'section'
	},

	initialize: function(container, options){
		this.setOptions(options);
		this.container = $(container);
		this.contents = new Presentation.Container();

		var elements = this.container.getElements(this.options.slide);
		elements.each(function(element){
			var content = new Presentation.Content(element);
			this.contents.addContent(content);
		}, this);
		this.set(0);
	},

	set: function(index){
		this.contents.setCurrentIndex(index);
		var current = this.contents.getCurrentContent();
		var after = this.contents.getAfterContents();
		var before = this.contents.getBeforeContents();
		if (after.length > 0) { after.invoke('forward'); }
		if (before.length > 0) { before.invoke('backward'); }
		current.center();
		return this;
	},

	first: function(){
		var first = this.contents.getFirstContent();
		var after = this.contents.getAfterContents();
		first.center();
		after.invoke('forward');
		return this;
	},

	prev: function(){
		if (!this.contents.hasPrevContent()) {
			return;
		}
		var current = this.contents.getCurrentContent();
		var prev = this.contents.getPrevContent();
		current.forward();
		prev.center();
		return this;
	},

	next: function(){
		if (!this.contents.hasNextContent()) {
			return;
		}
		var current = this.contents.getCurrentContent();
		var next = this.contents.getNextContent();
		current.backward();
		next.center();
		return this;
	},

	last: function(){
		var last = this.contents.getLastContent();
		var before = this.contents.getBeforeContents();
		last.center();
		before.invoke('backward');
		return this;
	}

});


var methods = [  
	'addContent',
	'addContents',
	'removeContent',
	'removeContents',
	'getCurrentIndex',
	'getCurrentContent',
//	'setCurrentIndex',
//	'setCurrentContent',
	'getContent',
	'getLength'
];
var mixins = {};
methods.each(function(method){
	mixins[method] = function(){
		return this.contents[method].apply(this.contents, arguments);
	};
});
Presentation.implement(mixins);






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
		return this;
	},

	removeContents: function(contents){
		contents.each(function(content){
			this.removeContent(content);
		}, this);
		return this;
	},

	setCurrentIndex: function(index){
		if (!this.isValid(index)) {
			throw new RangeError('The index has come first at the end.');
		}
		this.index = index;
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
		if (!this.isValid(this.index + 1)) {
			return;
		}
		this.index++;
		return this.getContent(this.index);
	},

	getPrevContent: function(){
		if (!this.isValid(this.index - 1)) {
			return;
		}
		this.index--;
		return this.getContent(this.index);
	},

	isValid: function(index){
		return (index >= 0 && index < this.getLength()) ? true : false;
	},

	hasPrevContent: function(){
		return (this.isValid(this.index - 1)) ? true : false;
	},

	hasNextContent: function(){
		return (this.isValid(this.index + 1)) ? true : false;
	}

});


Presentation.Content = new Class({

	initialize: function(element){
		this.element = element;
		this.element.setStyle('left', '150%');
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
