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
  - Presentation.Content
  - Presentation.Container
  - Presentation.Initializer
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
		this.applyOptions();
	},

	applyOptions: function(){
		var opts = this.options;
		var selecter = opts.slide;
		if (selecter) {
			var elements = this.container.getElements(selecter);
			elements.each(function(element){
				var content = new Presentation.Content(element);
				this.contents.addContent(content);
			}, this);
		}
	},

	set: function(index){
		var context = this._getContext(index);
		this._transrate(context);
	},

	first: function(){
		var context = this._getFirstContext();
		this._transrate(context);
	},

	prev: function(){
		var context = this._getPrevContext();
		if (!context) return;
		this._transrate(context);
	},

	next: function(){
		var context = this._getNextContext();
		if (!context) return;
		this._transrate(context);
	},

	last: function(){
		var context = this._getLastContext();
		this._transrate(context);
	},

	_setup: function(){
		var handlers = Presentation.getInitializers();
		handlers.each(function(handler){
			if (Type.isFunction(handler)) {
				handler(this);
			} else if (Type.isObject(handler)) {
				handler.invoke(this);
			}
		}, this);
	},

	start: function(){
		this._setup();

		var index = this.options.defaultIndex;
		(this.getLength() > 0) ? this.set(index) : this.setCurrentIndex(index);
	},

	getContainer: function(){
		return this.container;
	},

	_getContext: function(index){
		this.contents.setCurrentIndex(index);
		var current = this.contents.getCurrentContent();
		var after = this.contents.getAfterContents();
		var before = this.contents.getBeforeContents();

		var context = {};
		if (after.length > 0) { context['forward'] = after; }
		if (before.length > 0) { context['backward'] = before; }
		context['center'] = current;
		return context;
	},

	_getFirstContext: function(){
		var first = this.contents.getFirstContent();
		var after = this.contents.getAfterContents();
		return {
			center: first,
			forward: after
		};
	},

	_getPrevContext: function(){
		if (!this.contents.hasPrevContent()) {
			return;
		}
		var current = this.contents.getCurrentContent();
		var prev = this.contents.getPrevContent();
		return {
			center: prev,
			forward: current
		};
	},

	_getNextContext: function(){
		if (!this.contents.hasNextContent()) {
			return;
		}
		var current = this.contents.getCurrentContent();
		var next = this.contents.getNextContent();
		return {
			center: next,
			backward: current
		}
	},

	_getLastContext: function(){
		var last = this.contents.getLastContent();
		var before = this.contents.getBeforeContents();
		return {
			center: last,
			backward: before
		}
	},

	_transrate: function(targets){
		for (var key in targets){
			var target = targets[key];
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
		var args = [
			this.contents.getCurrentContent(),
			this.contents.getCurrentIndex(),
			this.contents.getLength()
		];
		this.fireEvent('change', args);
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

provides:
  - Presentation.Filter
  - Presentation.BeforeFilter
  - Presentation.AfterFilter
...
*/

(function(Presentation){

//Filter types
var defineFilterTypes = ['before', 'after'];

//Override methods
var overideMethods = [ 'set', 'first', 'prev', 'next', 'last' ];

//Validator of filter
function validateFilter(filter) {
	if (!Type.isFunction(filter)){
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

//Method of override of building in filter
function includeFilter(method) {

	var name = (method == 'set') ? '' : method.capitalize();

	return function(){
		var context = this['_get' + name + 'Context'].apply(this, arguments);
		if (!context) return;
		var content = context.center;
		if (this.hasFilter('before')) {
			this.applyFilter('before', content);
		}

		this._transrate(context);

		if (this.hasFilter('after')) {
			this.applyFilter('after', content);
		}

	};
};

//It is override as for set, first, prev, next and last.
//Processing that executes the filter is built in.
var OverridePresentation = Presentation.prototype;
overideMethods.each(function(name){
	OverridePresentation[name] = includeFilter(name);
});

//It is override as for applyOptions.
var method = 'applyOptions';
var previous = OverridePresentation[method];
OverridePresentation[method] = function(){

	previous.call(this);

	var opts = this.options;
	defineFilterTypes.each(function(type){
		var filters = opts[type + 'Filters'];
		var add = 'add' + type.capitalize() + 'Filters';
		if (filters){
			this[add](filters);
		}
	});
}




Presentation.Filter = new Class({

	filters: {},

	addFilter: function(type, filter){
		this.filters[type].push(validateFilter(filter));
	},

	addFilters: function(filters){
		var values = validateFilters(filters);
		values.each(function(filter, index){
			this.addFilter(filter.type, filter.handler);
		}, this);
	},

	removeFilter: function(type, filter){
		if (!this.hasFilter(type)) return this;
		this.filters[type].erase(validateFilter(filter));
	},

	removeFilters: function(filters){
		var type;
		if (typeOf(filters) == 'object'){
			for (type in filters) this.removeFilter(type, filters[type]);
			return this;
		}
		type = filters;
		var targets = this.filters[type];
		while(this.hasFilter(type)) {
			this.removeFilter(type, targets.getLast());
		}
		return this;
	},

	hasFilter: function(type){
		if (!this.filters[type]) {
			return false;
		}
		return (this.filters[type].length > 0) ? true : false;
	},

	applyFilter: function(type, content){
		var filters = this.filters[type];
		filters.each(function(filter){
			filter(content);
		});
	}

});
Presentation.implement(new Presentation.Filter());



defineFilterTypes.each(function(key){

	var name = key.capitalize();
	Presentation[name + 'Filter'] = function(){
		var options = {};
		options[key + 'Filters'] = null;

		var extend = Object.merge(createTypeMethod(key), options);

		OverridePresentation.filters[key] = [];

		Presentation.implement(extend);
	}

});


Presentation.implement(new Presentation.BeforeFilter());
Presentation.implement(new Presentation.AfterFilter());

function createTypeMethod(type) {

	var methods = {};
	var name = type.capitalize();

	methods['add' + name + 'Filter'] = function(filter){
		this.addFilter(type, filter);
	};

	methods['add' + name + 'Filters'] = function(){
		var filters = Array.from(arguments);
		var appendFilters = [];
		filters.each(function(filter){
			appendFilters.push({
				type: type,
				handler: filter
			});
		});
		this.addFilters(appendFilters);
	};

	methods['remove' + name + 'Filter'] = function(filter){
		this.removeFilter(type, filter);
	};

	methods['remove' + name + 'Filters'] = function(){
//console.log(type);
		this.removeFilters(type);
	};

	methods['has' + name + 'Filter'] = function(){
		return this.hasFilter(type);
	};

	return methods;

};

}(Presentation));


/*
---
name: Presentation.FontScaler

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation

provides:
  - Presentation.FontScaler
...
*/

(function(win, doc, Presentation){

function FontScaler(ratio) {
	this.ratio = ratio || 1.3;
};

FontScaler.implement({

	invoke: function(presentation){
		var height = 0, width = 0;

		if (win.innerHeight) {
			height = win.innerHeight;
			width = win.innerWidth;
		} else if (doc.documentElement.clientHeight) {
			height = doc.documentElement.clientHeight;
			width = doc.documentElement.clientWidth;
		} else if (doc.body.clientHeight) {
			height = doc.body.clientHeight;
			width = doc.body.clientWidth;
		}
		var dimension = (width > height * this.ratio) ? height : width / this.ratio;
		var fontsize = dimension / 42;

		$(document.body).setStyle('font-size', fontsize + 'px');
	}

});

Presentation.FontScaler = FontScaler;

Presentation.addInitializer(new Presentation.FontScaler(1024 / 768));

}(window, document, Presentation));

