(function(doc){

	window.addEventListener('load', function(){

		var testcases = [];

		testcases.push({
			title: 'addContent/addContents',
			description : 'addContent and addContents method testcase',
			fn: function(){

				var container = new Presentation.Container();

				var section1 = new Element('section');
				var content1 = new Presentation.Content(section1);

				container.addContent(content1);

				log ( (container.getLength() == 1) ? 'assert ok' : 'Contents are not added.' );


				var section2 = new Element('section');
				var section3 = new Element('section');

				var content2 = new Presentation.Content(section2);
				var content3 = new Presentation.Content(section3);

				container.addContents([
					content2,
					content3
				]);

				log ( (container.getLength() == 3) ? 'assert ok' : 'Two contents are not added.' );
			}
		});


		testcases.push({
			title: 'removeContent/removeContents',
			description : 'removeContent and removeContents method testcase',
			fn: function(){

				var container = new Presentation.Container();

				var section1 = new Element('section');
				var section2 = new Element('section');
				var section3 = new Element('section');

				var content1 = new Presentation.Content(section1);
				var content2 = new Presentation.Content(section2);
				var content3 = new Presentation.Content(section3);

				container.addContents([
					content1,
					content2,
					content3
				]);

				container.removeContent(content1);

				log ( (container.getLength() == 2) ? 'assert ok' : 'Contents have not been deleted.' );

				container.removeContents([content2, content3]);

				log ( (container.getLength() == 0) ? 'assert ok' : 'Two contents have not been deleted.' );
			}
		});




		testcases.push({
			title: 'getNextIndex/getPrevIndex/getLastIndex/getFirstIndex',
			description : 'getNextIndex, getPrevIndex, getLastIndex, getFirstIndex method testcase',
			fn: function(){

				var container = new Presentation.Container();

				var section1 = new Element('section');
				var section2 = new Element('section');
				var section3 = new Element('section');

				var content1 = new Presentation.Content(section1);
				var content2 = new Presentation.Content(section2);
				var content3 = new Presentation.Content(section3);

				container.addContents([
					content1,
					content2,
					content3
				]);

				var index = container.getNextIndex();
				var nextContent = container.getContent(index);
				log ( (nextContent == content2) ? 'assert ok' : 'It is not the next contents.' );

				var index = container.getLastIndex();
				var lastContent = container.getContent(index);
				log ( (lastContent == content3) ? 'assert ok' : 'It is not the last contents.' );


				container.setCurrentIndex(1);

				var index = container.getPrevIndex();
				var prevContent = container.getContent(index);
				log ( (prevContent == content1) ? 'assert ok' : 'It is not the previous contents.' );

				var index = container.getFirstIndex();
				var firstContent = container.getContent(index);
				log ( (firstContent == content1) ? 'assert ok' : 'It is not the first contents.' );
			}
		});



		testcases.push({
			title: 'getBeforeContents/getAfterContents',
			description : 'getBeforeContents, getAfterContents method testcase',
			fn: function(){

				var container = new Presentation.Container();

				var section1 = new Element('section');
				var section2 = new Element('section');
				var section3 = new Element('section');

				var content1 = new Presentation.Content(section1);
				var content2 = new Presentation.Content(section2);
				var content3 = new Presentation.Content(section3);

				container.addContents([
					content1,
					content2,
					content3
				]);


				var lastIndex = container.getLastIndex();
				var lastContent = container.getContent(lastIndex);
				var beforeContents = container.getBeforeContents(lastIndex);

				log ( (beforeContents.contains(content1)) ? 'assert ok' : 'content1 is not included.' );
				log ( (beforeContents.contains(content2)) ? 'assert ok' : 'content2 is not included.' );
				log ( (!beforeContents.contains(content3)) ? 'assert ok' : 'content3 is included.' );


				var firstIndex = container.getFirstIndex();
				var firstContent = container.getContent(firstIndex);
				var afterContents = container.getAfterContents(firstIndex);

				log ( (afterContents.contains(content2)) ? 'assert ok' : 'content2 is not included.' );
				log ( (afterContents.contains(content3)) ? 'assert ok' : 'content3 is not included.' );
				log ( (!afterContents.contains(content1)) ? 'assert ok' : 'content1 is included.' );
			}
		});

		makeActions(testcases);

		testcases.each(function(testcase, key){
			$('test-' + key.toString()).fireEvent('click');
		});

	}, false);

}(document));