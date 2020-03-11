var fs = require('fs')

var result = "export var HASH = '." + process.argv[2] + "'"

fs.writeFile('src/helpers/hash.js', result, 'utf8', function (err) {
	if (err) return console.log(err)
})
