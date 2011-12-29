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