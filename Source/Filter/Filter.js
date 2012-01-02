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
  - Filter
...
*/

(function(Presentation){

var observeEvents = ['activate', 'deactivate'];

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
		var presentation = this;
		this.filters.push(validateFilter(filter));
		observeEvents.each(function(key){
			presentation._enableListener('__' + key + '__', filter[key] || null);
		});
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
		var presentation = this;
		if (!this.hasFilter(filter)) return this;
		this.filters.erase(validateFilter(filter));
		observeEvents.each(function(key){
			presentation._disableListener('__' + key + '__', filter[key] || null);
		});
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
			if (!filter[type]){
				return;
			}
			filter[type](content);
		});
	},

	_enableListener: function(type, callback){
		if (!callback){
			return this;
		}
		this.addEvent(type, callback);
		return this;
	},

	_disableListener: function(type, callback){
		if (!callback){
			return this;
		}
		this.removeEvent(type, callback);
		return this;
	}

});
Presentation.implement(new Presentation.Filter());

}(Presentation));
