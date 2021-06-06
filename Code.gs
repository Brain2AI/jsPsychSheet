// Important AppScript function which is called when any AJAX request is made using the webapp URL. |==========
function doGet(e){
  return handleResponse(e);
}

// Function to convert CSV data into array |===================================================================
function csvToArray(subID, csvData){
  var data_rows = csvData.split(/\r?\n|\r/);
  var i;
  var data = [];

  var row = data_rows[0];
  row = row.slice(1, row.length-1);
  row = row.split('","');
  if(row.length > 1){
    data.push(["sheet_sub_id"].concat(row));
  }

  for(i=1; i<data_rows.length; i++){
    var row = data_rows[i];
    row = row.slice(1, row.length-1);
    row = row.split('","');
    if(row.length > 1){
      data.push([subID].concat(row));
    }
  }

  return data;
}

function handleResponse(e) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try {
    // Get the sheet associated with the given AppScript.
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    var nextRow = sheet.getLastRow()+1;

    // Assign subject ID |======================================================================================
    if (nextRow<3){
      subID = 0;
    }else{
      subID = sheet.getRange(nextRow-1, 1, 1, 1).getValues()[0][0] + 1;
    }

    // If subID has been provided as an argument use that one.
    if (parseInt(e.parameter["subID"]) >= 0){
      subID = parseInt(e.parameter["subID"])
    }

    // Two types of query |======================================================================================
    // 1. Retreive the current subject ID
    // 2. Update the data
    if (e.parameter["getSubID"] == 1){
      if (!(e.parameter["subID"] >= 0)){
        subID = subID - 1
      }
    }else{
      // Extract CSV data files to array lists |==================================================================
      csvData = e.parameter["data"];
      data = csvToArray(subID, csvData);
      var data_headers = data[0];

      // Check sheet's current header names. Add any additional header name if jsPsych sends it |=================
      if (nextRow==1){
        sheet.getRange(nextRow, 1, 1, data[0].length).setValues([data_headers]);
        var headers = data_headers;
        nextRow = nextRow+1
      }else{
        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        var add_headers = [];
        for (i in data_headers){
          if (!headers.includes(data_headers[i])){
            add_headers.push(data_headers[i]);
          }
        }
        if (add_headers.length>0){
          sheet.getRange(1, headers.length+1, 1, add_headers.length).setValues([add_headers]);
        }
      }
      // Get the most latest header names
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

      // Create header to data column map |========================================================================
      header2dataCol = {}
      for (i in data_headers){
        header2dataCol[data_headers[i]] = i
      }
      for (i in headers){
        if (!data_headers.includes(headers[i])){
          header2dataCol[headers[i]] = data_headers.length
        }
      }

      // Fill data |===============================================================================================
      for(i=1; i< data.length; i++){
        data_row = data[i];
        data_row.push("");
        var row = [];
        for (j in headers){
          row.push(data_row[header2dataCol[headers[j]]]);
        }
        sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
        nextRow = nextRow + 1
      }
    }

    // Return success results |====================================================================================
    return ContentService
    .createTextOutput(JSON.stringify({"result":"success", "subID": subID, "rsubID": parseInt(e.parameter["subID"])}))
    .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    // if error return this
    return ContentService
    .createTextOutput(JSON.stringify({"result":"error", "error": e}))
    .setMimeType(ContentService.MimeType.JSON);
  } finally {
    //release lock
    lock.releaseLock();
  }
}
