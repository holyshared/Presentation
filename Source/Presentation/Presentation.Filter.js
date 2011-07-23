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
  - Presentation.BeforeFilter
  - Presentation.AfterFilter
  - Presentation.DefaultFilter
...
*/

(function(Presentation, Slide){

//Filter types
var defineFilterTypes = ['before', 'after'];

//Override methods
var overideMethods = [ 'set', 'first', 'prev', 'next', 'last' ];

//Validator of filter
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

//Method of override of building in filter
function includeFilter(method) {

	var name = (method == 'set') ? '' : method.capitalize();

	return function(){
		var context = this['_get' + name + 'Context'].apply(this, arguments);
		if (!context) return;
		var content = context.center;
		if (this.hasFilter('before')) {
			this.applyFilter('before', content);
		}

		this._transrate(context);

		if (this.hasFilter('after')) {
			this.applyFilter('after', content);
		}

	};
};

//It is override as for set, first, prev, next and last.
//Processing that executes the filter is built in.
var OverridePresentation = Slide.prototype;
overideMethods.each(function(name){
	OverridePresentation[name] = includeFilter(name);
});

//It is override as for applyOptions.
/*
var method = 'applyOptions';
var previous = OverridePresentation[method];
OverridePresentation[method] = function(){

	previous.call(this);

	var opts = this.options;
	defineFilterTypes.each(function(type){
		var filters = opts[type + 'Filters'];
		var add = 'add' + type.capitalize() + 'Filters';
		if (filters){
			this[add](filters);
		}
	});
}
*/

/*---------------------------------------------
	Filter Section
---------------------------------------------*/

//Filter interface
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
		var targets = this.filters[type];
		while(this.hasFilter(type)) {
			this.removeFilter(type, targets.getLast());
		}
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
Slide.implement(new Presentation.Filter());



/*---------------------------------------------
	BeforeFilter/AfterFilter
---------------------------------------------*/

//Presentation.BeforeFilter and Presentation.AfterFilter are dynamically defined. 
defineFilterTypes.each(function(key){

	var name = key.capitalize();
	Presentation[name + 'Filter'] = function(){
		var options = {};
		options[key + 'Filters'] = null;

		var extend = Object.merge(createTypeMethod(key), options);

		OverridePresentation.filters[key] = [];

		Slide.implement(extend);
	}

});


Slide.implement(new Presentation.BeforeFilter());
Slide.implement(new Presentation.AfterFilter());


function createTypeMethod(type) {

	var methods = {};
	var name = type.capitalize();

	methods['add' + name + 'Filter'] = function(filter){
		this.addFilter(type, filter);
	};

	methods['add' + name + 'Filters'] = function(){
		var filters = Array.from(arguments);
		var appendFilters = [];
		filters.each(function(filter){
			appendFilters.push({
				type: type,
				handler: filter
			});
		});
		this.addFilters(appendFilters);
	};

	methods['remove' + name + 'Filter'] = function(filter){
		this.removeFilter(type, filter);
	};

	methods['remove' + name + 'Filters'] = function(){
		this.removeFilters(type);
	};

	methods['has' + name + 'Filter'] = function(){
		return this.hasFilter(type);
	};

	return methods;

};

/*---------------------------------------------
	Initializer Section
---------------------------------------------*/

//The initialization filter that registers the filter of the option is registered.
function DefaultFilter(){};

DefaultFilter.implement({

	invoke: function(slide){
		var opts = slide.options;
		defineFilterTypes.each(function(key){
			var name = key + 'Filters';
			var add = 'add' + key.capitalize() + 'Filters';
			if (opts[name]) {
				var filters = opts[name];
				slide[add].apply(slide, filters);
				delete opts[name];
			}
		});
	}

});

Presentation.DefaultFilter = DefaultFilter;

Presentation.addInitializer(new Presentation.DefaultFilter());


}(Presentation, Presentation.Slide));