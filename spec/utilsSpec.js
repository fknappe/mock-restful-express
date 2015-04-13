var utils = require('../lib/utils');

describe("Utils", function() {
	var fileUtils,
		fixtures = __dirname + '/fixtures/resource.json';

	beforeEach(function() {
	    fileUtils = new utils();
  	});

	describe("loadResource", function() {
		it("should return null when filepath does not exists", function () {
			var resource = fileUtils.loadResource('');
			expect(resource).toBe(null);
		});

		it("should return the fileContent with a valid filepath", function () {
			var response = JSON.parse(fileUtils.loadResource(fixtures));
			expect(response).not.toBe(null);
		});
	});
});	