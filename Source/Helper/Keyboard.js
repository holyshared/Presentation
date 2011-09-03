/*
---
name: Presentation.Helper.Keyboard

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Presentation.Helper
  - Helper/Helper.Keyboard

provides:
  - Presentation.Helper.Keyboard
...
*/

(function(Presentation, HelperNamespace){

//Keyboard helper's option is added to options of Presentation.Slide.
var defaultOptions = {
	'j': 'prev',
	'k': 'next',
	'left': 'prev',
	'right': 'next',
	'0': 'first',
	'4': 'last'
};
/*
Presentation.Slide.implement({
	options: { keyboard: defaultOptions }
});
*/

function parseOptions(options) {
	if (!options) return {};
	var methods = {};
	var keys = Object.keys(options);
	var values = Object.values(options);
	values.each(function(typeKey, index){
		switch(typeOf(typeKey)) {
			case 'string':
				methods[typeKey] = keys[index];
				break;
			case 'array':
				typeKey.each(function(key){
					methods[key] = keys[index];
				});
				break;
			default:
				throw new TypeError('Helper\'s option is an illegal value.');
		}
	});
	return methods;
};

function createHelper(options) {

	var methods = parseOptions(options);
	var keybinds = Object.merge(defaultOptions, methods);
	var helper = new Helper.Keyboard({
		methods: keybinds
	});
	return helper;

};

HelperNamespace.Keyboard = createHelper;

}(Presentation, Presentation.Helper));
