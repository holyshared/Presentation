/*
---
name: Presentation.Bootstrap.Helper

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap
  - Presentation.Helper

provides:
  - Presentation.Bootstrap.Helper
...
*/

(function(Presentation, Bootstrap){

function HelperBootstrap() {
}

HelperBootstrap.implement({

	invoke: function(slide){
		var opts = slide.options;
		if (!opts.helpers) {
			return;
		}

		for (var key in helpers) {
			var hopts = helpers[key];
			var hname = key.capitalize();

			var helper = Type.isBoolean(hopts)
			? new Helper[hname]()
			: new Helper[hname](hopts);

			slide.addHelper(helper);
		}
		delete opts.helpers;
	}

});

Bootstrap.Helper = HelperBootstrap;

Presentation.addInitializer(new Bootstrap.Helper());

}(Presentation, Presentation.Bootstrap));
