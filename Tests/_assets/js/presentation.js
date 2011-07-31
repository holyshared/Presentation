(function(doc){

	function MyFilter() {
		this.counter = 0;
	}

	Object.implement(MyFilter, {
		invoke: function(slide){
			MyFilter.counter++;
		}
	});

	Object.append(MyFilter, {
		counter: 0
	});

	window.addEventListener('load', function(){

		var myPresen = new Presentation('container', {
			slide: 'section',
			defaultIndex: 0,
			beforeFilters: [
				new MyFilter(),
				new MyFilter()
			],
			afterFilters: [
				new MyFilter(),
				new MyFilter()
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

/*
	'addContent',
	'addContents',
	'removeContent',
	'removeContents',
	'getCurrentIndex',
	'getCurrentContent',
	'getContent',
	'getLength'
*/

				var content = myPresen.getCurrentContent();

				myPresen.applyFilter('before', content);
				myPresen.applyFilter('after', content);
			}
		});

		makeActions(testcases);

	}, false);

}(document));