(function($, helper){

helper.CustumController = new Class({

    Extends: Helper.Delegator,

    //Helper options
	options: {
		prev: 'prev', //Prev button class name
		next: 'next' //Next button class name
	},

    //Helper properties
    //@see http://holyshared.github.com/Docs
	_name: 'custumController',
    _methods: {
		prev: 'prev', //this.delegate('prev'); -> Presentation.prev
		next: 'next' //this.delegate('next'); -> Presentation.next
	},

    //Controller button keys
    _keys: [ 'prev', 'next' ],

    //Controller event handlers
    _handlers: {},

    //Helper require methods
    //setup, enable, disable, destory
	setup: function(){

		var presentation = this.getTarget(),
			container = presentation.getLayoutElement(),
			trigger = null;

        this._keys.each(function(key){
			trigger = container.getElement('.' + this.options[key]);
			if (!trigger){
				throw new Error('The button ' + key + ' is not found.');
			}
			this['_' + key] = trigger;
		}, this);

		presentation.addEvent('change', this._changeButtonState.bind(this));

		this._createHandlers();
	},

	enable: function(){
		this._keys.each(function(key){
			this._getTrigger(key).addEvent('click', this._getHandler(key));
		}, this);
	},

	disable: function(){
		this._keys.each(function(key){
			this._getTrigger(key).removeEvent('click', this._getHandler(key));
		}, this);
	},

	destroy: function(){
		this._keys.each(function(key){
			delete this['_' + key];
		}, this);
	},

	_changeButtonState: function(current, total, content){
		if (current >= total - 1) {
			//disable next button;
			this._getTrigger('prev').removeClass('disabled');
			this._getTrigger('next').addClass('disabled');
		} else if (current <= 0) {
			//disable prev button;
			this._getTrigger('prev').addClass('disabled');
			this._getTrigger('next').removeClass('disabled');
		} else {
			this._getTrigger('prev').removeClass('disabled');
			this._getTrigger('next').removeClass('disabled');
		}
	},

	_getTrigger: function(key){
		var name = '_' + key;
		if (!this[name]){
			throw new Error('Trigger ' + key + ' is not found');
		}
		return this[name];
	},

    //An event handler is acquired based on the key of a button. 
	_getHandler: function(key){
		return this._handlers[key];
	},

    //Creation of an event handler
	_createHandlers: function(){
		this._keys.each(function(key){
			this._handlers[key] = this._createHandler(key);
		}, this);
		return this._handlers;
	},

	_createHandler: function(key){
		var that = this;
		return function(event){
            //Delegate of an event
            that.delegate(key);
		};
	}

});

}(document.id, Presentation.Helper));