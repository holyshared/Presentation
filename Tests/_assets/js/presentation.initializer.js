(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'function initializer',
			description : 'function initializer',
			fn: function(){
				var checkValue = false;
				var container = $('container');
				var myPresen = null;

				var init = function(presen){
					log ( (container == presen.getContainer()) ? 'assert ok' : 'function - invalid Presentation' );
					checkValue = true;

					Presentation.removeInitializer(init);
				};

				Presentation.addInitializer(init);

				myPresen = new Presentation(container);
				myPresen.start();

				log ( (checkValue) ? 'assert ok' : 'function - The filter is not executed.' );

			}
		});

		testcases.push({
			title: 'object initializer',
			description : 'object initializer',
			fn: function(){
				var checkValue = false;
				var myPresen = null;
				var init = null;
				var container = $('container');

				function MyInitializer(){};

				MyInitializer.prototype.invoke = function(presen){

					log ( (container == presen.getContainer()) ? 'assert ok' : 'object - invalid Presentation' );
					checkValue = true;

					Presentation.removeInitializer(init);
				};

				init = new MyInitializer();

				Presentation.addInitializer(init);

				myPresen = new Presentation(container);
				myPresen.start();

				log ( (checkValue) ? 'assert ok' : 'object - The filter is not executed.' );

			}
		});

		testcases.push({
			title: 'removeInitializer',
			description : 'removeInitializer method testcase.',
			fn: function(){
				var myPresen = null;
				var counter = 0;

				var init1 = function(presen){
					counter++;
				};

				var init2 = function(presen){
					counter++;
				};

				Presentation.addInitializers(init1, init2);

				var container = $('container');

				myPresen = new Presentation(container);
				myPresen.start();

				log ( (counter >= 2) ? 'assert ok' : 'Initializer doesn\'t move correctly.');

				Presentation.removeInitializers(init1, init2);

				myPresen = new Presentation(container);
				myPresen.start();

				log ( (counter == 2) ? 'assert ok' : 'Initializer has not been deleted.' );
			}
		});

		makeActions(testcases);

	}, false);

}(document));