var fs = require('fs')

var result = "export var HASH = ''"

fs.writeFile('src/helpers/hash.js', result, 'utf8', function (err) {
	if (err) return console.log(err)
})
