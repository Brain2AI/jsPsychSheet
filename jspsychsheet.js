// jspsychsheet - A simple JavaScript library to use jsPsych and Google Sheet Appscript to run behavioural experiments online.
// Created by Shashi Kant Gupta, May 19, 2020.

var jsPsychSheet = {
  showUploadStatus: function(){
    var jspsych_content = document.getElementById("jspsych-content");
    jspsych_content.innerHTML = 'Uploading your data<br><br><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
  },

  onUploadSuccess: function(){
    var jspsych_content = document.getElementById("jspsych-content");
    jspsych_content.innerHTML = 'Your data is successfully uploaded!'
  },

  uploadData: function(all_data){
    this.showUploadStatus();
    var data_rows = all_data.split(/\r?\n|\r/);

    var i;
    var data = [];
    for(i=0; i<data_rows.length; i++){
      var row = data_rows[i];
      row = row.slice(1, row.length-1)
      row = row.split('","');
      if(row.length > 1){
        data.push(row);
      }
    }
    google.script.run.withSuccessHandler(this.onUploadSuccess).addData(data);
  }
}
