if(process.env.NODE_ENV !== 'production') {
	return
}

var fs = require('fs')

fs.renameSync('public/manifest.json', `public/manifest.${process.argv[2]}.json`)

fs.readFile('public/index.html', 'utf8', function (
	err,
	contents
) {
	contents = contents.replace('<meta name="viewport"',
		`<link rel="manifest" href="manifest.${process.argv[2]}.json"><meta name="viewport"`)
	fs.writeFile('public/index.html', contents, 'utf8', function (err) {
		if (err) return console.log(err)
	})
})
