// jsPsychSheet v2 - A simple JavaScript library to use jsPsych and Google Sheet to run behavioral experiments online.
// Created by Shashi Kant Gupta, June 06, 2021.

function showUploadStatus(){
  var jspsych_content = document.getElementById("jspsych-content");
  jspsych_content.innerHTML = 'Uploading your data<br><br><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>'
}

function onUploadSuccess(){
  var jspsych_content = document.getElementById("jspsych-content");
  jspsych_content.innerHTML = 'Your data is successfully uploaded!'
}

function ajaxCall(url, data_row, subID, last_i, inbetween){
  if (data_row.length-2 <= last_i){
    console.log('Remote sheet updated!', data_row.length, last_i, inbetween);
    if (inbetween == 0){
      onUploadSuccess();
    }
  }else if ((subID == -1) && (last_i !=0)) {
    jQuery.ajax({
      url: url,
      method: "GET",
      data: [{name: "getSubID", value: 1}],
    }).done(
      function(__e){
        ajaxCall(url, data_row, __e['subID'], last_i, inbetween);
      }
    ).fail(function(__e){
      console.log('Remote sheet update failed', __e);
      return 0;
    });
  }else{
    var data = [];
    var flag = true;
    data.push(data_row[0]);
    while (flag){
      if ((last_i<data_row.length-2) && (data.join("\n").length + data_row[last_i+1].length < 3500)){
        data.push(data_row[last_i+1])
        last_i = last_i + 1
      }else{
        jQuery.ajax({
          url: url,
          method: "GET",
          data: [{name: "data", value: data.join("\n")}, {name: "subID", value: subID}],
        }).done(
          function(__e){
            console.log(Math.floor((last_i/(data_row.length-2))*100).toString() + '% data sent!', __e);
            ajaxCall(url, data_row, __e['subID'], last_i, inbetween);
          }
        ).fail(function(__e){
          console.log('Remote sheet update failed', __e);
          return 0;
        });

        flag = false;
      }
    }
  }
}

var jsPsychSheet = {
  lastrow: 0,

  uploadPartialData: function(url, data, inbetween=1){
    var data_row = data.split(/\r?\n|\r/);
    ajaxCall(url, data_row, -1, this.lastrow, inbetween);
    this.lastrow = data_row.length-2;
  },

  uploadData: function(url, data, inbetween=0){
    if (inbetween == 0){
      showUploadStatus();
    }

    var data_row = data.split(/\r?\n|\r/);
    ajaxCall(url, data_row, -1, this.lastrow, inbetween);
    this.lastrow = data_row.length-2;
  }
}
