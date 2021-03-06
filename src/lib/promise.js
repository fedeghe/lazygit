/**
 * really simple one level promise
 */
function check(inst) {
	var self = inst;
	!self.solved && self.f(
		function () {
			self.solved = 1;
			self.solve && self.solve.apply(null, [].slice.call(arguments, 0));
		},
		function () {
			self.solved = 0;
			self.reject && self.reject.apply(null, [].slice.call(arguments, 0));
		}
	);
};

function Promise (f) {
	this.f = f;
	this.solved = false;
	this.reject = true;
}

Promise.prototype.then = function (f) {
	this.solve = f || true;
	check(this);
	return this;
};

Promise.prototype.catch = function (f) {
	this.reject = f;
	return this;
};

module.exports = Promise;