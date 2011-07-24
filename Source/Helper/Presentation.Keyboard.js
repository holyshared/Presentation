/*
---
name: Presentation.Keyboard

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Helper/Helper.Keyboard

provides:
  - Presentation.Keyboard
...
*/

(function(Presentation){

/**
 * var helper = new Presentation.Keyboard({
 *     'j': 'prev',
 *     'k': 'next',
 *     '0': 'first',
 *     '$': 'last'
 * });
 */
var defaultKeybind = {
	'j': 'prev',
	'k': 'next',
	'left': 'prev',
	'right': 'next',
	'0': 'first',
	'4': 'last'
};

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
				throw new TypeError('');
		}
	});
	return methods;
};

function createHelper(options) {

	var methods = parseOptions(options);
	var keybinds = Object.merge(defaultKeybind, methods);
	var helper = new Helper.Keyboard({
		methods: keybinds
	});
	return helper;

};

Presentation.Keyboard = createHelper;

}(Presentation));
