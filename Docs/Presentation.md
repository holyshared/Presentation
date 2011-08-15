Presentation
=====================================================



Presentation
-----------------------------------------------------

	var presentation = new Presentation('container', {
		slide: 'section',
		defaultIndex: 0,
		filters: [],
		keyboard: {
			prev: ['j', 'left'],
			next: ['k', 'right']
		},
		swipe: true
	});
	presentation.start();


### Events

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
* getContainer
* first
* prev
* next
* last
* start
* set


### Static Methods

* addInitializer
* addInitializers
* getInitializer
* getInitializers
* removeInitializer
* removeInitializers
* hasInitializer


Presentation.Container
-----------------------------------------------------

var container = new Presentation.Container(element);

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
	content.toForward();

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

	var presen = new Presentation(options);
	presen.addFilter(filter);

### Methods

* addFilter
* addFilters
* removeFilter
* removeFilters
* hasFilter
* applyFilter






Presentation.Keyboard
-----------------------------------------------------

	var presentation = new Presentation('container');

	var helper = new Presentation.Keyboard({
		prev: ['left', 'j'],
		next: ['right', 'k'],
		first: '0',
		last: '4'
	});
	presentation.addHelper(helper);


### Methods


Presentation.Swipe
-----------------------------------------------------

	var presentation = new Presentation('container');

	var helper = new Presentation.Swipe({
		left: 'prev',
		right: 'next'
	});
	presentation.addHelper(helper);

### Methods


Presentation.Controller
-----------------------------------------------------

	#javascriot
	var presentation = new Presentation('container');

	var helper = new Presentation.Controller({
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


Presentation.Page
-----------------------------------------------------

	#javascript
	var presentation = Presentation('container');

	var helper = new Presentation.Page({
		current: 'current',
		total: 'total'
	});
	presentation.addHelper(helper);

	#html
	<p class="page">
		<strong class="current">1</strong> / <span class="total">10</span>
	</p>


### Methods

