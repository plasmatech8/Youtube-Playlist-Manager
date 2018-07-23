//
// Helpers
//

function downloadFile(content, fileName) { 
	// Downloads a file with specified content
    var a = document.createElement("a");
    var file = new Blob([content], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function fetchFile(fileName) {
	// Fetches javascript object from parsed json
	return fetch(fileName)
		.then(response => response.json())
		.then(jsonResponse => console.log(jsonResponse))     
}

function searchBy(method, value) {
	// For each record:
	// 		if value in testValues
	
	
	
	var testValues;
	if (method == "name") {
		testValues = ["name"];
	}else if (method == "authors") {
		testValues = ["author1", "author2"];
	}
	
	if (testValues.incl) {
	}
}