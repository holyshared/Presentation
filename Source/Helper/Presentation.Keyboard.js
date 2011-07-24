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
Presentation.Keyboard = new Class({

	Extends: Helper.Keyboard,

	initialize: function(options){
		var methods = null;
		if (options) {
			var keys = Object.keys(options);
			var values = Object.values(options);
			values.each(function(key, index){
				methods[key] = keys[index];
			});
		}

		var keybinds = methods || {
			'j': 'prev',
			'k': 'next',
			'0': 'first',
			'$': 'last'
		};
		this.addMethods(keybinds);
	}

});

}(Presentation));
