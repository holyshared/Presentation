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

Bootstrap.register('helpers', {

	handler: function(presentation, configurations){

		Object.each(configurations, function(configuration, key){

			try {
				var name = key.capitalize();
				var helper = (Type.isBoolean(configuration))
				? new Helper[name]()
				: new Helper[name](configuration);
			} catch(error){
				this.failure(error);
			}

			presentation.addHelper(helper);
		});

		this.success();
	}

});

}(Presentation, Presentation.Bootstrap, Presentation.Helper));
