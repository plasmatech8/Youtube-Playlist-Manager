
function createDynamicFields(container, id, title, storageField){
	
	var parent = document.createElement("fieldset");
	parent.id = id; 
	var rowClass = id + "Row";
	var listId = id + "List";
	var addFieldId = id + "AddField";
	var removeFieldId = id + "removeField";
	var setFieldsId = id + "setFields";
	
	// BUILD FORM
	parent.innerHTML += `
	
	<h2>`+title+`<h2>
	<input type="submit" id="`+removeFieldId+`" value="Remove field"><input type="submit" id="`+addFieldId+`" value="Add field"><br/>
	<ul id="`+listId+`"></ul>
	<input type="submit" id="`+setFieldsId+`" value="Set fields">
	
	`
	chrome.storage.sync.get(storageField, function(data){ 
		
		if (data[storageField]){
			var list = document.getElementById(listId);
			for (let i = 0; i < data[storageField].length; i++) {
				// Append current fields
				list.innerHTML += '<li><input type="text" class="'+rowClass+'" value="'+data[storageField][i]+'" display="table-cell"</li>';
			}
		}
	});
	container.appendChild(parent);
	
	// ADD FIELD
	var addField = document.getElementById(addFieldId);
	addField.addEventListener("click", function() {
		var list = document.getElementById(listId)
		list.innerHTML += '<li><input type="text" class="'+rowClass+'" display="table-cell"</li>';
	});
	
	// REMOVE FIELD
	var removeField = document.getElementById(removeFieldId);
	removeField.addEventListener("click", function() {
		var list = document.getElementById(listId)
		var element = list.childNodes[list.childNodes.length - 1];
		if (element) {
			element.remove();
		}
	});
	
	// SET FIELDS
	var setFields = document.getElementById(setFieldsId);
	setFields.addEventListener("click", function() {
		
		// Put row values into array
		var rows = document.getElementsByClassName(rowClass)
		var values = [];
		for (let i = 0; i < rows.length; i++) {
			values.push(rows[i].value);
		}
		// Set the stored variables
		chrome.storage.sync.set({[storageField]: values});
		console.log({[storageField]: values});
	});
	
	
}


function inputFieldFormFunc() {
	
	// Fields to attach tags/keyword-values to videos
	var inputFieldForm = document.getElementById("inputFieldForm");
	
	// BUILD FORM
	var table = document.createElement("table")
	table.innerHTML += '<tr><th>Attr: </th>' 		+ '<th>Value:</th></tr>';
	table.innerHTML += '<tr><td>URL: </td>' 		+ '<td><input type="text" id="url" value=""></td></tr>';
	table.innerHTML += '<tr><td>Name: </td>'		+ '<td><input type="text" id="name" value=""></td></tr>';
	table.innerHTML += '<tr><td>Authors: </td>'		+ '<td><input type="text" id="name" value=""></td></tr>';
	table.innerHTML += '<tr><td>Keywords: </td>'	+ '<td><input type="text" id="url" value=""></td></tr>';
	table.innerHTML += '<tr><td>Tags: </td>'		+ '<td id="tags"></td></tr>';
	table.innerHTML += '<tr><td>Key-values: </td>'	+ '<td id="keyVals"></td></tr>';
	table.innerHTML += '<tr><td>Description: </td>'	+ '<td><input type="text" id="url" value=""></td></tr>';
	table.innerHTML += '<input type="submit" id="setFields" value="Input">';
	
	
	inputFieldForm.appendChild(table)
	
	// chrome.storage.sync.get(['fields'], function(data){ 
	// 	var changeFieldFormList = document.getElementById("changeFieldFormList")
	// 	if (data.fields){
	// 		for (let i = 0; i < data.fields.length; i++) {
	// 			// Append current fields
	// 			changeFieldFormList.innerHTML += '<li><input type="text" class="changeFieldRow" value="' + data.fields[i] + '" display="table-cell"</li>';
	// 		}
	// 	}
	// });
	
	
	
}

function init() {
	
	
	// Used to change available keyword-value fields in the popup
	var changeFieldForm = document.getElementById("changeFieldForm");
	createDynamicFields(changeFieldForm, "changeKeyVals", 'Key-Values', 'KeyVals')
	createDynamicFields(changeFieldForm, "changeTags", 'Tags', 'Tags')
	
	
	inputFieldFormFunc();
	


	
	
	
	
}

window.onload = init;