/*
---
name: Presentation

description: core module of Presentation.js

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Array
  - Core/Function
  - Core/Type
  - Core/Object
  - Core/Class
  - Core/Options
  - Core/Events
  - Core/Element
  - Core/Element.Style

provides:
  - Presentation
  - Content
  - Container
...
*/

(function($){

/*
 * var p = new Presentation('presentation');
 * p.start();
 */

var Presentation = this.Presentation = new Class({

	Implements: [Events, Options],

	options: {
		//onStart
		//onTransitionStart
		//onTransitionEnd
		//onChange
	},

	_startup: false,
	_containerRole: '[data-presentation-role="container"]',
	_contentsRole: '[data-presentation-role="content"]',

	initialize: function(element, options){
		var applyElement = $(element);
		if (!applyElement){
			throw new Error('The element of the object which applies a function is not found.');
		}
		this.setOptions(options);
		this._contents = new Presentation.Container();
		this._setup(applyElement);
	},

	addContent: function(content){
		content.addEvent('transitionEnd', this._onTransitionEnd.bind(this));
		this._contents.addContent(content);
	},

	addContents: function(contents){
		contents.each(function(content){
			this.addContent(content);
		}, this);
	},

	set: function(index){
		var content = null,
			context = null;

		content = this.getCurrentContent();
		context = this._getContext(index);

		this.fireEvent('__deactivate__', [content]);
		this._contents.setCurrentIndex(index);
		this._changeContent(context);
		this._notifyChange();
	},

	first: function(){
		var index = this._contents.getFirstIndex();
		this.set(index);
	},

	prev: function(){
		var index = this._contents.getPrevIndex();
		if (index == null) {
			return;
		}
		this.set(index);
	},

	next: function(){
		var index = this._contents.getNextIndex();
		if (!index) {
			return;
		}
		this.set(index);
	},

	last: function(){
		var index = this._contents.getLastIndex();
		this.set(index);
	},

	start: function(){
		var index = this.getCurrentIndex(),
			context = this._getContext(index);

		this._contents.setCurrentIndex(index);
		this._changeContent(context);
		this._notifyChange();
		this._startup = true;
		this.fireEvent('start');
	},

	isStarted: function(){
		return this._startup;
	},

	_setup: function(element){
		var container = $(element).getElement(this._containerRole);
		if (!container){
			throw new Error('The container element of contents is not found.');
		}

		var elements = container.getElements(this._contentsRole);
		if (!elements){
			throw new Error('The element of contents is not found.');
		}
		elements.each(function(element){
			var content = new Presentation.Content(element);
			this.addContent(content);
		}, this);
		this._container = container;
		this._elements = elements;
		this._layout = element;
	},

	getLayoutElement: function(){
		return this._layout;
	},

	getContainerElement: function(){
		return this._container;
	},

	_onTransitionEnd: function(){
		if (this._moves++ >= this.getLength() - 1) {
			this.fireEvent('transitionEnd', [
				this.getCurrentIndex(),
				this.getCurrentContent()
			]);
			this.fireEvent('__activate__', [this.getCurrentContent()]);
		}
	},

	_changeContent: function(targets){
		this._moves = 0;
		this.fireEvent('transitionStart', [this.getCurrentContent()]);
		for (var key in targets){
			var target = targets[key];
			if (!target) {
				continue;
			}
			switch(typeOf(target)){
				case 'array':
					target.invoke(key);
					break;
				case 'object':
					target[key]();
					break;
				default:
					throw new TypeError('Invalid context.');
			}
		}
	},

	_notifyChange: function(){
		var args = [
			this._contents.getCurrentIndex(),
			this._contents.getLength(),
			this._contents.getCurrentContent()
		];
		this.fireEvent('change', args);
	},

	_getContext: function(index){

		var current = this._contents.getContent(index);
		var after = this._contents.getAfterContents(index);
		var before = this._contents.getBeforeContents(index);

		var context = {
			forward: after || null,
			backward: before || null,
			center: current
		};

		return context;
	},

	toElement: function(){
		return this.getLayoutElement();
	}

});

var methods = [
	'removeContent',
	'removeContents',
	'getCurrentIndex',
	'getCurrentContent',
	'getContent',
	'getLength'
];
var mixins = {};
methods.each(function(method){
	mixins[method] = function(){
		return this._contents[method].apply(this._contents, arguments);
	};
});
Presentation.implement(mixins);


Presentation.Container = new Class({

	_index: 0,
	_contents: [],

	initialize: function(contents){
		if (contents){
			this.addContents(contents);
		}
	},

	addContent: function(content){
		if (!Type.isObject(content)) {
			throw new TypeError('It is not object.');
		}
		this._contents.push(content);
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
		this._contents.erase(content);
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
		this._index = index;
		return this;
	},

	getCurrentIndex: function(){
		return this._index;
	},

	getCurrentContent: function(){
		var index = this.getCurrentIndex();
		return this.getContent(index);
	},

	getContent: function(index){
		return this._contents[index];
	},

	getLength: function(){
		return this._contents.length;
	},

	getBeforeContents: function(index){
		var contents = [];
		for (var i = 0; i < index; i++) {
			contents.push(this.getContent(i));
		}
		return (contents.length > 0) ? contents : null;
	},

	getAfterContents: function(index){
		var contents = [];
		var end = this.getLength();
		for (var i = index + 1; i < end; i++) {
			contents.push(this.getContent(i));
		}
		return (contents.length > 0) ? contents : null;
	},

	isValid: function(index){
		return (index >= 0 && index < this.getLength()) ? true : false;
	},

	hasPrevContent: function(){
		return (this.isValid(this._index - 1)) ? true : false;
	},

	hasNextContent: function(){
		return (this.isValid(this._index + 1)) ? true : false;
	},

	getFirstIndex: function(){
		return 0;
	},

	getPrevIndex: function(){
		if (!this.hasPrevContent()){
			return;
		}
		return this._index - 1;
	},

	getNextIndex: function(){
		if (!this.hasNextContent()){
			return;
		}
		return this._index + 1;
	},

	getLastIndex: function(){
		return this.getLength() - 1;
	}

});


var Decorater = {

	//ie7, ie8
	Legacy: function(handler) {
		return function() {
			this.fireEvent('transitionStart', [this]);
			handler.call(this);
			this.fireEvent('transitionEnd', [this]);
		};
	},

	//firefox, safari, chrome, opera, ie9
	Modan: function(handler) {
		return function() {
			this.fireEvent('transitionStart', [this]);
			handler.call(this);
		};
	}

};

var Content = {

	forward: function(){
		this._element.setStyle('left', '150%');
	},

	backward: function(){
		this._element.setStyle('left', '-50%');
	},

	center: function(){
		this._element.setStyle('left', '50%');
	},

	toElement: function(){
		return this._element;
	}

};

var decorater, transitionEnd;

if (Browser.chrome || Browser.safari) {
	transitionEnd = 'webkitTransitionEnd';
} else if (Browser.firefox) {
	transitionEnd = 'transitionend';
} else if (Browser.opera) {
	transitionEnd = 'oTransitionEnd';
} else {
	transitionEnd = 'msTransitionEnd';
}

if (Browser.ie && Browser.version <= 9) {
	Object.merge(Content, {
		initialize: function(element, options){
			this.setOptions(options);
			this._element = element;
		}
	});
	decorater = Decorater.Modan;
} else {
	Object.merge(Content, {
		initialize: function(element, options){
			this.setOptions(options);
			this._element = element;
			this._element.addEventListener(transitionEnd, function(){
				this.fireEvent('transitionEnd', [this]);
			}, false);
		}
	});
	decorater = Decorater.Legacy;
}

['backward', 'forward', 'center'].each(function(method){
	Content[method] = decorater(Content[method]);
});

//Presentation.Content
Presentation.Content = new Class(Object.merge({

	Implements: [Events, Options]

}, Content));

}(document.id));
