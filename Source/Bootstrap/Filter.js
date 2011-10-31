/*
---
name: Presentation.Bootstrap.Filter

description: 

license: MIT-style

authors:
- Noritaka Horio

requires:
  - Presentation.Bootstrap
  - Presentation.Filter

provides:
  - Presentation.Bootstrap.Filter
...
*/

(function(Presentation, Bootstrap){

Bootstrap.Filter = {

	handler: function(presentation, configurations){

		presentation.addFilters(configurations);

		presentation.addEvents({
			'__deactivate': function(content){
				presentation.applyFilter('deactivate', content);
			},
			'__activate': function(content){
				presentation.applyFilter('activate', content);
			}
		});

		this.success();
	}

};

Bootstrap.register('filters', Bootstrap.Filter);

}(Presentation, Presentation.Bootstrap));
