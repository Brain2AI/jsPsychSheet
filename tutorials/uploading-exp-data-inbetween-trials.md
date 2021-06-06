# Tutorial on how to upload your experiment data in between the trials.

Sometime it may occur that you want to update your experiments data as the experiment progress. **jsPsych** do provide some callback functions to achieve this but considering this merge of jsPsych with Google AppScript we suggest you to follow the following to achieve this.

## Recommended Method:
* Divide your experiment timeline into different blocks.
* Add one extra "upload_block" after each of the block to upload your data to google sheet.

Demo example from the getting started tutorial:

This is our original expeirment block
```js
var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 5,
  randomize_order: true
}
timeline.push(test_procedure);
```

First we divide it into two separate blocks:
```js
/* Phase one trials */
var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 2,
  randomize_order: true,
}
timeline.push(test_procedure);

/* Phase two trials */
var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 3,
  randomize_order: true,
}
timeline.push(test_procedure);
```

Now add the "upload block" after each of experiment blocks:
```js
/* Phase one trials */
var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 2,
  randomize_order: true,
}
timeline.push(test_procedure);

/* Block to update data on the google sheet. Inside stimulus use any other customised message which you want to deliver to the subject*/
var upload_block = {
  type: "html-keyboard-response",
  stimulus: 'Phase one completed. Press any key to continue.',
  on_finish: function() {
    url = "https://script.google.com/macros/s/AKfycbyvzdoeX-lcyHe-h7ibYKm2UQvFrXqLFBOUH6Db7s0eAPlr-z4fWfmBBLyWhEVFerdCDw/exec";
    jsPsychSheet.uploadPartialData(url, jsPsych.data.get().csv())
  }
}
timeline.push(upload_block);

/* Phase two trials */
var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 3,
  randomize_order: true,
}
timeline.push(test_procedure);

/* Block to update data on the google sheet*/
var upload_block = {
  type: "html-keyboard-response",
  stimulus: 'Phase two completed. Press any key to see your results.',
  on_finish: function() {
    url = "https://script.google.com/macros/s/AKfycbyvzdoeX-lcyHe-h7ibYKm2UQvFrXqLFBOUH6Db7s0eAPlr-z4fWfmBBLyWhEVFerdCDw/exec";
    jsPsychSheet.uploadPartialData(url, jsPsych.data.get().csv())
  }
}
timeline.push(upload_block);
```

Check the [modified experiment](../experiment/demo-simple-rt-task-modified-inbetween-data-update.html) file.

## Other method [for experts]
There are two methods defined in jsPsychSheet by which it uploads data to Google Sheet. You can either upload the data at the end of the experiment for that you need to call the following function inside `jsPsych.init`:
```js
jsPsychSheet.uploadData(<Web app URL>, jsPsych.data.get().csv())
```

In cases, if you want to upload your data to Google Sheet in between the trials, you can use the following function call inside the trials `on_finish` function:
```js
jsPsychSheet.uploadPartialData(<Web app URL>, jsPsych.data.get().csv())
```

So the previous, task can be achieved by simply adding the following attribute to the jsPsych experiment block:
```js
var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 5,
  randomize_order: true,
  on_finish: function() {
    url = "https://script.google.com/macros/s/AKfycbyvzdoeX-lcyHe-h7ibYKm2UQvFrXqLFBOUH6Db7s0eAPlr-z4fWfmBBLyWhEVFerdCDw/exec";
    jsPsychSheet.uploadPartialData(url, jsPsych.data.get().csv())
  }
}
timeline.push(test_procedure);
```

But we do not recommend to use this method mostly because of the following reasons:
* This will force jsPsychSheet to make very frequent request to Apps Script to update the Google Sheets data. Which can sometime create error if the last request is not finished.
* This may create delays in your experiment trials, if your experiment involves reaction time studies then we strongly advise you to not use this shortcut and follow the recommended method.
