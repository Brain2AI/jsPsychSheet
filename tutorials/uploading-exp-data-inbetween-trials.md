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
      jsPsychSheet.uploadData(jsPsych.data.get().csv(), 1);
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
      jsPsychSheet.uploadData(jsPsych.data.get().csv(), 1);
  }
}
timeline.push(upload_block);
```

Check the [modified experiment](../experiment/demo-simple-rt-task-modified-inbetween-data-update.html) file.

## Other method [for experts]
There are two methods defined in jsPsychSheet by which it uploads data to Google Sheet. You can either upload the data at the end of the experiment for that you need to call the following function inside `jsPsych.init`:
```js
jsPsychSheet.uploadData(jsPsych.data.get().csv());
```

In cases, where you want to upload your data to Google Sheet in between the trials, you can simply add one extra attribute to the `jsPsychSheet.uploadData` function. i.e.
```js
jsPsychSheet.uploadData(jsPsych.data.get().csv(), 1);
```

So the previous, task can be achieved by simply adding the following attribute to the jsPsych experiment block:
```js
var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 5,
  randomize_order: true,
  on_finish: function() {
      jsPsychSheet.uploadData(jsPsych.data.get().csv(), 1);
  }
}
timeline.push(test_procedure);
```

But we do not recommend to use this method mostly because of the following reasons:
* jsPsych builds your overall data in dynamic manner and it may happen that some extra column being added to the experiment after wards, which won't get updated in your Google Sheet.
* This may create delays in your experiment trials, if your experiment involves reaction time studies then we strongly advise you to not use this shortcut and follow the recommended method.
