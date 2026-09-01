// ===================================================
// STUDENT TASK: Build a graphical dashboard for Seneye
// ===================================================




// Replace this with your teacher's Cloudflare Worker URL:
const PROXY_URL = "https://seneye-proxy.ezankov.workers.dev/";

// Toggle to true if you are working offline without network access
const USE_OFFLINE_MOCK = false;

let aquariumData = null;
let lastUpdated = "";
let ph = null;

function preload() {
  // Load initial data before setup() runs
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : PROXY_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
}

function setup() {
  createCanvas(1160, 700);
  
  // Refresh live data every 5 minutes (300,000 ms)
  if (!USE_OFFLINE_MOCK) {
    setInterval(() => {
      loadJSON(PROXY_URL, onDataLoaded, onError);
    }, 300000);
  }
}

function onDataLoaded(data) {
  aquariumData = data;
  lastUpdated = new Date().toLocaleTimeString();
  console.log("Data refreshed successfully:", data);
}

function onError(err) {
  console.error("Failed to load aquarium data. Check proxy URL or network.", err);
}

function draw() {
  background(98, 143, 256, 90); // Dark blue aquarium background

  // 1. Draw Title Header
  fill(255);
  textSize(40);
  textAlign(LEFT, TOP);
  text("Fish Environment Dashboard", 315, 30);

  // Display connection status
  textSize(12);
  fill(0, 0, 0);
  text("Last updated: " + (lastUpdated || "Loading..."), 500, 70);

  // 2. Render Dashboard Graphics
  if (aquariumData) {
    // NOTE: Update these keys based on your actual Seneye JSON response structure!
    // Example fields commonly found in sensor data:
    let temp = Math.round(aquariumData[0].exps.temperature.curr * 100)/100 || 24.5;
    let ph = aquariumData[0].exps.ph.curr || 7.2;
    let nh3 = aquariumData[0].exps.nh3.curr || 0.01;
    let o2 = aquariumData[0].exps.o2.curr || 0;
    let light = aquariumData[0].exps.lux.curr || 0;

     

    // Call your custom graphic widgets
    drawTempWidget(50, 120, temp);
    drawGaugeWidget(325, 120, "pH Level", ph, 6.0, 8.5);
    drawGaugeWidget(600, 120, "Ammonia (NH3)", nh3, 0.0, 0.05);
    drawGaugeWidget(875, 120, "Oxygen Level", o2, 0.0, 100.0);
    
    //Testing drawing a background for the data logs
    drawBackgroundSquare(50, 300, "Data Logs", 750, 350);
    //drawBackgroundSquare(850, 300, "Light", 250, 350);
    drawLightWidget(850, 300, "Light", light , 250, 350, 0, 1000)

    if (ph > 8)
    {
      fill(255, 0, 0);
      textSize(24);
      textAlign(RIGHT, BOTTOM);
      text("The Ph is too high!", 525, 120);
      
      //Framecount % (Frames per change) < (number of frames which it is on)
      if (frameCount % 60 < 30) {
        // Red fill with white outline
        fill(150, 0, 0);
        stroke(255);
        strokeWeight(2);
        rect(430, 170, 50, 50, 15);

        // Warning text inside the flashing box
        fill(255);
        noStroke();
        textSize(24);
        textAlign(CENTER, CENTER);
        text("!", 455, 195);
      }
    }
    if (aquariumData[0].exps.nh3.status == 1){
      
      if ((frameCount + 10) % 60 < 30) {
        // Red fill with white outline
        fill(150, 0, 0);
        stroke(255);
        strokeWeight(2)
        circle(745, 195, 50);

        // Warning text inside the flashing box
        fill(255);
        noStroke();
        textSize(24);
        textAlign(CENTER, CENTER);
        text("!", 745, 195);

        //Create the Ammonia text message
        fill(255, 0, 0);
        textSize(24);
        textAlign(RIGHT, BOTTOM);
        text("To Much AMMONIA", 800, 120);
      }
    }
    
  } else {
    // Loading State
    fill(255, 100, 100);
    textSize(18);
    text("Connecting to sensor stream...", 30, 120);
  }
}

// Example Widget Function: Temperature Card
function drawTempWidget(x, y, tempVal) 
{
  // Background Card
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 200, 150, 15);

  // Label
  noStroke();
  fill(180, 200, 220);
  textSize(30);
  text("Water Temp", x + 15, y + 15);

  // Value Display
  fill(100, 220, 255);
  textSize(36);
  text(tempVal + "°C", x + 15, y + 75);
}

// Example Widget Function: Simple Bar Gauge
function drawGaugeWidget(x, y, label, val, minVal, maxVal) 
{
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, 200, 150, 10);

  noStroke();
  fill(360, 200, 220);
  textSize(24);
  text(label, x + 15, y + 15);

  
  fill(255);
  textSize(36);
  text(val, x + 15, y + 60);
}

function drawBackgroundSquare(x, y, label, w, h)
{
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, w, h, 10);

  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text(label, x + 15, y + 15);
}

function drawLightWidget(x, y, label, val, w, h, minVal, maxVal) 
{
  fill(35, 48, 68);
  stroke(60, 80, 110);
  rect(x, y, w, h, 10);

  noStroke();
  fill(180, 200, 220);
  textSize(14);
  text(label, x + 15, y + 15);

  
  fill(255);
  textSize(28);
  text(val, x + 15, y + 50);
}

      