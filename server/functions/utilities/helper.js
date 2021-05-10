const { ModuleResolutionKind } = require("typescript");

// returns the union of two arrays where duplicate objects with the same 'prop' are removed
const unionOnProp = (a, b, prop) => {
	let array = [...a, ...b];
	array.filter((x) => !b.find((y) => x[prop] === y[prop]));
	return array;
};

const sortBy = (field, reverse, primer) => {
	const key = primer
		? function (x) {
				return primer(x[field]);
		  }
		: function (x) {
				return x[field];
		  };

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
	};
};

exports.unionOnProp = unionOnProp;
exports.sortBy = sortBy;
