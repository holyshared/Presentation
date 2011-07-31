(function(doc){

	var filterCount = 0;
	function myFilter(slide){
		filterCount++;
	}

	window.addEventListener('load', function(){

		var myPresen = new Presentation('container', {
			slide: 'section',
			defaultIndex: 0,
			beforeFilters: [
				myFilter,
				myFilter
			],
			afterFilters: [
				myFilter,
				myFilter
			] 
		});
		myPresen.start();

		var testcases = [];

		testcases.push({
			title: 'Next slide',
			description : 'next method test.',
			fn: function(){
				myPresen.next();
			}
		});

		testcases.push({
			title: 'Prev slide',
			description : 'prev method test.',
			fn: function(){
				myPresen.prev();
			}
		});

		testcases.push({
			title: 'First slide',
			description : 'first method test.',
			fn: function(){
				myPresen.first();
			}
		});

		testcases.push({
			title: 'Last slide',
			description : 'last method test.',
			fn: function(){
				myPresen.last();
			}
		});

		testcases.push({
			title: 'set random',
			description : 'set method test.',
			fn: function(){
				var min = 0;
				var max = myPresen.getLength() - 1;
				var index = Math.floor(Math.random() * (max - min + 1)) + min;
				myPresen.set(index);
			}
		});

		testcases.push({
			title: 'beforeFilters/afterFilters',
			description : 'filters test',
			fn: function(){
				filterCount = 0;
				var content = myPresen.getCurrentContent();

				myPresen.applyFilter('before', content);
				myPresen.applyFilter('after', content);

				log((filterCount >= 4) ? 'assert ok' : 'invalid filter!!');
			}
		});

		makeActions(testcases);

	}, false);

}(document));