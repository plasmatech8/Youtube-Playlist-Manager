// 
// Input creatorss
// 

function retrieveRecord() {
	var urls =  Array.from(document.getElementsByClassName("urls")).map(a => a.value);
	var name = document.getElementById("name").value;
	var authors = Array.from(document.getElementsByClassName("authors")).map(a => a.value);
	var keywords = document.getElementById("keywords").value;
	
	var tags_values = [];
	var tags = document.getElementsByClassName("tags");
	for (let index = 0; index < tags.length; index++) {
		const element = tags[index];
		if (element.checked) {
			tags_values.push(element.name);
		}
	}
	var key_values = {};
	var keyVals = document.getElementsByClassName("keyVals");
	for (let i = 0; i < keyVals.length; i++) {
		const element = keyVals[i];
		if ( element.value) {
			key_values[element.name] = element.value;
		}
	}
	var description = document.getElementById("desc").value;
	
	var newRecord = {
		urls:urls,
		name:name,
		authors:authors,
		keywords:keywords,
		tags:tags_values,
		key_values:key_values,
		description:description
	};
	return newRecord;
}

function inputVideoForm(defaultUrl = "") {
	
	var inputFieldForm = document.getElementById("inputFieldForm");
	inputFieldForm.innerHTML = `
	<h2>Input New Video</h2>
	URL: <br>
		<input type="button" id="-urls" value="-"><input type="button" id="+urls" value="+"><br> 
		<div id="urls">
			<div><input type="text" class="urls" value="`+defaultUrl+`"><br></div>
		</div>
	Name: <br><input type="text" name="name" id="name"> <br>
	Authors: <br>
		<input type="button" id="-authors" value="-"><input type="button" id="+authors" value="+"><br> 
		<div id="authors">
			<div><input type="text" class="authors"><br></div>
		</div>
	Keywords: <br><input type="text" name="keywords" id="keywords"><br>
	Properties: <br>
	<div id="tags"></div>
	<div id="keyVals"></div>
	Description: <br><textarea rows="7" cols="30" id="desc"></textarea><br>
	<input type="submit" id="enter" value="Enter"><br>
	`;
	
	// TAGS and KEYVALS
	chrome.storage.sync.get(['Tags', 'KeyVals'], function(data){
		
		// Tags
		var tags = document.getElementById("tags");
		if (data.Tags){
			for (let i = 0; i < data.Tags.length; i++) {
				var child = document.createElement("div");
				child.innerHTML = '<label for="tag' + data.Tags[i] + '">'+data.Tags[i] +': </label><input type="checkbox" class="tags" name="' + data.Tags[i] + '" id="tag' + data.Tags[i] + '"><br>';
				tags.appendChild(child);
			}
		}
		
		// KeyVals
		var keyVals = document.getElementById("keyVals");
		if (data.KeyVals){
			for (let i = 0; i < data.KeyVals.length; i++) {
				var child = document.createElement("div");
				child.innerHTML = data.KeyVals[i] + ': <input type="text" size="5" class="keyVals" name="' + data.KeyVals[i] + '"><br>';
				keyVals.appendChild(child);
			}
		}
	});
	
	// EXPANDABLE FIELDS
	var createExpandableField = function(containerId){
		document.getElementById("-" + containerId).addEventListener("click", function() {
			var elements = document.getElementById(containerId).childNodes;
			if (elements.length == 2) {
				return
			}
			var element = elements[elements.length - 1];
			if (element) {
				element.remove();
			}
		});
		document.getElementById("+" + containerId).addEventListener("click", function() {
			var element = document.createElement("div");
			element.innerHTML = '<input type="text" class="'+containerId+'"><br>';
			document.getElementById(containerId).appendChild(element);
		});
	}
	createExpandableField("urls");
	createExpandableField("authors");
	
	// ENTER BUTTON
	document.getElementById("enter").addEventListener("click", function() {
		
		var newRecord = retrieveRecord();
		
		console.log(newRecord);
		
		chrome.storage.sync.get(['videos'], function(data){
			if (!data.videos) {
				var newVideos = [newRecord]
			}else{
				var newVideos = data.videos;
				newVideos.push(newRecord);
			}
			chrome.storage.sync.set({'videos': newVideos});
		});
	});
	
}

function editVideoForm(recordIndex) {
	chrome.storage.sync.get(['videos'], function(data){
		editVideoForm2(recordIndex, data.videos[recordIndex]);
	});
}

function editVideoForm2(recordIndex, recordValues) {
	
	chrome.storage.sync.get(['Tags', 'KeyVals'], function(data){
				
		// BUILD FORM
		var inputFieldForm = document.getElementById("inputFieldForm");
		var inner = `
			<h2>Edit Existing Video</h2>
			URL: <br>
				<input type="button" id="-urls" value="-"><input type="button" id="+urls" value="+"><br> 
				<div id="urls">`;
			
			for (let i = 0; i < recordValues.urls.length; i++) {
				const element = recordValues.urls[i];
				inner += '<div><input type="text" class="urls" value="'+element+'"><br></div>'
			}
			
			inner += `
				</div>
			Name: <br><input type="text" name="name" id="name" value="` + recordValues.name + `"> <br>
			Authors: <br>
				<input type="button" id="-authors" value="-"><input type="button" id="+authors" value="+"><br> 
				<div id="authors">`;
			
			for (let i = 0; i < recordValues.authors.length; i++) {
				const element = recordValues.authors[i];
				inner+= '<div><input type="text" class="authors" value="'+element+'"><br></div>'
			}
				
			inner += `
				</div>
			Keywords: <br><input type="text" name="keywords" id="keywords" value="` + recordValues.keywords + `"><br>
			Properties: <br>
				<div id="tags"></div>
				<div id="keyVals"></div>
			Description: <br><textarea rows="7" cols="30" id="desc">` + recordValues.description + `</textarea><br>
			<input type="submit" id="enter" value="Enter"><br>
			`;
		inputFieldForm.innerHTML = inner;
		
		// Tags
		var tags = document.getElementById("tags");
		if (data.Tags){
			for (let i = 0; i < data.Tags.length; i++) {
				var child = document.createElement("div");
								
				// Record values
				if (recordValues.tags.includes(data.Tags[i])) {
					child.innerHTML = '<label for="tag' + data.Tags[i] + '">'+data.Tags[i] +': </label><input type="checkbox" class="tags" name="' + data.Tags[i] + '" checked="true" id="tag' + data.Tags[i] + '"><br>';
				}else{
					child.innerHTML = '<label for="tag' + data.Tags[i] + '">'+data.Tags[i] +': </label><input type="checkbox" class="tags" name="' + data.Tags[i] + '" id="tag' + data.Tags[i] + '"><br>';					
				}
				tags.appendChild(child);
			}
		}
		
		// KeyVals
		var keyVals = document.getElementById("keyVals");
		if (data.KeyVals){
			for (let i = 0; i < data.KeyVals.length; i++) {
				var child = document.createElement("div");
				
				// Record values
				var keyVal = recordValues.key_values[data.KeyVals[i]];
				if (keyVal) {
					child.innerHTML = data.KeyVals[i] + ': <input type="text" size="5" class="keyVals" name="' + data.KeyVals[i] + '" value="'+keyVal+'"><br>';
				}else{
					child.innerHTML = data.KeyVals[i] + ': <input type="text" size="5" class="keyVals" name="' + data.KeyVals[i] + '"><br>';
				}
				keyVals.appendChild(child);
			}
		}
	
	
		// EXPANDABLE FIELDS
		var createExpandableField = function(containerId){
			document.getElementById("-" + containerId).addEventListener("click", function() {
				var elements = document.getElementById(containerId).childNodes;
				if (elements.length == 2) {
					return
				}
				var element = elements[elements.length - 1];
				if (element) {
					element.remove();
				}
			});
			document.getElementById("+" + containerId).addEventListener("click", function() {
				var element = document.createElement("div");
				element.innerHTML = '<input type="text" class="'+containerId+'"><br>';
				document.getElementById(containerId).appendChild(element);
			});
		}
		createExpandableField("urls");
		createExpandableField("authors");
		
		// ENTER BUTTON
		document.getElementById("enter").addEventListener("click", function() {
			
			var newRecord = retrieveRecord();
			
			console.log(newRecord);
			
			chrome.storage.sync.get(['videos'], function(data){
				var newVideos = data.videos;
				newVideos[recordIndex] = newRecord;
				chrome.storage.sync.set({'videos': newVideos});
			});
		});
		
	});
}

function init() {
	

	
	//inputVideoForm();
	editVideoForm(1);

}
// , 
// 		{
// 			urls:["urls", "url2"],		
// 			name:"name",
// 			authors:["author1", "author2"],
// 			keywords:"keywords",
// 			tags:["Tag1","Tag3"],
// 			key_values:{"Key1":"lalal"},
// 			description:"desc"
// 		}
window.onload = init;