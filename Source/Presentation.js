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
		slide: 'section',
		defaultIndex: 0
	},

	initialize: function(container, options){
		this.setOptions(options);
		this.container = $(container);
		this.contents = new Presentation.Container();
		this.applyOptions(options);
	},

	applyOptions: function(options){
		var selecter = this.options.slide;
		if (selecter) {
			var elements = this.container.getElements(this.options.slide);
			elements.each(function(element){
				var content = new Presentation.Content(element);
				this.contents.addContent(content);
			}, this);
		}
		var index = this.options.defaultIndex;
		(this.getLength() > 0) ? this.set(index) : this.setCurrentIndex(index);
	},

	set: function(index){
		this.contents.setCurrentIndex(index);
		var current = this.contents.getCurrentContent();
		var after = this.contents.getAfterContents();
		var before = this.contents.getBeforeContents();

		var move = {};
		if (after.length > 0) { move['forward'] = after; }
		if (before.length > 0) { move['backward'] = before; }
		move['center'] = current;
		this._transrate(move);
//		current.center();

//		if (after.length > 0) { after.invoke('forward'); }
//		if (before.length > 0) { before.invoke('backward'); }
//		current.center();
		return current;
	},

	first: function(){
		var first = this.contents.getFirstContent();
		var after = this.contents.getAfterContents();
		this._transrate({
			center: first,
			forward: after
		});

//		first.center();
//		after.invoke('forward');
		return first;
	},

	prev: function(){
		if (!this.contents.hasPrevContent()) {
			return;
		}
		var current = this.contents.getCurrentContent();
		var prev = this.contents.getPrevContent();
		this._transrate({
			center: prev,
			forward: current
		});
//		current.forward();
//		prev.center();
		return prev;
	},

	next: function(){
		if (!this.contents.hasNextContent()) {
			return;
		}
		var current = this.contents.getCurrentContent();
		var next = this.contents.getNextContent();
		this._transrate({
			center: next,
			backward: current
		});

//		current.backward();
//		next.center();
		return next;
	},

	last: function(){
		var last = this.contents.getLastContent();
		var before = this.contents.getBeforeContents();
		this._transrate({
			center: last,
			backward: before
		});
/*		
		last.center();
		before.invoke('backward');
*/
		return last;
	},

	_transrate: function(targets){
		for (var key in targets){
			var target = targets[key];
console.log(typeOf(target));
			switch(typeOf(target)){
				case 'array':
					target.invoke(key);
					break;
				case 'object':
					target[key]();
					break;
				default:
					throw new TypeError('aaaaa');
			}
		}
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
		if (!Type.isObject(content)) {
			throw new TypeError('It is not object.');
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
		if (!Type.isObject(content)) {
			throw new TypeError('It is not object.');
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

//new Type('PresentationContent', Presentation.Content);

}());
