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
			start: this.__delgater,
			progress: this.__delgater,
			success: [this.__startup, this.__delgater],
			failure: this.__delgater
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

	__delgater: function(key){
		var that = this;
		var delgater = function(){
			that.fireEvent.apply(that, [key, arguments]);
		};
		return delgater;
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
