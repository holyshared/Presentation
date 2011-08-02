Todo List
==============================================

Animation Events
----------------------------------------------

var Transerater = new Class({

	Implements: [Events, Options],

	initialize: function(options){
		this.setOptions(options);
		this.elements.addEvent('webkitAnimationEnd', this._onComplete.bind(this));
	},

	_onComplete: function(){
		if (this.ends > this.elements.length){
			this.fireEvent('transrateEnd');
		}
	},

	_transerate: function(context){
		this.fireEvent('transrateStart');
	},

	execute: function(context){
		this._transerate(context);
	}

});

var transerater = new Transerater({
	'transrateStart': function(){
		if (!this.hasFilter('before')) {
			return;
		}
		this.applyFilter('before', this.getCurrentContent());
	},
	'transrateEnd': function(content){
		if (!this.hasFilter('after')) {
			return;
		}
		this.applyFilter('after', this.getCurrentContent());
	}
});
