// Code.gs - This file contains the backened code to be entered in the Code.gs file in Google App Script. 

// App Script function to host the html page
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// App Script function to interact with google sheet
function addData(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.insertSheet(0);
  var i;
  for(i=0; i< data.length; i++){
    sheet.appendRow(data[i]);
  }
}

// App Script function to interact with google sheet
function addDataMultiBlock(data, start=0) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (start == 1){
    var sheet = ss.insertSheet(0);
  } else {
    var sheet = ss.getActiveSheet();
  }

  var i;
  for(i=0; i< data.length; i++){
    sheet.appendRow(data[i]);
  }
}
