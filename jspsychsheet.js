// jsPsychSheet - A simple JavaScript library to use jsPsych and Google Sheet Apps Script to run behavioral experiments online.
// Created by Shashi Kant Gupta, May 19, 2020.

var jsPsychSheet = {
  lastrow: 0,

  showUploadStatus: function(){
    var jspsych_content = document.getElementById("jspsych-content");
    jspsych_content.innerHTML = 'Uploading your data<br><br><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
  },

  onUploadSuccess: function(){
    var jspsych_content = document.getElementById("jspsych-content");
    jspsych_content.innerHTML = 'Your data is successfully uploaded!'
  },

  uploadData: function(all_data, inbetween=0){
    if (inbetween == 0){
      this.showUploadStatus();
    }

    var data_rows = all_data.split(/\r?\n|\r/);

    var i;
    var data = [];
    var rowlast;
    for(i=this.lastrow; i<data_rows.length; i++){
      var row = data_rows[i];
      row = row.slice(1, row.length-1)
      row = row.split('","');
      if(row.length > 1){
        rowlast = i
        data.push(row);
      }
    }

    if (inbetween == 0){
      if (this.lastrow == 0){
        google.script.run.withSuccessHandler(this.onUploadSuccess).addData(data);
      } else{
        google.script.run.withSuccessHandler(this.onUploadSuccess).addDataMultiBlock(data);
      }
    } else {
      if (this.lastrow == 0){
        google.script.run.addDataMultiBlock(data, 1);
      } else{
        google.script.run.addDataMultiBlock(data);
      }
    }

    this.lastrow = rowlast+1;
  }
}
