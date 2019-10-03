var placeholder = document.getElementById("placeholder");

var mainTable = document.getElementById("maintable");
var tableRows = [];
var tableCells = [];
var tableColumnsToShow = ["full_name", "address", "phone"];
var tableAddingRow;
var tableAddingCells = [];
 
var buttonDelete = document.getElementById("buttonDelete");
var deleteRowIndex = -1;
var buttonAdd = document.getElementById("buttonAdd");

var pageElementsCount = 40;
var pageMaxElementsCount = 40;
var pagesCount = 0;
var pageCurrent = 0;
var spanPageCurrent = document.getElementById("spanPageCurrent");
var spanPagesCount = document.getElementById("spanPagesCount");
var spanPagePrev = document.getElementById("spanPagePrev");
var spanPageNext = document.getElementById("spanPageNext");

var data;


if(localStorage.getItem("saved") == "true") {
	loadDataFromStorage();
} else {
	loadDataFromJSON();
	saveDataToStorage();
}
initPages();
createTable();
openPage(0);

document.onscroll = e => {
	resetButtonDelete();
	resetButtonAdd();
}

buttonDelete.onclick = e => {
	var dataIndex = pageCurrent * pageMaxElementsCount + deleteRowIndex - 1;
	data.splice(dataIndex, 1);
	
	if ( pageElementsCount == 1 ) {
		if ( pageCurrent > 0 ) {
			pageCurrent--;
		} else {
			console.error("Ooops!");
		}
	}
	initPages();
	openPage(pageCurrent);
	resetButtonDelete();
	saveDataToStorage();
}

buttonAdd.onclick = e => {
	data.push({
		full_name : tableAddingCells[0].innerText,
		address : tableAddingCells[1].innerText,
		phone : tableAddingCells[2].innerText
	});
	tableAddingCells[0].innerText = "";
	tableAddingCells[1].innerText = "";
	tableAddingCells[2].innerText = "";
	initPages();
	
	if ( pageElementsCount === 0 ) {
		pageCurrent++;
	}
	
	openPage(pageCurrent);
	resetButtonAdd();
	saveDataToStorage();
}



function openPage(page) {
	if (page < 0 || page >= pagesCount) {
		console.error("Invalid page number!");
		return;
	}
	
	pageCurrent = page;
	spanPageCurrent.innerText = pageCurrent + 1;
	
	if ( page === pagesCount - 1 ) {
		pageElementsCount = data.length % pageMaxElementsCount;
		tableAddingRow.style.display = "";
	} else {
		pageElementsCount = pageMaxElementsCount;
		tableAddingRow.style.display = "none";
	}
	
	
	for(var ix = 0; ix < pageElementsCount; ix++) {
		assignDataToRow(ix, data[pageCurrent * pageMaxElementsCount + ix]);
	}
	
	if ( pageElementsCount < pageMaxElementsCount ) {
		for (var ix = 0; ix < pageElementsCount; ix++) {
			tableRows[ix].style.display = "";
		}
		for (var ix = pageElementsCount; ix < pageMaxElementsCount; ix++) {
			tableRows[ix].style.display = "none";
		} 
	}
	else {
		for (var ix = 0; ix < pageMaxElementsCount; ix++) {
			tableRows[ix].style.display = "";
		}
	}
}

function createTable() {
	mainTable.innerHTML = "";
	tableHeader = document.createElement('tr');
	var headerCell_1 = document.createElement('th');
	var headerCell_2 = document.createElement('th');
	var headerCell_3 = document.createElement('th');
	headerCell_1.innerHTML = "Наименование организации";
	headerCell_2.innerHTML = "Адрес";
	headerCell_3.innerHTML = "Телефон";
	tableHeader.appendChild(headerCell_1);
	tableHeader.appendChild(headerCell_2);
	tableHeader.appendChild(headerCell_3);
	mainTable.appendChild(tableHeader);
	
	for (var ix = 0; ix < pageElementsCount; ix++) {
		tableRows[ix] = document.createElement('tr');
		tableRows[ix].onmouseover = rowOnMouseOver;
		tableCells[ix] = [];
		for ( var jx = 0; jx < 3; jx++) {
			tableCells[ix][jx] = document.createElement('td');
			tableCells[ix][jx].setAttribute("contenteditable", "true");
			tableRows[ix].appendChild(tableCells[ix][jx]);			
			tableCells[ix][jx].onblur = cellOnBlur;
		}
		mainTable.appendChild(tableRows[ix]);
	}
	
	var addingTR = document.createElement('tr');
	for ( var jx = 0; jx < 3; jx++) {
		var addingTH = document.createElement('td');
		tableAddingCells[jx] = addingTH;
		addingTH.setAttribute("contenteditable", "true");
		addingTR.appendChild(addingTH);
	}
	mainTable.appendChild(addingTR);
	tableAddingRow = addingTR;
	tableAddingRow.onmouseover = addingRowOnMouseOver;
	tableAddingRow = addingTR;
	
}

function rowOnMouseOver (e) {
	var row = e.target.parentElement.rowIndex;
	rect = tableRows[row - 1].getBoundingClientRect();
	buttonDelete.style.top = (rect.top + 5) + "px";
	buttonDelete.style.right = (rect.left + 15) + "px";
	deleteRowIndex = row;
	
	resetButtonAdd();
}

function resetButtonAdd () {
	buttonAdd.style.top = "";
	buttonAdd.style.left = "";
}

function resetButtonDelete() {
	buttonDelete.style.top = "";
	buttonDelete.style.left = "";
	deleteRowIndex = -1;
}

function addingRowOnMouseOver (e) {
	rect = tableAddingRow.getBoundingClientRect();
	buttonAdd.style.top = (rect.top + 5) + "px";
	buttonAdd.style.right = (rect.left + 15) + "px";
	
	resetButtonDelete();
}


function cellOnBlur(e) {
	var row = e.target.parentElement.rowIndex;
	var column =  e.target.cellIndex;
	
	if ( data[row][tableColumnsToShow[column]].trim() !== tableCells[row][column].innerText ) {
		data[row][tableColumnsToShow[column]] = tableCells[row][column].innerText
	}
}


function assignDataToRow(rowIndex, rowData){
	tableCells[rowIndex][0].textContent = rowData['full_name'];
	tableCells[rowIndex][1].textContent = rowData['address'];
	tableCells[rowIndex][2].textContent = rowData['phone'];
	
}

function loadDataFromJSON(){
	data = json.LPU;	
}

function loadDataFromStorage() {
	data = JSON.parse(localStorage.getItem("data"));
}

function saveDataToStorage() {
	var serialData = JSON.stringify(data);
	localStorage.setItem("data", serialData);
	localStorage.setItem("saved", "true");
}


function initPages() {
	pagesCount = Math.ceil(data.length / pageMaxElementsCount);
	spanPagesCount.innerText = pagesCount;
}

spanPagePrev.onclick = e => {
	if ( pageCurrent <= 0 ) {
		return;
	}
	openPage(pageCurrent - 1);
}

spanPageNext.onclick = e => {
	if ( pageCurrent >= pagesCount ) {
		return;
	}
	openPage(pageCurrent + 1);
}