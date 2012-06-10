Web Metro
=========

A Windows Phone Metro styled site. Our school blocks github ssh. Please check back later.

An early preview: [http://oceanlau.github.com/WebMetro/](http://oceanlau.github.com/WebMetro/)

Effect
======

Interaction
-----------

###Press###

###Turn###

Presentation
------------

Now every tile could only has one and one only Presentation effect trigger. It's sad. Multiple trigger will be the very next feature I'll be working on, which requires a lot of code rewrite. Now, however if you want to use "hover" and "auto" at the same time you can always set your own rule. Just set `p.manual` of the tile to `false` . It will keep Automaton from manipulate your tile while your mouse is on it. Set it to `true` when you've done your animation.

###Backface###

**Setting Attr:**

- `data-trigger`: "auto", "hover", "controlled"

**Struct:**

`div.backface > div.card > div.face + div.face.back.flip-x` or `div.backface > div.card > div.face + div.face.back.flip-y`

**Note:**

- The `.flip-x` or `.flip-y` class determines your card's flip direction.

###Extend###

**Setting Attr:**

- `data-trigger`: "auto", "hover"
- `data-dir`

**Struct:**

if `data-dir` === "top" || `data-dir` === "bottom"

`div.metro-content.extend > div.extender + div.extendee`

else if `data-dir` === "left" || `data-dir` === "right"

`div.metro-content.extend > div > div.extender+ div.extendee`

**Note:**

- `div.extender` should always be height:100%; to the `div.metro-content`

###Shatter###

**Setting Attr:**

 - `data-trigger`: "auto", "hover", "free"

**Struct:**

`div.metro-content.shatter > div.backface.fragment > ...(Backface)`

**Note:**

- Let's say you have four pieces of `div.fragment`, you need to use CSS to manually set your `div.fragment` width:50%;height:50%;. Read the CSS source.
- Setting `data-trigger` to "free" means putting the behavior of 'div.fragment' under the full control of Automaton.
- The `data-trigger` you set on Backface tile who also has a `.fragment` class will be ignored. Thus I can put these fragments' trigger sys under the control of `div.shatter`.

###Tag###

**Setting Attr:**

- `data-trigger`: "auto", "hover"
- `data-dir`

**Struct:**

`div.metro-content.tag > div.sign`

**Note:**

- Let's say you set `data-dir` to "top", you need to use CSS to manually set your `div.sign` off the top of your `div.tag`. Read the CSS source.
