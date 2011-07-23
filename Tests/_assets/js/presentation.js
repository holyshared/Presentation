(function(doc){

	window.addEventListener('load', function(){

		var myPresen = new Presentation('container');
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

		makeActions(testcases);

	}, false);

}(document));