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
  - Presentation/Presentation.Controller

provides:
  - Presentation.Filter
...
*/

(function(Presentation, Controller){

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
Controller.implement(new Presentation.Filter());

}(Presentation, Presentation.Controller));
