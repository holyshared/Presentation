(function(doc){

	window.addEventListener('load', function(){

		var filter = {
			activate: function(content){
				$(content).setStyle('background', '#ff0000');
			}
		};

		var myPresen = new Presentation({
			configurations: {
				filters: [filter]
			},
			onStart: function(){
//console.log('start');
			},
			onProgress: function(key, index, total){
//console.log(key);
//console.log(index);
//console.log(total);
			}
		});
		myPresen.start();


		var testcases = [];

		testcases.push({
			title: 'filter test',
			description : 'filter test.',
			fn: function(){
				myPresen.next();
			}
		});

		makeActions(testcases);

	}, false);

}(document));