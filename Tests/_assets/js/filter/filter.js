(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'addFilter/addFilters',
			description : 'addFilter, addFilters method test.',
			fn: function(){

				var filter1 = {
					activate: function(content){}
				};

				var myPresen1 = new Presentation('presentation');
				myPresen1.start();

				myPresen1.addFilter(filter1);

				log( (myPresen1.hasFilter(filter1)) ? 'addFilter - assert ok' : 'filter is not found.' );

				var filter2Result = 0,
					filter3Result = 0;

				var filter2 = {
					activate: function(content){
						filter2Result++;
					},
					deactivate: function(content){
						filter2Result++;
					}
				};
				var filter3 = {
					activate: function(content){
						filter3Result++;
					},
					deactivate: function(content){
						filter3Result++;
					}
				};

				var myPresen2 = new Presentation('presentation');
				myPresen2.start();

				myPresen2.addFilters([filter2, filter3]);

				log( (myPresen2.hasFilter(filter2)) ? 'addFilters1 - assert ok' : 'Filter2 is not found.' );
				log( (myPresen2.hasFilter(filter3)) ? 'addFilters2 - assert ok' : 'Filter3 is not found.' );

				myPresen2.next();

				log( (filter2Result == 2) ? 'Filter2 enable - assert ok' : 'Filter2 is not enable.' );
				log( (filter3Result == 2) ? 'Filter3 enable - assert ok' : 'Filter3 is not enable.' );

			}
		});

		testcases.push({
			title: 'removeFilter/removeFilters',
			description : 'removeFilter, removeFilters method test.',
			fn: function(){

				var filter1 = {
					activate: function(content){}
				};

				var myPresen1 = new Presentation('presentation');
				myPresen1.start();

				myPresen1.addFilter(filter1);
				myPresen1.removeFilter(filter1);

				log( (!myPresen1.hasFilter(filter1)) ? 'removeFilter - assert ok' : 'filter is found.');

				var filter2Result = 0,
					filter3Result = 0;

				var filter2 = {
					activate: function(content){}
				};
				var filter3 = {
					activate: function(content){}
				};

				var myPresen2 = new Presentation('presentation');
				myPresen2.start();

				myPresen2.addFilters([ filter2, filter3 ]);

				myPresen2.removeFilters([ filter2, filter3 ]);

				log( (!myPresen2.hasFilter(filter2)) ? 'removeFilters1 - assert ok' : 'Filter2 is found.' );
				log( (!myPresen2.hasFilter(filter3)) ? 'removeFilters2 - assert ok' : 'Filter3 is found.' );

				log( (filter2Result == 0) ? 'Filter2 disable - assert ok' : 'Filter2 is not disable.' );
				log( (filter3Result == 0) ? 'Filter3 disable - assert ok' : 'Filter3 is not disable.' );

			}
		});

		testcases.push({
			title: 'applyFilter',
			description : 'applyFilter method test.',
			fn: function(){
				var filter1 = {
					activate: function(content){
						var section = $(content);
						section.setStyle('background-color', '#000000');
					}
				};

				var myPresen = new Presentation('presentation');
				myPresen.start();

				var content = myPresen.getContent(0);
				myPresen.addFilter(filter1);
				myPresen.applyFilter('activate', content);
			}
		});

		makeActions(testcases);

	}, false);

}(document));