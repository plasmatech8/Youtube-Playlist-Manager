
function init() {
	
	// Elements
	var changeFieldForm = document.getElementById("changeFieldForm");
	
	// Builders
	createDynamicFields(changeFieldForm, "changeKeyVals", 'Key-Values', 'KeyVals'); // Used to change available keyword-value fields in the popup
	createDynamicFields(changeFieldForm, "changeTags", 'Tags', 'Tags');
	
}

window.onload = init;