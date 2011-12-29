Presentation
=====================================================



Presentation
-----------------------------------------------------

	var presentation = new Presentation('container');
	presentation.start();


### Events

* onStart
* onChanged
* onTransitionStart
* onTransitionEnd

### Methods

* addContent
* addContents
* removeContent
* removeContents
* getCurrentIndex
* getCurrentContent
* getContent
* setCurrentIndex
* setCurrentContent
* getLength
* getLayoutElement
* getContainerElement
* isStarted
* first
* prev
* next
* last
* start
* set


Presentation.Container
-----------------------------------------------------

var container = new Presentation.Container();

var befores = container.getBeforeContents(5);
befores.invoke('forward')

var afters = container.getAfterContents(1);
afters.invoke('backward');


### Methods

* addContent
* addContents
* removeContent
* removeContents
* setCurrentIndex
* getCurrentIndex
* getCurrentContent
* getBeforeContents
* getAfterContents
* getContent
* getLength
* isValid
* hasPrevContent
* hasNextContent
* getNextIndex
* getPrevIndex
* getFirstIndex
* getLastIndex

Presentation.Content
-----------------------------------------------------

	var content = new Presentation.Content(element);
	content.forward();

### Events

* onTransitionStart
* onTransitionEnd

### Methods

* forward
* backward
* center
* toElement


Presentation.Filter
-----------------------------------------------------

	var filter = {
		deactivate: function(content) {
			//do something
		},
		activate: function(content){
			//do something
		}
	}

	var presen = new Presentation('container');
	presen.addFilter(filter);

### Methods

* addFilter
* addFilters
* removeFilter
* removeFilters
* hasFilter
* applyFilter






Presentation.Helper.Keyboard
-----------------------------------------------------

	var presentation = new Presentation('container');

	var helper = new Presentation.Helper.Keyboard({
		prev: ['left', 'j'],
		next: ['right', 'k'],
		first: '0',
		last: '4'
	});
	presentation.addHelper(helper);


### Methods

Presentation.Helper.Swipe
-----------------------------------------------------

	var presentation = new Presentation('container');

	var helper = new Presentation.Helper.Swipe({
		left: 'prev',
		right: 'next'
	});
	presentation.addHelper(helper);

### Methods


Presentation.Helper.Controller
-----------------------------------------------------

	#javascriot
	var presentation = new Presentation('container');

	var helper = new Presentation.Helper.Controller({
		first: 'first',
		prev: 'prev',
		next: 'next',
		last: 'ladt'
	});
	presentation.addHelper(helper);

	#html
	<p class="controller">
		<button type="button" class="first">first</button>
		<button type="button" class="prev">prev</button>
		<button type="button" class="next">next</button>
		<button type="button" class="last">last</button>
	</p>

### Methods


Presentation.Helper.Page
-----------------------------------------------------

	#javascript
	var presentation = Presentation('container');

	var helper = new Presentation.Helper.Page({
		current: 'current',
		total: 'total'
	});
	presentation.addHelper(helper);

	#html
	<p class="page">
		<strong class="current">1</strong> / <span class="total">10</span>
	</p>


### Methods

