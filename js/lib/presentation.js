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
  - Presentation.Initializer
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
		this.fireEvent('__blur', [content]);
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
			this.fireEvent('__focus', [this.getCurrentContent()]);
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
			this.contents.getCurrentContent(),
			this.contents.getCurrentIndex(),
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


Presentation.Initializer = new Class({

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

Object.append(Presentation, new Presentation.Initializer());


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


/*
---
name: Presentation.Filter

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class
  - Presentation/Presentation
  - Presentation/Presentation.Slide

provides:
  - Presentation.Filter
  - Presentation.DefaultFilter
...
*/

(function(Presentation, Slide){

//Validator of filter
function validateFilter(filter) {
	if (!Type.isObject(filter)){
		throw new TypeError('invalid filter');
	}
	return filter;
}

function validateFilters(filters){
	if (!Type.isArray(filters)){
		throw new TypeError('invalid filters');
	};
	return filters;
}

/*---------------------------------------------
	Filter Section
---------------------------------------------*/

//Filter interface
Presentation.Filter = new Class({

	filters: [],

	addFilter: function(filter){
		this.filters.push(validateFilter(filter));
		return this;
	},

	addFilters: function(filters){
		var values = validateFilters(filters);
		values.each(function(filter, index){
			this.addFilter(filter);
		}, this);
		return this;
	},

	removeFilter: function(filter){
		if (!this.hasFilter(filter)) return this;
		this.filters.erase(validateFilter(filter));
		return this;
	},

	removeFilters: function(filters){
		var values = validateFilters(filters);
		values.each(function(filter, index){
			this.removeFilter(filter);
		}, this);
		return this;
	},

	hasFilter: function(filter){
		return this.filters.contains(filter);
	},

	applyFilter: function(type, content){
		var filters = this.filters;
		filters.each(function(filter){
			if (filter[type]){
				filter[type](content);
			}
		});
	}

});
Slide.implement(new Presentation.Filter());


/*---------------------------------------------
	Initializer Section
---------------------------------------------*/

//The initialization filter that registers the filter of the option is registered.
function DefaultFilter(types){
	this.eventTypes = ['blur', 'foucs'];
	if (Type.isArray(types)){
		this.eventTypes.append(types);
	}
};

DefaultFilter.implement({

	_createEventListeners: function(slide){
		var events = {};
		this.eventTypes.each(function(name){
			events['__' + name] = function(content){
				slide.applyFilter(name, content);
			}
		});
		return events;
	},

	invoke: function(slide){
		var opts = slide.options, events;
		if (!opts.filters) {
			return;
		}
		events = this._createEventListeners(slide);

		slide.addFilters(opts.filters)
			.addEvents(events);

		delete opts.fliters;
	}

});

Presentation.DefaultFilter = DefaultFilter;

Presentation.addInitializer(new Presentation.DefaultFilter());

}(Presentation, Presentation.Slide));


/*
---
name: Presentation.Helper

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Helper/Helper

provides:
  - Presentation.Helper
...
*/

(function(Presentation){

Presentation.Slide.implement(new Helper());

}(Presentation));


/*
---
name: Presentation.Keyboard

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper
  - Helper/Helper.Keyboard

provides:
  - Presentation.Keyboard
...
*/

(function(Presentation){

//Keyboard helper's option is added to options of Presentation.Slide.
var defaultOptions = {
	'j': 'prev',
	'k': 'next',
	'left': 'prev',
	'right': 'next',
	'0': 'first',
	'4': 'last'
};

Presentation.Slide.implement({
	options: { keyboard: defaultOptions }
});

function parseOptions(options) {
	if (!options) return {};
	var methods = {};
	var keys = Object.keys(options);
	var values = Object.values(options);
	values.each(function(typeKey, index){
		switch(typeOf(typeKey)) {
			case 'string':
				methods[typeKey] = keys[index];
				break;
			case 'array':
				typeKey.each(function(key){
					methods[key] = keys[index];
				});
				break;
			default:
				throw new TypeError('Helper\'s option is an illegal value.');
		}
	});
	return methods;
};

function createHelper(options) {

	var methods = parseOptions(options);
	var keybinds = Object.merge(defaultOptions, methods);
	var helper = new Helper.Keyboard({
		methods: keybinds
	});
	return helper;

};

Presentation.Keyboard = createHelper;


//Please input sentences that translate into here.
Presentation.addInitializer(function(slide) {
	var opts = slide.options;
	if (!opts.keyboard) {
		return;
	}
	slide.addHelper(new Presentation.Keyboard(opts.keyboard));
});


}(Presentation));


/*
---
name: Presentation.Swipe

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper
  - Helper/Helper.Swipe

provides:
  - Presentation.Swipe
...
*/

(function(Presentation){

//Swipe helper's option is added to options of Presentation.Slide.
Presentation.Slide.implement({
	options: { swipe: true }
});

/**
 * var helper = new Presentation.Swipe();
 */
Presentation.Swipe = new Class({

	Extends: Helper.Swipe,

	initialize: function(){
		this.addMethods({
			left: 'next',
			right: 'prev'
		});
	}

});

//Please input sentences that translate into here.
Presentation.addInitializer(function(slide) {
	var opts = slide.options;
	if (!opts.swipe) {
		return;
	}
	slide.addHelper(new Presentation.Swipe());
});

}(Presentation));

