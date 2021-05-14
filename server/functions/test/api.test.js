const helper = require("../utilities/helper");

test("get union of two arrays", () => {
	const obj1 = [{ id: "1" }, { id: "2" }, { id: "3" }];
	const obj2 = [{ id: "3" }];

	expect(helper.unionOnProp(obj1, obj2, "id").length).toBe(3);
});
