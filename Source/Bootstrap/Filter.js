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

//The initialization filter that registers the filter of the option is registered.
function FilterBootstrap(types){
	this.eventTypes = ['deactivate', 'activate'];
	if (Type.isArray(types)){
		this.eventTypes.append(types);
	}
};

FilterBootstrap.implement({

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

Bootstrap.Filter = FilterBootstrap;

Presentation.addInitializer(new Bootstrap.Filter());

}(Presentation, Presentation.Bootstrap));
