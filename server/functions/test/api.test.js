const helper = require("../utilities/helper");

test("get union of two arrays", () => {
	const obj1 = [{ id: "1" }, { id: "2" }, { id: "3" }];
	const obj2 = [{ id: "3" }];

	expect(helper.unionOnProp(obj1, obj2, "id").length).toBe(3);
});

test("sort descending rankings by journeyCount", () => {
	// Original unsorted array
	const users = [
		{
			id: 1,
			journeyCount: 0,
		},
		{
			id: 2,
			journeyCount: 10,
		},
		{
			id: 3,
			journeyCount: 5,
		},
	];

	// Sorted array
	const sortedUsers = [
		{
			id: 2,
			journeyCount: 10,
		},
		{
			id: 3,
			journeyCount: 5,
		},
		{
			id: 1,
			journeyCount: 0,
		},
	];

	// Sort the original unsorted arrays
	users.sort(helper.sortBy("journeyCount", true, null));

	// Compare between the two
	expect(users).toEqual(sortedUsers);
});
