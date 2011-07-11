/*
---
name: Presentation.Filter

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Core/Class

provides:
  - Presentation.TypeFilter
...
*/

(function(Presentation){

function validateFilter(filter) {
	if (!Type.isFunction(filter)){
		throw new TypeError('aaaaaaaaaaaaaaaaaaa');
	}
	return filter;
}

function validateFilters(filters){
	if (!Type.isObject(filters)){
		throw new TypeError('aaaaaaaaaaaaaaaaaaa');
	};
	return filters;
}

Presentation.implement({

	filters: {},

	addFilter: function(type, filter){
		this.filters[type] = validateFilter(filter);
	},

	addFilters: function(filters){
		var values = validateFilters(filters);
		Object.each(values, function(filter, index){
			this.addFilter(filter.type, filter.handler);
		}, this);
	},

	removeFilter: function(type, filter){
		if (!this.hasFilter(type)) return this;
		this.filters[type].erase(validateFilter(filter));
	},

	removeFilters: function(filters){
		var type;
		if (typeOf(filters) == 'object'){
			for (type in filters) this.removeFilter(type, removeFilter[type]);
			return this;
		}
		type = filters;
		this.filters[type].each(function(filter){
			this.removeFilter(type, filter);
		}, this);
		return this;
	},

	hasFilter: function(type){
		if (!this.filters[type]) {
			return false;
		}
		return (this.filters[type].length > 0) ? true : false;
	}

});

var TypeFilter = {
	define: function(type){
		Presentation.filters[type] = [];
		Presentation.implement(createTypeMethod(type));
	}
};
Presentation.TypeFilter = TypeFilter;

var filterTypes = ['before', 'after'];
filterTypes.each(function(key){
	TypeFilter.define(key);
});

function createTypeMethod(type) {

	var methods = {};
	var name = type.capitalize();

	methods['add' + name + 'Filter'] = function(filter){
		this.addFilter(type, filter);
	};

	methods['add' + name + 'Filters'] = function(filters){
		this.addFilters(filters);
	};

	methods['remove' + name + 'Filter'] = function(filter){
		this.removeFilter(type, filter);
	};
	
	methods['remove' + name + 'Filters'] = function(filters){
		this.removeFilters(filters);
	};

	methods['has' + name + 'Filter'] = function(){
		return this.hasFilter(type);
	};

	return methods;

};

}(Presentation));
