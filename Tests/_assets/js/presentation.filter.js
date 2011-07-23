(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'addFilter/addFilters',
			description : 'addFilter, addFilters method test.',
			fn: function(){

				var filter1 = function(content){};

				var myPresen1 = new Presentation('container');
				myPresen1.addFilter('before', filter1);

				log( (myPresen1.hasFilter('before')) ? 'assert ok' : 'filter is not found.' );

				var filter2 = function(content){};
				var filter3 = function(content){};

				var myPresen2 = new Presentation('container');
				myPresen2.addFilters([
					{
						'type': 'before',
						'handler': filter2
					},
					{
						'type': 'after',
						'handler': filter3
					}
				]);

				log( (myPresen2.hasFilter('before')) ? 'assert ok' : 'Before filter is not found.' );
				log( (myPresen2.hasFilter('after')) ? 'assert ok' : 'After filter is not found.' );
			}
		});

		testcases.push({
			title: 'removeFilter/removeFilters',
			description : 'removeFilter, removeFilters method test.',
			fn: function(){

				var filter1 = function(content){};

				var myPresen1 = new Presentation('container');
				myPresen1.addFilter('before', filter1);
				myPresen1.removeFilter('before', filter1);

				log( (!myPresen1.hasFilter('before')) ? 'assert ok' : 'filter is found.');

				var filter2 = function(content){};
				var filter3 = function(content){};

				var myPresen2 = new Presentation('container');
				myPresen2.addFilters([
					{
						'type': 'before',
						'handler': filter2
					},
					{
						'type': 'after',
						'handler': filter3
					}
				]);

				myPresen2.removeFilters({
					'before': filter2, 
					'after': filter3
				});

				log( (!myPresen2.hasFilter('before')) ? 'assert ok' : 'Before filter is found.' );
				log( (!myPresen2.hasFilter('after')) ? 'assert ok' : 'After filter is found.' );
			}
		});

		testcases.push({
			title: 'applyFilter',
			description : 'applyFilter method test.',
			fn: function(){
				var filter1 = function(content){
					var section = $(content);
					section.setStyle('background-color', '#cccccc');
				};
				var myPresen = new Presentation('container');
				var content = myPresen.getContent(0);
				myPresen.addFilter('before', filter1);
				myPresen.applyFilter('before', content);
			}
		});



		testcases.push({
			title: 'filter options',
			description : 'filter options test.',
			fn: function(){
				var before = false;
				var after = false;

				var bfilter = function(content){
					before = true;
				};

				var afilter = function(content){
					after = true;
				};

				var myPresen = new Presentation('container', {
					beforeFilters: [bfilter],
					afterFilters: [afilter]
				});

				var content = myPresen.getContent(0);

				myPresen.applyFilter('before', content);
				myPresen.applyFilter('after', content);

				log ( (before && after) ? 'assert ok' : 'filter is not found.' );
			}
		});

		makeActions(testcases);

	}, false);

}(document));