/*
---
name: Presentation.Helper.Keyboard

description: The helper who enables keyboard operation

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation/Presentation
  - Presentation/Helper
  - Helper/Helper.Keyboard

provides:
  - Helper.Keyboard
...
*/

(function(Presentation, HelperNamespace){

//Keyboard helper's option is added to options of Presentation.Slide.
var defaults = {
	'j': 'prev',
	'k': 'next',
	'left': 'prev',
	'right': 'next',
	'0': 'first',
	'4': 'last'
};

function KeyboardHelper(options){
	var methods = null,
		keybinds = null;

	options = options || {};

	keybinds = options.keybinds || {};
	methods = convertToDelegateMethods(keybinds);
	delete options.keybinds;

	options.methods = Object.merge(defaults, methods);

	return new Helper.Keyboard(options);
}

function convertToDelegateMethods(options){
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
}

HelperNamespace.Keyboard = KeyboardHelper;

}(Presentation, Presentation.Helper));
