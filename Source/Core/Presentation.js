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
  - Core/Object
  - Core/Class
  - Core/Options
  - Core/Events
  - Core/Element
  - Core/Element.Style

provides:
  - Presentation
  - Presentation.Slide
  - Presentation.Content
  - Presentation.Container
  - Presentation.Bootstrap
...
*/

(function(){

var Presentation = this.Presentation = function(container, options){

	var slide = new Presentation.Slide(container, options);

	var handlers = Presentation.getInitializers();
	handlers.each(function(handler){
		if (Type.isFunction(handler)) {
			handler(slide);
		} else if (Type.isObject(handler)) {
			handler.invoke(slide);
		}
	});

	return slide;

};


Presentation.Slide = new Class({

	Implements: [Events, Options],

	options: {
		slide: 'section',
		defaultIndex: 0
	},

	initialize: function(container, options){
		this.setOptions(options);
		this.container = $(container);
		this.contents = new Presentation.Container();
		this.applyOptions();
	},

	applyOptions: function(){
		var opts = this.options;
		var selecter = opts.slide;
		if (selecter) {
			var elements = this.container.getElements(selecter);
			elements.each(function(element){
				var content = new Presentation.Content(element);
				this.addContent(content);
			}, this);
		}
	},

	addContent: function(content){
		content.addEvent('transitionEnd', this._onTransitionEnd.bind(this));
		this.contents.addContent(content);
	},

	addContents: function(contents){
		contents.each(function(content){
			this.addContent(content);
		}, this);
	},

	set: function(index){
		var content = this.getCurrentContent(),
			context = this._getContext(index);
		this.fireEvent('__deactivate', [content]);
		this.contents.setCurrentIndex(index);
		this._change(context);
	},

	first: function(){
		var index = this.contents.getFirstIndex();
		this.set(index);
	},

	prev: function(){
		var index = this.contents.getPrevIndex();
		if (index == null) {
			return;
		}
		this.set(index);
	},

	next: function(){
		var index = this.contents.getNextIndex();
		if (!index) {
			return;
		}
		this.set(index);
	},

	last: function(){
		var index = this.contents.getLastIndex();
		this.set(index);
	},

	start: function(){
		var index = this.options.defaultIndex;
		if (this.getLength() > 0) {
			var context = this._getContext(index);
			this.contents.setCurrentIndex(index);
			this._change(context);
		} else {
			this.setCurrentIndex(index);
		}
	},

	getContainer: function(){
		return this.container;
	},

	_onTransitionEnd: function(){
		if (this._moves++ >= this.getLength() - 1) {
			this.fireEvent('transitionEnd', [
				this.getCurrentIndex(),
				this.getCurrentContent()
			]);
			this.fireEvent('__activate', [this.getCurrentContent()]);
		}
	},

	_change: function(targets){
		this._moves = 0;
		this.fireEvent('transitionStart', [content]);
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
		var args = [
			this.contents.getCurrentIndex(),
			this.contents.getCurrentContent(),
			this.contents.getLength()
		];
		this.fireEvent('change', args);
	},

	_getContext: function(index){
		var current = this.contents.getContent(index);
		var after = this.contents.getAfterContents(index);
		var before = this.contents.getBeforeContents(index);

		var context = {
			forward: after || null,
			backward: before || null,
			center: current
		};

		return context;
	}

});


Presentation.Bootstrap = new Class({

	initializers: [],

	addInitializer: function(handler){
		if (!(Type.isFunction(handler) || Type.isFunction(handler.invoke))) {
			throw new TypeError('Initializer should be an object that mounts function or the invoke method.');
		}
		if (this.hasInitializer(handler)) return;
		this.initializers.push(handler);
		return this;
	},

	addInitializers: function(){
		var handlers = Array.from(arguments);
		handlers.each(function(handler, index){
			this.addInitializer(handler);
		}, this);
		return this;
	},

	getInitializer: function(index){
		if (!this.initializers[index]){
			throw new Error('There is no specified initializer.');
		}
		return this.initializers[index];
	},

	getInitializers: function(){
		return this.initializers;
	},

	removeInitializer: function(handler){
		if (!this.hasInitializer(handler)) return this;
		this.initializers.erase(handler);
		return this;
	},

	removeInitializers: function(){
		var handlers = Array.from(arguments);
		if (handlers.length <= 0) {
			handlers = this.getInitializers();
		}
		handlers.each(function(handler, index){
			this.removeInitializer(handler);
		}, this);
		return this;
	},

	hasInitializer: function(handler){
		return (this.initializers.contains(handler)) ? true : false;
	}

});

Object.append(Presentation, new Presentation.Bootstrap());


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
		return this.contents[method].apply(this.contents, arguments);
	};
});
Presentation.Slide.implement(mixins);


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
		return (this.isValid(this.index - 1)) ? true : false;
	},

	hasNextContent: function(){
		return (this.isValid(this.index + 1)) ? true : false;
	},

	getFirstIndex: function(){
		return 0;
	},

	getPrevIndex: function(){
		if (!this.hasPrevContent()){
			return;
		}
		return this.index - 1;
	},

	getNextIndex: function(){
		if (!this.hasNextContent()){
			return;
		}
		return this.index + 1;
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

if (Browser.ie && Browser.version <= 7) {
	Object.merge(Content, {
    	initialize: function(element, options){
    		this.setOptions(options);
			this.element = element;
			this.element.setStyle('left', '150%');
	    }
	});
    decorater = Decorater.Modan;
} else {
	Object.merge(Content, {
	    initialize: function(element, options){
    		this.setOptions(options);
			this.element = element;
			this.element.setStyle('left', '150%');
	        this.element.addEventListener(transitionEnd, function(){
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

}());
