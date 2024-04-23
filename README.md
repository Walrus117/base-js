A modern take on jQuery delivering extremely fast performance by using modern vanilla javascript under the hood. Functions names and conventions are identical to jQuery but the uncompressed file size is less 10% of the sise.

Draft / work in progress with the following active functions, all of which can be cascaded and addititonal ajax. Documentation will be properly added at a later date.

.ready(callback, callOnResize: false)
Additional parameters added to the ready function to allow it be recalled when the screen size changes. An addition that allows scripts that position HTML elements to rerun as needed.

.resize(callback, throttle: 200)
Detects any changes in screen width and height (discarding browser chrome changes). Throttle ensures this function does runs after a small delay preventing multiple calls taking place if a screen size is being manually dragged.

.on(event, callback);
Applies an event listener to any element or elements.

.on(event, selector, callback)
Identical to on but should be applied to an anccestor with selector being the element or elements to target. This allows the same behavior of on to apply if content is dyamically added such as via ajax.

.each(callback)
Iterate through each element in a matching set.

.find(selector)
Find an element of elements inside the current matched element or elements.

.parent(find)
Get the parent element of the first matched element within the set and optionally find another element or elements insde it.

.first()
Get the first matching sibling of the current matched set.

.last()
Get the last matching sibling  of the current matched set.

.next()
Get the next matching sibling of the current element.

.prev()
Get the previous matching sibling of the current element.

.attr(property)
Get an attribute of the current element or first element within a set.

.attr(property, value)
Set an attribute of the current set of elements.

.removeAttr(property)
Remove an attribute of the current set of elements.

.data(property, value)
Identical to attr but be dealing with the dataset (data-*) attributes.

.removeData(property)
Itentical to removeAttr but dealing with the dataset (data-*) attributes.

css(property, value)
Add / set an css property with a value for the matched set. Optionally place an object in property to add multiple css properties with {prop1: value, prop2: value, ...} sytax.

.addClass(className)
Add one or more classes to the current matched set.

.hasClass(className)
Check whether the first element in the matched sent has the class.

.removeClass(className)
Remove one or more classes to the current matched set.

.toggleClass(className)
Toggle one or more classes to the current matched set.

.elem()
Get the first element of the matched set.

.height(false)
Return the client height (optionally scroll height) of the first element of the matched set.

.width(false)
Return the client width (optionally scroll width) of the first element of the matched set.

.offset()
Return the offset object of an element relative to the document. (returns an object {left, right, bottom, top}.

.position()
Return the offset object of an element relative to it's parent. (returns an object {left, right, bottom, top}.



