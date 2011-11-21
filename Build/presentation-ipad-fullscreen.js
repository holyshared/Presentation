/*
---
name: Bootstrap

description: The core module of Bootstrap

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
  - Bootstrap
  - Bootstrap.Bootstrapper
  - Bootstrap.Module
  - Bootstrap.Executer
...
*/

(function(){

var Bootstrap = this.Bootstrap = function(executer, module, options){

	var executerType = executer.capitalize();
		executerClass = null;
		instance = null;

	if (!Bootstrap.Executer[executerType]){
		throw new Error(executerType + 'is not found');
	}
	executerClass = Bootstrap.Executer[executerType];

	instance = new executerClass(options);
	instance.setModule(module).init();

	return instance;

};

Bootstrap.Module = new Class({

	_executeOrder: [],
	_bootstrappers: {},

	register: function(key, options){
		if (this.isRegistered(key) === true){
			throw new Error(key + ' is already registered');
		}
		var bootstrapper = new Bootstrap.Bootstrapper(options);
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

new Type('BootstrapModule', Bootstrap.Module);


Bootstrap.Executer = {};

Bootstrap.NONE = 0;
Bootstrap.SUCCESS = 1;
Bootstrap.FAILURE = 2;

Bootstrap.Bootstrapper = new Class({

	Implements: [Events, Options],

	_title: null,
	_resource: null,
	_configuration: null,
	_handler: null,

	_status: null,
	_started: false,

	initialize: function(options){
		this.setOptions(this._prepare(options));
	},

	_prepare: function(options){
		var bootstrapper = this;
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
		this._setResultStatus(Bootstrap.SUCCESS);
		this.fireEvent('complete');
		this.fireEvent('success');
	},

	failure: function(){
		this._setResultStatus(Bootstrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
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
		var status = [Bootstrap.NONE, Bootstrap.SUCCESS, Bootstrap.FAILURE];
		if (!status.contains(type)) {
			throw new TypeError('The specified status is not valid.');
		}
		this._status = type;
	},

	getResultStatus: function(){
		return this._status;
	},

	isSuccessed: function(){
		return (this.getResultStatus() == Bootstrap.SUCCESS) ? true : false;
	},

	isFailured: function(){
		return (this.getResultStatus() == Bootstrap.FAILURE) ? true : false;
	},

	isCompleted: function(){
		return (this.getResultStatus() != Bootstrap.NONE) ? true : false;
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

new Type('Bootstrapper', Bootstrap.Bootstrapper);

}());

/*
---
name: Bootstrap.Executer.Executer

description: The core class which performs an initialization module

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Module
  - Bootstrap.Executer

provides:
  - Bootstrap.Executer.Executer
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
	_status: Bootstrap.NONE,

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
		var status = [Bootstrap.NONE, Bootstrap.SUCCESS, Bootstrap.FAILURE];
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
		return (this.getResultStatus() == Bootstrap.SUCCESS) ? true : false;
	},

	isFailured: function(){
		return (this.getResultStatus() == Bootstrap.FAILURE) ? true : false;
	},

	isCompleted: function(){
		return (this.getResultStatus() != Bootstrap.NONE) ? true : false;
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
			order.index() + 1,
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
			this._setResultStatus(Bootstrap.SUCCESS);
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
		this.fireEvent('start');
		this.bootstrap();
	},

	//abstract
	bootstrap: function(){
	},

	onFailure: function(key){
		this._setResultStatus(Bootstrap.FAILURE);
		this.fireEvent('complete');
		this.fireEvent('failure');
	}

});

}(Bootstrap.Executer));

/*
---
name: Bootstrap.Executer.Async

description: The execution module which carries out asynchronous execution of the initialization module

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Bootstrap.Executer.Executer

provides:
  - Bootstrap.Executer.Async
...
*/

(function(namespace){

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

}(Bootstrap.Executer));


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
  - Bootstrap/Bootstrap.Module
  - Bootstrap/Bootstrap.Executer.Async

provides:
  - Presentation
  - Presentation.Content
  - Presentation.Container
  - Presentation.Bootstrap
...
*/

(function(){

/*
 * var p = new Presentation({
 *     configrations: {
 *          filters: {
 *          },
 *          helpers: {
 *             swipeable: true,
 *             controller: {
 * 	              'next': 'nextButton'
 *             }
 *         }
 *     }
 * });
 * p.start();
 */

var Presentation = this.Presentation = new Class({

	Implements: [Events, Options],

	initialize: function(options){
		this.setOptions(options);
		this.contents = new Presentation.Container();
		this._attachRoles();
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
		this._changeContent(context);
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

	/*
	 * <article data-presentation-role="container">
	 *     <section data-presentation-role="content">
	 *     </section>
	 *     <section data-presentation-role="content">
	 *     </section>
	 * </article>
	 */
	_attachRoles: function(){
		var container = this.container = $(document.body).getElement('[data-presentation-role="container"]');
		var index = this.getCurrentIndex();
		var elements = container.getElements('[data-presentation-role="content"]');
		elements.each(function(element){
			var content = new Presentation.Content(element);
			this.addContent(content);
		}, this);
	},

	_executeBootstrap: function(){
		var executer = 'async',
			module = Presentation.Bootstrap,
			options = this.options;

		var that = this; 
		var bootstrap = new Bootstrap(executer, module, options);

		var events = {
			start: this.__delegator,
			progress: this.__delegator,
			success: [this.__startup, this.__delegator],
			failure: this.__delegator
		};

		Object.each(events, function(handler, key){
			if (Type.isArray(handler)){
				handler.each(function(handler){
					bootstrap.addEvent(key, handler.call(that, key));
				});
			} else {
				bootstrap.addEvent(key, handler.call(that, key));
			}
		});

		bootstrap.execute(this);
	},

	__startup: function(key){
		var that = this;
		var startup = function(){
			that.set(that.getCurrentIndex());
			that.fireEvent.apply(that, [key, arguments]);
		};
		return startup;
	},

	__delegator: function(key){

		var that = this;
		var delegator = function(){
			that.fireEvent.apply(that, [key, arguments]);
		};
		return delegator;
	},

	start: function(){
		this._executeBootstrap();
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
	},

	toElement: function(){
		return this.container;
	}

});


Presentation.Bootstrap = new Bootstrap.Module();


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
//			this.element.setStyle('left', '150%');
	    }
	});
    decorater = Decorater.Modan;
} else {
	Object.merge(Content, {
	    initialize: function(element, options){
    		this.setOptions(options);
			this.element = element;
//			this.element.setStyle('left', '150%');
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

provides:
  - Presentation.Filter
...
*/

(function(Presentation){

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
Presentation.implement(new Presentation.Filter());

}(Presentation));


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
name: Helper.Swipe

description: The swipe operation is notified to a relating specific object.

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Mobile/Swipe
  - Helper/Helper.Delegator

provides:
  - Helper.Swipe
...
*/

(function(doc, Helper){

Helper.Swipe = new Class({

	Extends: Helper.Delegator,

	_name: 'swipe',
	_handler: null,

	setup: function(){
		var observer = this.getObserver();
		if (!observer) {
			//It is assumption that dom is constructed.
			this.setObserver(doc.body);
		}
		this._handler = this._onSwipe.bind(this);
	},

	_onSwipe: function(event){
		if (!this.isEnable()) return;
		if (!this.hasMethod(event.direction)) return;
		this.delegate(event.direction);
	},

	_getObserver: function(){
		var target = this.getTarget(),
			observer = this.getObserver();
		if (target.toElement){
			observer = target.toElement();
		}
		return observer;
	}.protect(),

	enable: function() {
		var ovserver = this._getObserver();
		ovserver.addEvent('swipe', this._handler);
	},

	disable: function() {
		var ovserver = this._getObserver();
		ovserver.removeEvent('swipe', this._handler);
	},

	destroy: function() {
		delete this._handler;
	}

});

}(document, Helper));


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
  - Presentation.Helper.Swipe
...
*/

(function(Presentation, HelperNamespace){

function SwipeHelper() {
	var options = {
		methods: {
			left: 'next',
			right: 'prev'
		}
	};
	var helper = new Helper.Swipe(options);

	return helper;
}

HelperNamespace.Swipe = SwipeHelper;

}(Presentation, Presentation.Helper));


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

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper
  - Helper/Helper.Keyboard

provides:
  - Presentation.Helper.Keyboard
...
*/

(function(Presentation, HelperNamespace){

//Keyboard helper's option is added to options of Presentation.Slide.
var defaultOptions = {
	'j': 'prev',
	'k': 'next',
	'left': 'prev',
	'right': 'next',
	'0': 'first',
	'4': 'last'
};

function KeyboardHelper(options){
	var methods = convertToDelegateMethods(options);
	var keybinds = Object.merge(defaultOptions, methods);
	var helperOptions = {
		methods: keybinds
	};
	return new Helper.Keyboard(helperOptions);
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
name: Presentation.Helper.Page

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper

provides:
  - Presentation.Helper.Page
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
		var container = this.getTarget().getContainer(),
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

	_onChange: function(index, content, total){
		this._current.set('html', index + 1);
		this._total.set('html', total);
	}

});

}(document.id, Presentation, Presentation.Helper));

/*
---
name: Presentation.Helper.Controller

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper
  - Helper/Helper.Delegator

provides:
  - Presentation.Helper.Controller
...
*/

(function($, Presentation, HelperNamespace){

HelperNamespace.Controller = new Class({

	Extends: Helper.Delegator,

	options: {
		first: 'first',
		prev: 'prev',
		next: 'next',
		last: 'last'
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

	setup: function(){
		var container = this.getTarget().getContainer(),
			trigger = null;
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
		this._keys.each(function(key){
			this['_' + key].addEvent('click', this._getHandler(key));
		}, this);
	},

	disable: function(){
		this._keys.each(function(key){
			this['_' + key].removeEvent('click', this._getHandler(key));
		}, this);
	},

	destroy: function(){
		this._keys.each(function(key){
			delete this['_' + key];
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
name: Presentation.Bootstrap.Helper

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap
  - Presentation.Helper

provides:
  - Presentation.Bootstrap.Helper
...
*/

(function(Presentation, Bootstrap, Helper){

Bootstrap.Helper = {

	handler: function(presentation, configurations){

		var bootstrap = this,
			name = null,
			helper = null;

		Object.each(configurations, function(configuration, key){
			name = key.capitalize();
			if (!Helper[name]){
				throw new Error('Presection.Helper.' + name + ' is not found.');
			}
			try {
				helper = (Type.isBoolean(configuration)) ? new Helper[name]() : new Helper[name](configuration);
			} catch(error){
				bootstrap.failure(error);
			}
			presentation.addHelper(helper);
		});

		bootstrap.success();
	}

};

Bootstrap.register('helpers', Bootstrap.Helper);

}(Presentation, Presentation.Bootstrap, Presentation.Helper));


/*
---
name: Presentation.Bootstrap.Filter

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap
  - Presentation.Filter

provides:
  - Presentation.Bootstrap.Filter
...
*/

(function(Presentation, Bootstrap){

Bootstrap.Filter = {

	handler: function(presentation, configurations){

		presentation.addFilters(configurations);

		presentation.addEvents({
			'__deactivate': function(content){
				presentation.applyFilter('deactivate', content);
			},
			'__activate': function(content){
				presentation.applyFilter('activate', content);
			}
		});

		this.success();
	}

};

Bootstrap.register('filters', Bootstrap.Filter);

}(Presentation, Presentation.Bootstrap));


/*
---
name: Presentation.Bootstrap.FullScreen

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Bootstrap

provides:
  - Presentation.Bootstrap.FullScreen
...
*/

(function(win, doc, Presentation, Bootstrap){

Bootstrap.FullScreen = {

	handler: function(presentation, configuration){

		if (configuration === false) {
			return;
		}

		var height = 0;
		if (win.innerHeight) {
			height = win.innerHeight;
		} else if (doc.documentElement.clientHeight) {
			height = doc.documentElement.clientHeight;
		} else if (doc.body.clientHeight) {
			height = doc.body.clientHeight;
		}

		for (var i = 0; l = presentation.getLength(), i < l; i++){
			var content = presentation.getContent(i).toElement();
			content.setStyle('height', height);
		}
		$(presentation).setStyle('height', height);

		this.success();
	}

};

Bootstrap.register('fullscreen', Bootstrap.FullScreen);

}(window, document, Presentation, Presentation.Bootstrap));

