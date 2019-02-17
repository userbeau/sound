// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image Classification using Feature Extraction with MobileNet. Built with p5.js
This example uses a callback pattern to create the classifier
=== */

let featureExtractor;
let classifier;
let video;
let loss;
let imagesOfA = 0;
let imagesOfB = 0;
let imagesOfC = 0;
let classificationResult;
let lastClass = 'D';

var osc1;
var osc2;
var osc3;

function setup() {
  createCanvas(640, 480);
  // Create a video element
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Append it to the videoContainer DOM element
  //video.parent('videoContainer');
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  featureExtractor.numClasses=3
  // Create a new classifier using those features and give the video we want to use
  classifier = featureExtractor.classification(video, videoReady);
  // Set up the UI buttons
  setupButtons();

  osc1 = new p5.Oscillator();
  osc1.setType('sine');
  osc1.freq(75);
  osc1.amp(0);
  osc1.start();

  osc2 = new p5.Oscillator();
  osc2.setType('sine');
  osc2.freq(180);
  osc2.amp(0);
  osc2.start();

  osc3 = new p5.Oscillator();
  osc3.setType('sine');
  osc3.freq(120);
  osc3.amp(0);
  osc3.start();

}

function draw() {
  background(122);
  image(video, 0, 0);
  textSize(64);
  if (classificationResult == 'A' && lastClass !== 'A') {
      osc2.amp(0, 0.5);
      osc3.amp(0, 0.5);
      osc1.amp(0.5, 0.05);
  } else if (classificationResult == 'B' && lastClass !== 'B') {
    osc1.amp(0, 0.5);
    osc3.amp(0, 0.5);
    osc2.amp(0.5, 0.05);
  } else if (classificationResult == 'C' && lastClass !== 'C') {
    osc1.amp(0, 0.5);
    osc2.amp(0, 0.5);
    osc3.amp(0.5, 0.05);
  }
  lastClass = classificationResult;
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  select('#videoStatus').html('Video ready!');
}


// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "A" to the classifier
  buttonA = select('#ButtonA');
  buttonA.mousePressed(function() {
    classifier.addImage('A');
    select('#amountOfAImages').html(imagesOfA++);
  });

  // When the B button is pressed, add the current frame
  // from the video with a label of "B" to the classifier
  buttonB = select('#ButtonB');
  buttonB.mousePressed(function() {
    classifier.addImage('B');
    select('#amountOfBImages').html(imagesOfB++);
  });

  buttonC = select('#ButtonC');
  buttonC.mousePressed(function() {
    classifier.addImage('C');
    select('#amountOfCImages').html(imagesOfC++);
  });

  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  select('#result').html(result);

  classificationResult = result;
  classify();
}
