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
		blur: function(content) {
			//do something
		},
		focus: function(content){
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
