const {UnitTest, Test, ObjectTest, FileTest} = require('./TestingFramework.js')
const {helloWorld, helloWorld2, createNewFile} = require('./Functions.js')

databaseTesting = new UnitTest("Database Testing")

databaseTesting.addTest(new Test("Test1", function(){

	return 2

}, 2))

databaseTesting.addTest(new ObjectTest("Test2", function(){

	return helloWorld2(2)

},{
		"firstName":"Matthew",
		"lastName":"Haywood",
		"age":20
	}))

databaseTesting.addTest(new FileTest("Test3", function(){

	var fileName = './testFile123.txt'

	createNewFile(fileName)

	return fileName

},{
	"fileName":"./testFile123.txt",
	"fileContents":"hello this is a test"
}))

databaseTesting.runTests()