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


		testcases.push({
			title: 'addContent/addContents/getContent/getLength',
			description : 'addContent,addContents,getContent,getLength testcase',
			fn: function(){
				var element1 = new Element('section', { 'html': 'new content1', 'class': 'slideContent' }),
					element2 = new Element('section', { 'html': 'new content2', 'class': 'slideContent' }),
					element3 = new Element('section', { 'html': 'new content3', 'class': 'slideContent' });

				var content1 = new Presentation.Content(element1)
					content2 = new Presentation.Content(element2);
					content3 = new Presentation.Content(element3);

				$('container').adopt([element1, element2, element3]);

				var len = myPresen.getLength();

				myPresen.addContent(content1);

				var content = myPresen.getContent(len);
				log( (content1 == content) ? 'assert ok' : 'invalid content' );

				myPresen.addContents([content2, content3]);

				len++;

				content = myPresen.getContent(len);
				log( (content2 == content) ? 'assert ok' : 'It is not the first target.' );

				len++;

				content = myPresen.getContent(len);
				log( (content3 == content) ? 'assert ok' : 'It is not the second target.' );
			}
		});


		testcases.push({
			title: 'removeContent/removeContents',
			description : 'removeContent,removeContents testcase',
			fn: function(){
				var element1 = new Element('section', { 'html': 'new content1', 'class': 'slideContent' }),
					element2 = new Element('section', { 'html': 'new content2', 'class': 'slideContent' }),
					element3 = new Element('section', { 'html': 'new content3', 'class': 'slideContent' });

				var content1 = new Presentation.Content(element1)
					content2 = new Presentation.Content(element2);
					content3 = new Presentation.Content(element3);

				$('container').adopt([element1, element2, element3]);

				var len = myPresen.getLength();

				myPresen.addContent(content1);
				myPresen.removeContent(content1);

				log( (len == myPresen.getLength()) ? 'assert ok' : 'invalid content' );

				myPresen.addContents([content2, content3]);
				myPresen.removeContents([content2, content3]);

				log( (len == myPresen.getLength()) ? 'assert ok' : 'It is not the first target.' );
			}
		});

		testcases.push({
			title: 'getCurrentIndex/getCurrentContent',
			description : 'getCurrentIndex,getCurrentContent testcase',
			fn: function(){
				myPresen.set(2);
				var index = myPresen.getCurrentIndex();

				log( (index == 2) ? 'assert ok' : '' );

				var content1 = myPresen.getCurrentContent();
				var content2 = myPresen.getContent(index);

				log( (content1 == content2) ? 'assert ok' : '' );

			}
		});

		makeActions(testcases);

	}, false);

}(document));