var mock_http = require(__base + '/lib/mock_http');

module.exports = {
	path: '/foo/:id/bar',

	init: function(app) {

	},

	GET: function(req, resp) {
		var mock = new mock_http();
		mock.doGet(req, resp);
	}
}