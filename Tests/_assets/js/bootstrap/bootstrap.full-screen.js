(function(doc){

	window.addEventListener('load', function(){

		var myPresen = new Presentation({
			configurations: {
				fullscreen: true
			}
		});
		myPresen.start();


	}, false);

}(document));