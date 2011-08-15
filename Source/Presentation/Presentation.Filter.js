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
  - Presentation/Presentation.Slide

provides:
  - Presentation.Filter
  - Presentation.DefaultFilter
...
*/

(function(Presentation, Slide){

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

/*---------------------------------------------
	Filter Section
---------------------------------------------*/

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
Slide.implement(new Presentation.Filter());


/*---------------------------------------------
	Initializer Section
---------------------------------------------*/

//The initialization filter that registers the filter of the option is registered.
function DefaultFilter(types){
	this.eventTypes = ['deactivate', 'activate'];
	if (Type.isArray(types)){
		this.eventTypes.append(types);
	}
};

DefaultFilter.implement({

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

Presentation.DefaultFilter = DefaultFilter;

Presentation.addInitializer(new Presentation.DefaultFilter());

}(Presentation, Presentation.Slide));
