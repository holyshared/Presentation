/*
---
name: Presentation.Page

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper

provides:
  - Presentation.Page
...
*/

(function($, Presentation){

Presentation.Slide.implement({
	options: {
		page: {
			current: 'current',
			total: 'total'
		}
	}
});

Presentation.Page = new Class({

	Extends: Helper.HelperObject,

	_name: 'page',
	_current:null,
	_total: null,
	_handler: null,

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

	_onChange: function(index, content, total){
		this._current.set('html', index + 1);
		this._total.set('html', total);
	}

});


Presentation.addInitializer(function(slide) {
	var opts = slide.options;
	if (!opts.page) {
		return;
	}
	slide.addHelper(new Presentation.Page(opts.page));
});

}(document.id, Presentation));