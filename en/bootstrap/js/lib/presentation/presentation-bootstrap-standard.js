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


/*
---
name: Presentation.FullScreen

description: The function which can be displayed by a full screen is offered.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation

provides:
  - FullScreen
...
*/

(function(win, doc, Presentation){

/*
	var p = new Presentation('id');
	p.displayFullScreen().start();
 */
Presentation.implement({

	displayFullScreen: function(){

		var height = 0;
		if (win.innerHeight) {
			height = win.innerHeight;
		} else if (doc.documentElement.clientHeight) {
			height = doc.documentElement.clientHeight;
		} else if (doc.body.clientHeight) {
			height = doc.body.clientHeight;
		}

		for (var i = 0; l = this.getLength(), i < l; i++){
			var content = this.getContent(i).toElement();
			content.setStyles({
				'height': height,
				'width': '100%',
				'margin-left': '-50%'
			});
		}

		var container = this.getContainerElement();
		container.setStyles({
			'height': height,
			'width': '100%'
		});

		return this;
	}

});

}(this, document, Presentation));


/*
---
name: Moostrap

description: The core module of Moostrap

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Core
  - Core/Object
  - Core/Type
  - Core/Options
  - Core/Events

provides:
  - Moostrap
  - Moostrap.Bootstrapper
  - Moostrap.Module
  - Moostrap.Executer
...
*/

(function(){

var Moostrap = this.Moostrap = function(executer, module, options){

	var executerType = executer,
		executerClass = null,
		instance = null;

	if (!Moostrap.Executer[executerType]){
		throw new Error(executerType + ' is not found');
	}
	executerClass = Moostrap.Executer[executerType];

	instance = new executerClass(options);
	instance.setModule(module).init();

	return instance;

};

Moostrap.Module = new Class({

	_executeOrder: [],
	_bootstrappers: {},
	_bootstrapCount: 0,

	register: function(key, options){
		var bootstrapper = null;
		if (this.isRegistered(key) === true){
			throw new Error(key + ' is already registered');
		}

		bootstrapper = new Moostrap.Bootstrapper(options);
		bootstrapper.setOrder(this._bootstrapCount);

		this._bootstrapCount++;
		this._bootstrappers[key] = bootstrapper;
		this._executeOrder.push(key);
		return this;
	},

	unregister: function(key){
		if (this.isRegistered(key) === false){
			throw new Error(key + ' is not registered');
		}
		delete this._bootstrappers[key];
		this._executeOrder.erase(key);
		return this;
	},

	isRegistered: function(key){
		if (!this._bootstrappers[key]){
			return false;
		}
		return true;
	},

	getBootstrapper: function(key){
		if (this.isRegistered(key) === false){
			throw new Error(key + ' is not registered');
		}
		return this._bootstrappers[key];
	},

	getBootstrappers: function(){
		return this._bootstrappers;
	},

	getLength: function(){
		return this._executeOrder.length;
	},

	getRegisteredKeys: function(){
		var iterator = {
			_cursor: 0,
			_collection: this._executeOrder,
			hasNext: function(){
				return (this._collection.length - 1 >= this._cursor);
			},
			current: function(){
				return this._collection[this._cursor];
			},
			next: function(){
				if (this.hasNext() === false){
					return;
				}
				this._cursor++;
			},
			index: function(){
				return this._cursor;
			},
			length: function(){
				return this._collection.length;
			}
		};
		return iterator;
	}

});

new Type('BootstrapModule', Moostrap.Module);


Moostrap.Executer = {};

Moostrap.NONE = 0;
Moostrap.SUCCESS = 1;
Moostrap.FAILURE = 2;

Moostrap.Bootstrapper = new Class({

	Implements: [Events, Options],

	_title: null,
	_resource: null,
	_configuration: null,
	_handler: null,
	_order: 0,

	_status: null,
	_started: false,

	initialize: function(options){
		this.setOptions(this._prepare(options));
	},

	_prepare: function(options){
		var bootstrapper = this
			method = null,
			setter = null,
			handler = null;

		['title', 'resource', 'configuration', 'handler'].each(function(key){
			if (!options[key]){
				return;
			}

			method = key.capitalize();
			setter = 'set' + method;

			handler = bootstrapper[setter];
			handler.call(bootstrapper, options[key]);

			delete options[key];
		});
		return options;
	},

	success: function(){
		this._setResultStatus(Moostrap.SUCCESS);
		this.fireEvent('complete');
		this.fireEvent('success');
	},

	failure: function(){
		this._setResultStatus(Moostrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
	},

	setOrder: function(orderNo){
		if (!Type.isNumber(orderNo)){
			throw new TypeError('The specified order is not valid.');
		}
		this._order = orderNo;
	},

	getOrder: function(){
		return this._order;
	},

	setTitle: function(title){
		if (!Type.isString(title)){
			throw new TypeError('The specified title is not valid.');
		}
		this._title = title;
	},

	getTitle: function(){
		return this._title;
	},

	setResource: function(resource){
		if (!Type.isObject(resource)){
			throw new TypeError('The specified resource is not valid.');
		}
		this._resource = resource;
		return this;
	},

	getResource: function(){
		return this._resource;
	},

	getConfiguration: function(){
		return this._configuration;
	},

	setConfiguration: function(value){
		if (!value){
			throw new TypeError('The specified configuration is not valid.');
		}
		switch(typeOf(value)){
			case 'object':
				this._configuration = Object.merge(this._configuration || {}, value);
				break;
			case 'array':
				if (!this._configuration){
					this._configuration = [];
				}
				this._configuration.combine(value);
				break;
			default:
				this._configuration = value;
				break;
		}
		return this;
	},

	setHandler: function(handler){
		if (!Type.isFunction(handler)){
			throw new TypeError('The specified value is not function');
		}
		this._handler = handler;
	},

	_setResultStatus: function(type){
		var status = [Moostrap.NONE, Moostrap.SUCCESS, Moostrap.FAILURE];
		if (!status.contains(type)) {
			throw new TypeError('The specified status is not valid.');
		}
		this._status = type;
	},

	getResultStatus: function(){
		return this._status;
	},

	isSuccessed: function(){
		return (this.getResultStatus() == Moostrap.SUCCESS) ? true : false;
	},

	isFailured: function(){
		return (this.getResultStatus() == Moostrap.FAILURE) ? true : false;
	},

	isCompleted: function(){
		return (this.getResultStatus() != Moostrap.NONE) ? true : false;
	},

	isStarted: function(){
		return this._started;
	},

	execute: function(){
		this._started = true;
		this.fireEvent('start');

		this._handler.call(this, this.getResource(), this.getConfiguration());
	}

});

new Type('Bootstrapper', Moostrap.Bootstrapper);

}());

/*
---
name: Moostrap.Executer.Executer

description: The core class which performs an initialization module

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Moostrap.Module
  - Moostrap.Executer

provides:
  - Moostrap.Executer.Executer
...
*/

(function(namespace){

namespace.Executer = new Class({

	Implements: [Events, Options],

	/* properties */
	_resource: null,
	_module: null,
	_configurations: {},

	_completed: 0,
	_started: false,
	_status: Moostrap.NONE,

	initialize: function(options){
		this.setOptions(this._prepare(options));
	},

	_prepare: function(options){
		var executer = this,
			method = '',
			setter = '',
			handler = null;

		if (!options) {
			return;
		}

		['resource', 'configurations', 'module'].each(function(key){
			if (!options[key]){
				return;
			}
			method = key.capitalize();
			setter = 'set' + method;

			handler = executer[setter];
			handler.call(executer, options[key]);

			delete options[key];
		});
		return options;
	},

	init: function(){
		var model = this,
			module = this.getModule(),
			bootstrappers = null;

		bootstrappers = module.getBootstrappers();

		if (model.getResource()) {
			Object.each(bootstrappers, function(bootstrapper, key){
				bootstrapper.setResource(model.getResource());
			});
		}

		Object.each(bootstrappers, function(bootstrapper, key){
			model._setupBootstrapper(key, bootstrapper);
		});
	},

	setModule: function(module){
		if (!Type.isBootstrapModule(module)) {
			throw new TypeError('The specified module is not valid.');
		}
		this._module = module;
		return this;
	},

	getModule: function(){
		return this._module;
	},

	setResource: function(resource){
		if (!Type.isObject(resource)) {
			throw new TypeError('The specified resource is not valid.');
		}
		this._resource = resource;
		return this;
	},

	getResource: function(){
		return this._resource;
	},

	setConfigurations: function(configurations){
		if (!Type.isObject(configurations)) {
			throw new TypeError('The specified configurations is not valid.');
		}
		this._configurations = configurations;
		return this;
	},

	getConfigurations: function(){
		return this._configurations;
	},

	getConfiguration: function(key){
		if (!this._configurations[key]) {
			return;
		}
		return this._configurations[key];
	},

	getExecuteOrder: function(){
		if (this._executeOrder){
			return this._executeOrder;
		}
		this._executeOrder = this.getModule().getRegisteredKeys();
		return this._executeOrder;
	},

	_setResultStatus: function(type){
		var status = [Moostrap.NONE, Moostrap.SUCCESS, Moostrap.FAILURE];
		if (!status.contains(type)) {
			throw new TypeError('The specified status is not valid.');
		}
		this._status = type;
	},

	getResultStatus: function(){
		return this._status;
	},

	isStarted: function(){
		return this._started;
	},

	isSuccessed: function(){
		return (this.getResultStatus() == Moostrap.SUCCESS) ? true : false;
	},

	isFailured: function(){
		return (this.getResultStatus() == Moostrap.FAILURE) ? true : false;
	},

	isCompleted: function(){
		return (this.getResultStatus() != Moostrap.NONE) ? true : false;
	},

	getCompletedCount: function(){
		return this._completed;
	},

	_notifyBootstrap: function(type, key){
		var args = [],
			order = this.getExecuteOrder(),
			module = this.getModule(),
			handler = null;

		handler = module.getBootstrapper(key);

		args = [
			key,
			handler.getTitle(),
			handler.getOrder() + 1,
			module.getLength()
		];
		this.fireEvent(type, args);
	},

	_beforeBootstrap: function(key){
		this._notifyBootstrap('beforeBootstrap', key);
	},

	_afterBootstrap: function(key){
		this._notifyBootstrap('afterBootstrap', key);
		if (this.getCompletedCount() >= this.getModule().getLength() - 1) {
			if (this.isFailured()) {
				return;
			}
			this._setResultStatus(Moostrap.SUCCESS);
			this.fireEvent('complete');
			this.fireEvent('success');
			return;
		}
		this._completed++;
	},

	execute: function(resource){
		var module = this.getModule(),
			bootstrappers = {};

		if (this.isCompleted()){
			return;
		}

		if (!this.isStarted()){
			this._started = true;
		}

		if (resource){
			bootstrappers = module.getBootstrappers();
			Object.each(bootstrappers, function(bootstrapper, key){
				bootstrapper.setResource(resource);
			});
			this.setResource(resource);
		}
		this.fireEvent('start', [module]);
		this.bootstrap();
	},

	//abstract
	bootstrap: function(){
	},

	onFailure: function(key){
		this._setResultStatus(Moostrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
	}

});

}(Moostrap.Executer));

/*
---
name: Moostrap.Executer.Async

description: The execution module which carries out asynchronous execution of the initialization module

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Moostrap.Executer.Executer

provides:
  - Moostrap.Executer.Async
...
*/

(function(namespace){

Moostrap.ASYNC_EXECUTER = 'Async';

namespace.Async = new Class({

	Extends: namespace.Executer,

	bootstrap: function(){
		var key = null,
			handler = null,
			module = this.getModule(),
			executeOrder = this.getExecuteOrder();

		while(executeOrder.hasNext()){
			if (this.isCompleted()){
				return;
			}
			key = executeOrder.current();
			handler = module.getBootstrapper(key);

			this._beforeBootstrap(key);

			handler.execute();
			executeOrder.next();
		};
	},

	_setupBootstrapper: function(key, bootstrapper){
		var args = [key],
			events = {},
			configuration = null;

		Object.append(events, {
			success: this.onSuccess.bind(this, args),
			failure: this.onFailure.bind(this, args)
		});

		configuration = this.getConfiguration(key) || null;
		if (configuration){
			bootstrapper.setConfiguration(configuration);
		}
		bootstrapper.addEvents(events);
	},

	onSuccess: function(key){
		this._afterBootstrap(key);
	}

});

}(Moostrap.Executer));


/*
---
name: Bootstrap

description: Core module of bootstrap 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Moostrap/Moostrap.Executer.Async

provides:
  - Core
  - Module
...
*/

(function(Presentation, Module){

Presentation.Bootstrap = {};
Presentation.Bootstrap.Module = Module;

}(Presentation, new Moostrap.Module()));


/*
---
name: Presentation.Filter

description: The module which offers the filter facility applied to contents

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class
  - Presentation/Presentation

provides:
  - Filter
...
*/

(function(Presentation){

var observeEvents = ['activate', 'deactivate'];

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

//Filter interface
Presentation.Filter = new Class({

	filters: [],

	addFilter: function(filter){
		var presentation = this;

		this.filters.push(validateFilter(filter));

		observeEvents.each(function(key){
			if (Type.isFunction(filter[key]) === true){
				filter[key] = filter[key].bind(filter);
			}
			presentation._enableListener('__' + key + '__', filter[key] || null);
		});
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
		var presentation = this;

		if (!this.hasFilter(filter)){
			return this;
		}

		this.filters.erase(validateFilter(filter));

		observeEvents.each(function(key){
			presentation._disableListener('__' + key + '__', filter[key] || null);
		});
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
			if (!filter[type]){
				return;
			}
			filter[type](content);
		});
	},

	_enableListener: function(type, callback){
		if (!callback){
			return this;
		}
		this.addEvent(type, callback);
		return this;
	},

	_disableListener: function(type, callback){
		if (!callback){
			return this;
		}
		this.removeEvent(type, callback);
		return this;
	}

});
Presentation.implement(new Presentation.Filter());

}(Presentation));


/*
---
name: Bootstrap.Filter

description: The module which carries out initial setting of the filter

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap/Module
  - Presentation/Filter

provides:
  - Filter
...
*/

(function(Module){

/*
	var bootstrap = new Moostrap('sync', Presentation.Bootstrap.Module, {
		configurations: {
			filters: [filter1, filter2, filter3]
		}
	});
	bootstrap.execute(presentation);
*/
Module.register('filters', {

	title: 'setup of filter',

	configuration: [],

	handler: function(presentation, configuration){
		var bootstrapper = this;

		if (!Type.isArray(configuration)){
			bootstrapper.success();
			return;
		}

		try {
			configuration.each(function(filter){
				presentation.addFilter(filter);
			});
		} catch(exception){
			throw exception;
			bootstrapper.failure();
		}
		bootstrapper.success();
	}

});

}(Presentation.Bootstrap.Module));


/*
---
name: Helper

description: The miscellaneous function is offered to the object built in.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Type
  - Core/Class
  - Core/Options
  - Core/Event

provides:
  - Helper
  - Helper.Assigns
  - Helper.Pluggable
...
*/

(function(){

function validateHelper(helper) {
	if (!(Type.isFunction(helper.bind) && Type.isFunction(helper.unbind))) {
		throw new TypeError('It is an invalid helper.');
	}
	return helper;
}

var Helper = this.Helper = new Class({

	_helpers: {},

	addHelper: function(helper){
		var key = null,
			parent = this,
			bindHelper = validateHelper(helper);

		bindHelper.addEvents({
			enable: function(){
				parent.fireEvent('enableHelper', [bindHelper]);
			},
			disable: function(){
				parent.fireEvent('disableHelper', [bindHelper]);
			}
		})
		.bind(this);

		this.fireEvent('bindHelper', [bindHelper]);

		key = bindHelper.getName();
		this._helpers[key] = bindHelper;
		return this;
	},

	addHelpers: function(){
		var helpers = Array.from(arguments);
		helpers.each(function(helper){
			this.addHelper(helper);
		}, this);
		return this;
	},

	removeHelper: function(helper){
		var unbindHelper = validateHelper(helper),
			key = unbindHelper.getName();

		unbindHelper.unbind()
			.destroy();

		delete this._helpers[key];

		this.fireEvent('unbindHelper', [unbindHelper]);

		return this;
	},

	removeHelpers: function(){
		var helpers = Array.from(arguments);
		if (helpers.length <= 0) {
			helpers = this.getHelpers();
		}
		helpers.each(function(helper){
			this.removeHelper(helper);
		}, this);
		return this;
	},

	getHelper: function(name){
		if (!this.hasHelper(name)){
			throw new Error('Helper ' + name + ' is not found.');
		}
		return this._helpers[name];
	},

	getHelpers: function(){
		var helpers = [],
			names = Array.from(arguments);
		if (names.length <= 0) {
			names = Object.keys(this._helpers);
		}
		names.each(function(key){
			helpers.push(this.getHelper(key));
		}, this);
		return helpers;
	},

	enableHelper: function(name){
		var helper = this.getHelper(name);
		helper.setEnable(true);
		return this;
	},

	disableHelper: function(name){
		var helper = this.getHelper(name);
		helper.setEnable(false);
		return this;
	},

	hasHelper: function(name){
		return (this._helpers[name]) ? true : false;
	},

	isEnableHelper: function(name){
		var helper = this.getHelper(name);
		return helper.isEnable();
	},

	isDisableHelper: function(name){
		var helper = this.getHelper(name);
		return (helper.isEnable()) ? false : true;
	}

});


Helper.Assigns = {

    Assigns: function(properties){
        if (!this.prototype.setOptions) return;
        var setOptions = this.prototype.setOptions;
        var decorator = function(options){
			if (!options) return;
            properties.each(function(key){
                if (options[key]) {
                    var method = key.capitalize();
                    var setter = 'set' + method;
                    if (this[setter]) {
                        var handler = this[setter];
                        handler.call(this, options[key]);
                    }
                    delete options[key];
                }
            }, this);
			setOptions.call(this, options);
        };
        this.prototype.setOptions = decorator;
    }

};

Object.append(Class.Mutators, Helper.Assigns);


Helper.Pluggable = new Class({

	Implements: [Options, Events],

	Assigns: ['name', 'target', 'enable'],

	_name: null,
	_target: null,
	_enable: true,
	_setuped: false,

	setName: function(name){
		if (!Type.isString(name)){
			throw new TypeError('Name should be a character string.');
		}
		this._name = name;
		return this;
	},

	getName: function(){
		return this._name;
	},

	setTarget: function(target){
		if (!(Type.isObject(target) || target == null)){
			throw new TypeError('Specified target is not an object or null.');
		}
		this._target = target;
		return this;
	},

	getTarget: function(){
		return this._target;
	},

	setObserver: function(observer){
		if (!(Type.isObject(observer) || Type.isElement(observer))){
			throw new TypeError('Specified observer is an object or not element.');
		}
		this._observer = observer;
		return this;
	},

	getObserver: function(){
		return this._observer;
	},

	setEnable: function(value){
		if (this.isEnable() == value) {
			return;
		}
		if (this.isSetuped() === false) {
			this._setupHelper();
		}
		return this._chageStatus(value);
	},

	_setupHelper: function(){
		this.setup();
		this._setuped = true;
	},

	isSetuped: function(){
		return this._setuped;
	},

	_chageStatus: function(value){
		var eventType = (value) ? 'enable' : 'disable';
		this[eventType]();
		this.fireEvent(eventType);
		this._enable = value;
		return this;
	},

	bind: function(control){
		if (!Type.isObject(control)) {
			throw new TypeError('It is an invalid object.');
		}
		this.setTarget(control);
		if (this.isSetuped() === false) {
			this._setupHelper();
		}
		if (this.isEnable()) {
			this._chageStatus(true);
		}
		return this;
	},

	unbind: function(){
		this.setEnable(false);
		this.setTarget(null);
		this._setuped = false;
		return this;
	},

	isEnable: function(){
		return (this._enable) ? true : false;
	}

});

}());

/*
---
name: Presentation.Helper

description: The enhancement module incorporating a helper

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Helper/Helper

provides:
  - Helper
...
*/

(function(Presentation){

Presentation.Helper = {};

Presentation.implement(new Helper());

}(Presentation));


/*
---
name: Helper.Delegator

description: Delegate of the event is carried out to the object object incorporating a helper function.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Helper/Helper.Pluggable
  - Helper/Helper.Assigns

provides:
  - Helper.Delegator
...
*/

(function(doc, Helper){

Helper.Delegator = new Class({

	Implements: [Helper.Pluggable],

	Assigns: ['name', 'target', 'observer', 'methods', 'enable'],

	_observer: null,
	_methods: {},

	initialize: function(options) {
		this.setOptions(options);
	},

	setObserver: function(observer){
		if (!(Type.isObject(observer) || Type.isElement(observer))){
			throw new TypeError('Specified observer is an object or not element.');
		}
		this._observer = observer;
		return this;
	},

	getObserver: function(){
		return this._observer;
	},

	getMethod: function(key){
		if (!this.hasMethod(key)) {
			throw new Error('The specification ' + key + ' method is not found.');
		}
		return this._methods[key];
	},

	getMethods: function(){
		var methods = [],
			names = Array.from(arguments);
		if (names.length <= 0) {
			names = Object.keys(this._methods);
		}
		names.each(function(key){
			methods.push(this.getMethod(key));
		}, this);
		return methods;
	},

	setMethods: function(methods) {
		this._methods = {};
		this.addMethods(methods);
	},

	addMethod: function(key, method){
		if (this.hasMethod(method)) {
			return;
		}
		this._methods[key] = method;
		return this;
	},

	addMethods: function(methods){
		for (var key in methods) {
			this.addMethod(key, methods[key]);
		}
		return this;
	},

	removeMethod: function(key){
		if (!this.hasMethod(key)) {
			throw new TypeError('Because method ' + key + ' doesn\'t exist, it is not possible to delete it.');
		}
		delete this._methods[key];
		return this;
	},

	removeMethods: function(){
		var methods = Array.from(arguments);
		if (methods.length <= 0) {
			methods = this.getMethods();
		}
		methods.each(function(method){
			this.removeMethod(method);
		}, this);
		return this;
	},

	hasMethod: function(key){
		return (this._methods[key]) ? true : false;
	},

	delegate: function(key, args){
		var method = this.getMethod(key),
			target = this.getTarget();
		if (!Type.isFunction(target[method])) {
			throw new Error('Method ' + method + ' doesn\'t exist or it is an invalid method.');
		}
		target[method].apply(target, args);
	}

});

}(document, Helper));

/*
---
name: Helper.Keyboard

description: The input with the keyboard is notified to the related specific object.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Helper/Helper.Delegator

provides:
  - Helper.Keyboard
...
*/

(function(doc, Helper){

Helper.Keyboard = new Class({

	Extends: Helper.Delegator,

	_name: 'keyboard',
	_handler: null,
	_observer: doc,

	_onKeydown: function(event){
		if (!this.isEnable()) return;
		if (!this.hasMethod(event.key)) return;
		this.delegate(event.key);
	},

	setup: function(){
		this._handler = this._onKeydown.bind(this);
	},

	enable: function() {
		var ovserver = this.getObserver();
		ovserver.addEvent('keydown', this._handler);
	},

	disable: function() {
		var ovserver = this.getObserver();
		ovserver.removeEvent('keydown', this._handler);
	},

	destroy: function() {
		delete this._handler;
	}

});

}(document, Helper));

/*
---
name: Presentation.Helper.Keyboard

description: The helper who enables keyboard operation

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Helper
  - Helper/Helper.Keyboard

provides:
  - Helper.Keyboard
...
*/

(function(Presentation, HelperNamespace){

//Keyboard helper's option is added to options of Presentation.Slide.
var defaults = {
	'j': 'prev',
	'k': 'next',
	'left': 'prev',
	'right': 'next',
	'0': 'first',
	'4': 'last'
};

function KeyboardHelper(options){
	var methods = null,
		keybinds = null;

	options = options || {};

	keybinds = options.keybinds || {};
	methods = convertToDelegateMethods(keybinds);
	delete options.keybinds;

	options.methods = Object.merge(defaults, methods);

	return new Helper.Keyboard(options);
}

function convertToDelegateMethods(options){
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
}

HelperNamespace.Keyboard = KeyboardHelper;

}(Presentation, Presentation.Helper));


/*
---
name: Bootstrap.Keyboard

description: The module which carries out initial setting of the keyboard helper

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap/Module
  - Presentation/Helper.Keyboard

provides:
  - Keyboard
...
*/

(function(Module, Helper){

/*
	var bootstrap = new Moostrap('sync', Presentation.Bootstrap.Module, {
		configurations: {
			keyboard: {
				//keyboard helper configuration
			}
		}
	});
	bootstrap.execute(presentation);
*/
Module.register('keyboard', {

	title: 'setup of keyboard helper',

	handler: function(presentation, configuration){
		var bootstrapper = this,
			helper = null;

		if (!Type.isObject(configuration)){
			configuration = {};
		}

		try {
			helper = new Helper.Keyboard(configuration);
			presentation.addHelper(helper);
		} catch(exception){
			throw exception;
			bootstrapper.failure();
		}
		bootstrapper.success();
	}

});

}(Presentation.Bootstrap.Module, Presentation.Helper));


/*
---
name: Presentation.Helper.Page

description: The helper who displays the number of pages

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Helper

provides:
  - Helper.Page
...
*/

(function($, Presentation, HelperNamespace){

HelperNamespace.Page = new Class({

	Implements: [Helper.Pluggable],

	options: {
		current: 'current',
		total: 'total'
	},

	_name: 'page',
	_current: null,
	_total: null,
	_handler: null,

	initialize: function(options) {
		this.setOptions(options);
	},

	setup: function(){
		var container = this.getTarget().getLayoutElement(),
			opts = this.options;
		this._current = container.getElement('.' + opts.current);
		this._total = container.getElement('.' + opts.total);
		this._handler = this._onChange.bind(this);
	},

	enable: function(){
		var slide = this.getTarget();
		slide.addEvent('change', this._handler);
	},

	disable: function(){
		var slide = this.getTarget();
		slide.removeEvent('change', this._handler);
	},

	destroy: function(){
		delete this._current;
		delete this._total;
		delete this._handler;
	},

	_onChange: function(index, total, content){
		this._current.set('html', index + 1);
		this._total.set('html', total);
	}

});

}(document.id, Presentation, Presentation.Helper));

/*
---
name: Bootstrap.Page

description: The module which carries out initial setting of the page helper

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap/Module
  - Presentation/Helper.Page

provides:
  - Page
...
*/

(function(Module, Helper){

/*
	var bootstrap = new Moostrap('sync', Presentation.Bootstrap.Module, {
		configurations: {
			page: {
				//page helper configuration
			}
		}
	});
	bootstrap.execute(presentation);
*/
Module.register('page', {

	title: 'setup of page helper',

	handler: function(presentation, configuration){
		var bootstrapper = this,
			helper = null;

		if (!Type.isObject(configuration)){
			configuration = {};
		}

		try {
			helper = new Helper.Page(configuration);
			presentation.addHelper(helper);
		} catch(exception){
			throw exception;
			bootstrapper.failure();
		}
		bootstrapper.success();
	}

});

}(Presentation.Bootstrap.Module, Presentation.Helper));


/*
---
name: Presentation.Helper.Controller

description: A GUI interface is offered

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Helper
  - Helper/Helper.Delegator

provides:
  - Helper.Controller
...
*/

(function($, Presentation, HelperNamespace){

HelperNamespace.Controller = new Class({

	Extends: Helper.Delegator,

	options: {
		first: 'first',
		prev: 'prev',
		next: 'next',
		last: 'last',
		disabled: 'disabled'
	},

	_name: 'controller',
	_keys: [ 'first', 'prev', 'next', 'last' ],
	_methods: {
		first: 'first',
		prev: 'prev',
		next: 'next',
		last: 'last'
	},
	_handlers: {},
	_changeState: null,

	setup: function(){
		var container = this.getTarget().getLayoutElement(),
			trigger = null;

		this._changeState = this._onChange.bind(this);
		this._keys.each(function(key){
			trigger = container.getElement('.' + this.options[key]);
			if (!trigger){
				throw new Error('The button ' + key + ' is not found.');
			}
			this['_' + key] = trigger;
		}, this);
		this._createHandlers();
	},

	enable: function(){
		this.getTarget().addEvent('change', this._changeState);
		this._keys.each(function(key){
			this['_' + key].addEvent('click', this._getHandler(key));
		}, this);
	},

	disable: function(){
		this.getTarget().removeEvent('change', this._changeState);
		this._keys.each(function(key){
			this['_' + key].removeEvent('click', this._getHandler(key));
		}, this);
	},

	destroy: function(){
		this._keys.each(function(key){
			delete this['_' + key];
		}, this);
	},

	_onChange: function(current, total, content){
		var currentNumber = current + 1;
		//is first?
		if (currentNumber <= 1){
			this._changeButtonState([ 'next', 'last' ]);
		//is last?
		} else if (currentNumber >= total){
			this._changeButtonState([ 'first', 'prev' ]);
		} else {
			this._changeButtonState([ 'first', 'prev', 'next', 'last' ]);
		}
	},

	_changeButtonState: function(enables){
		var disabledClass = this.options.disabled;
		this._keys.each(function(key){
			if (enables.contains(key)){
				this['_' + key].removeClass(disabledClass);
			} else {
				this['_' + key].addClass(disabledClass);
			}
		}, this);
	},

	_getHandler: function(key){
		return this._handlers[key];
	},

	_createHandlers: function(){
		this._keys.each(function(key){
			this._handlers[key] = this._createHandler(key);
		}, this);
		return this._handlers;
	},

	_createHandler: function(key){
		var that = this;
		return function(event){
			that.delegate(key);
		};
	}

});

}(document.id, Presentation, Presentation.Helper));

/*
---
name: Bootstrap.Controller

description: The module which carries out initial setting of the controller helper

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap/Module
  - Presentation/Helper.Controller

provides:
  - Controller
...
*/

(function(Module, Helper){

/*
	var bootstrap = new Moostrap('sync', Presentation.Bootstrap.Module, {
		configurations: {
			controller: {
				//controller helper configuration
			}
		}
	});
	bootstrap.execute(presentation);
*/
Module.register('controller', {

	title: 'setup of controller helper',

	handler: function(presentation, configuration){
		var bootstrapper = this,
			helper = null;

		if (!Type.isObject(configuration)){
			configuration = {};
		}

		try {
			helper = new Helper.Controller(configuration);
			presentation.addHelper(helper);
		} catch(exception){
			throw exception;
			bootstrapper.failure();
		}
		bootstrapper.success();
	}

});

}(Presentation.Bootstrap.Module, Presentation.Helper));

