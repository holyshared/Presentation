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