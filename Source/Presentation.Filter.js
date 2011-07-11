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
  - Presentation.Filter
  - Presentation.BeforeFilter
  - Presentation.AfterFilter
...
*/

(function(Presentation){

function validateFilter(filter) {
	if (!Type.isFunction(filter)){
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

//var previous = {};
var methods = [ 'set', 'first', 'prev', 'next', 'last' ];
var OverridePresentation = Presentation.prototype;
methods.each(function(name){
	OverridePresentation[name] = wrapFilter(OverridePresentation[name]);
});

function wrapFilter(method) {

	return function(){

		var content = method.apply(this, arguments);
		if (this.hasFilter('before')) {
			this.applyFilter('before', content);
		}

		if (this.hasFilter('after')) {
			this.applyFilter('after', content);
		}

	};
};




Presentation.Filter = new Class({

	filters: {},

	addFilter: function(type, filter){
		this.filters[type].push(validateFilter(filter));
	},

	addFilters: function(filters){
		var values = validateFilters(filters);
		values.each(function(filter, index){
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
			for (type in filters) this.removeFilter(type, filters[type]);
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
	},

	applyFilter: function(type, content){
		var filters = this.filters[type];
		filters.each(function(filter){
			filter(content);
		});
	}

});
Presentation.implement(new Presentation.Filter());


var filterTypes = ['before', 'after'];
filterTypes.each(function(key){
	var name = key.capitalize();
	Presentation[name + 'Filter'] = function(){
		OverridePresentation.filters[key] = [];
		Presentation.implement(createTypeMethod(key));
	}
});








/*

Presentation.BeforeFilter = function(){
	Presentation.filters['before'] = [];
	Presentation.implement(createTypeMethod('before'));
}

Presentation.AfterFilter = function(){
	Presentation.filters['after'] = [];
	Presentation.implement(createTypeMethod('after'));
}
*/
Presentation.implement(new Presentation.BeforeFilter());
Presentation.implement(new Presentation.AfterFilter());


/*
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
*/
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
