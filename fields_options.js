//
// Option Creators
//

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
				list.innerHTML += '<li><input type="text" class="'+rowClass+'" value="'+data[storageField][i]+'" display="table-cell"></li>';
			}
		}
	});
	container.appendChild(parent);
	
	// ADD FIELD
	var addField = document.getElementById(addFieldId);
	addField.addEventListener("click", function() {
		var list = document.getElementById(listId);		
		var li = document.createElement("li");
		li.innerHTML = '<input type="text" class="'+rowClass+'" display="table-cell">';
		list.appendChild(li);
	});
	
	// REMOVE FIELD
	var removeField = document.getElementById(removeFieldId);
	removeField.addEventListener("click", function() {
		var list = document.getElementById(listId);
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
	});
}