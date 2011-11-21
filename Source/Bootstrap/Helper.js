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

(function(Presentation, Bootstrap, Helper){

Bootstrap.Helper = {

	handler: function(presentation, configurations){

		var bootstrap = this,
			name = null,
			helper = null;

		Object.each(configurations, function(configuration, key){
			name = key.capitalize();
			if (!Helper[name]){
				throw new Error('Presection.Helper.' + name + ' is not found.');
			}
			try {
				helper = (Type.isBoolean(configuration)) ? new Helper[name]() : new Helper[name](configuration);
			} catch(error){
				bootstrap.failure(error);
			}
			presentation.addHelper(helper);
		});

		bootstrap.success();
	}

};

Bootstrap.register('helpers', Bootstrap.Helper);

}(Presentation, Presentation.Bootstrap, Presentation.Helper));
