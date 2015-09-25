function node(inputNode) {
	return {in: function() {return inputNode.out();}, out: function() {return this.in();}};
}

function sum(node1, node2) {
	return {in: function() {return [node1.out(), node2.out()];}, out: function() {return this.in()[0] + this.in()[1];}};
}

function increment(inputNode, amount) {
	return {in: function() {return inputNode.out();}, out: function() {return this.in() + amount;}};
}

function writer(stuff) {
	document.write(stuff + "<br><br>");
}

var source = {value: 10, out: function() {return this.value;}};

var a = {in: function() {return source.out();}, out: function() {return this.in();}};
var b = {in: function() {return a.out();}, out: function() {return this.in();}};

var adder = {in: function() {return [a.out(), c.out()];}, out: function() {return this.in()[0] + this.in()[1];}};
var doubler = {in: function() {return b.out();}, out: function() {return this.in() * 2;}};

var c = {in: function() {return doubler.out();}, out: function() {return this.in();}};


source.value = 10;


writer("Source: " + source.out());

writer("A.in: " + a.in() + "<br>" + "A.out: " + a.out());
writer("B.in: " + b.in() + "<br>" + "B.out: " + b.out());

writer("Adder.in: " + adder.in() + "<br>" + "Adder.out: " + adder.out());
writer("Doubler.in: " + doubler.in() + "<br>" + "Doubler.out: " + doubler.out());

writer("C.in: " + c.in() + "<br>" + "C.out: " + c.out());


var x = new node(source);
var y = new node(x);
var z = new node(y);
var q = new sum(x, y);
var w = new sum(q, q);
var e = new increment(w, 5);

source.value = 5;

writer("X: " + x.out());
writer("Y: " + y.out());
writer("Z: " + z.out());
writer("Q: " + q.out());
writer("W: " + w.out());
writer("E: " + e.out());