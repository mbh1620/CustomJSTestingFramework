const fs = require('fs')

function helloWorld(input){

	return input

}

function helloWorld2(input){

	let outputObject = {

		"firstName":"Matthew",
		"lastName":"Haywood",
		"age":20

	}

	return outputObject

}

function createNewFile(fileName){

	var data = 'hello this is a test'

	fs.writeFileSync(`${fileName}`, data)

}

module.exports = {
	helloWorld,
	helloWorld2,
	createNewFile
}
