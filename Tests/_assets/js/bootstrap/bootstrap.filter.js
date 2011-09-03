(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'filter options',
			description : 'filter options test.',
			fn: function(){
				var deactivate = false;
				var activate = false;

				var deactivateFilter = {
					deactivate: function(content){
						deactivate = true;
					}
				};
				var activateFilter = {
					activate: function(content){
						activate = true;
					}
				};

				var myPresen = new Presentation('container', {
					filters: [deactivateFilter, activateFilter]
				});

				var content = myPresen.getContent(0);

				myPresen.applyFilter('deactivate', content);
				myPresen.applyFilter('activate', content);

				log ( (deactivate && activate) ? 'assert ok' : 'filter is not found.' );
			}
		});

		makeActions(testcases);

	}, false);

}(document));