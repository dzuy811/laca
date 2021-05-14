// returns the union of two arrays where duplicate objects with the same 'prop' are removed
const mergeByProperty = (target, source, prop) => {
	source.forEach((sourceElement) => {
		let targetElement = target.find((targetElement) => {
			return sourceElement[prop] === targetElement[prop];
		});
		targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
	});
	return target;
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

exports.unionOnProp = mergeByProperty;
exports.sortBy = sortBy;
