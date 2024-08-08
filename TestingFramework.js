var fs = require('fs')

class UnitTest {

	constructor(unitTestName){

		this.unitTestName = unitTestName
		this.tests = []
		this.passedTests = 0

		this.status;
		this.detail;

	}

	runTests() {

		for(var i = 0; i < this.tests.length; i++){

			if(this.tests[i].runTest()){

				this.passedTests += 1

			}

		}

		this.printOutputTable()

	}

	runTestsForObject() {

		var returnFlag = true

		for(var i = 0; i < this.tests.length; i++){

			if(this.tests[i].runTest() == false){

				returnFlag = false

			}

		}

		return returnFlag

	}

	addTest(test) {

		this.tests.push(test)
		
	}

	printOutputTable(){

		var outputTable = {}

		for(var i = 0; i < this.tests.length; i++){

			var testName = this.tests[i].testName

			if(this.tests[i].constructor.name.toString() == 'ObjectTest'){

				for(var j = 0; j < this.tests[i].objectTesting.tests.length; j++){

					outputTable[testName+'.'+j] = {testStatus:this.tests[i].objectTesting.tests[j].status, testDetail:this.tests[i].objectTesting.tests[j].detail}

				}

			} else if (this.tests[i].constructor.name.toString() == 'FileTest'){

				var tests = this.tests[i].fileTesting.tests[0].objectTesting.tests

				for(var j = 0; j < tests.length; j++){

					outputTable[testName+'.'+j] = {testStatus:tests[j].status, testDetail:tests[j].detail}

				}

			} else {

				outputTable[testName] = {testStatus:this.tests[i].status, testDetail:this.tests[i].detail}

			}

		}

		console.log("\n " + this.unitTestName + " testing output\n")

		console.table(outputTable)

	}

}

class Test {

	constructor(testName, testFunction, returnValue) {

		this.testName = testName
		this.testFunction = testFunction
		this.returnValue = returnValue

		this.status;
		this.detail;

	}

	runTest(){

		try {

			if(this.returnValue === this.testFunction()){

				this.status = 'PASSED'
				this.detail = ''

				return true

			} else {

				if (this.testFunction() == this.returnValue){

					this.status = `FAILED`
					this.detail = `returned type is ${typeof(this.testFunction())} instead of ${typeof(this.returnValue)}`

				} else {

					this.status = `FAILED`
					this.detail = `returned ${this.testFunction()} instead of ${this.returnValue}`

				}

				return false

			}

		} catch(err) {

			this.status = `FAILED`
			this.detail = err

			return false

		}

	}

}

class ObjectTest{

	constructor(testName, testFunction, returnObject) {

		this.testName = testName
		this.testFunction = testFunction
		this.returnObject = returnObject

	}

	runTest() {

		this.objectTesting = new UnitTest(this.testName)

		var returnNumberOfKeys = Object.keys(this.returnObject).length

		var testObject = this.testFunction()
		var returnObject = this.returnObject

		this.objectTesting.addTest(new Test(`${this.testName} - Object Test - Number of Keys`, function(){

			return Object.keys(testObject).length

		}, returnNumberOfKeys))

		for(var i = 0; i < returnNumberOfKeys; i++){

			const iteratorAssigned = i

			this.objectTesting.addTest(new Test(`${this.testName} - Object Test - KEY ${Object.keys(this.returnObject)[i]} VALUE ${Object.values(this.returnObject)[i]}`, function(){

				return testObject[Object.keys(returnObject)[iteratorAssigned]]

			}, returnObject[Object.keys(returnObject)[iteratorAssigned]]))

		}

		return this.objectTesting.runTestsForObject()

	}

}

class FileTest{

	constructor(testName, testFunction, returnFile){

		this.testName = testName
		this.testFunction = testFunction
		this.returnFile = returnFile

	}

	runTest(){

		var fileName = this.testFunction()

		this.fileTesting = new UnitTest(this.testName)

		this.fileTesting.addTest(new ObjectTest(`${this.testName} - File Test - Name and Contents`, function(){

			try {

				const fileContents = fs.readFileSync(`${fileName}`, {encoding: 'utf8'})

				var returnObject = {

					"fileName":fileName,
					"fileContents":fileContents

				}

				return returnObject

			} catch(err) {
				
				console.log(`${this.testName} FAILED - ${err}`)

				return false

			}

		}, this.returnFile))

		var output = this.fileTesting.runTestsForObject()

		this.cleanUp()

		return output

	}

	cleanUp(){

		fs.unlinkSync(this.testFunction())

	}

}

module.exports = {
	UnitTest,
	ObjectTest,
	FileTest,
	Test
}