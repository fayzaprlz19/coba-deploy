const uploadBtn = document.getElementById('upload-image');
const image = document.getElementById('uploaded-image');
const detectionResult = document.getElementById('detection-result');
const realtimeBtn = document.querySelector('.realtime-section');
let streaming = false;

// Function to display uploaded image
function displayImage() {
  const file = this.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', function() {
    image.src = reader.result;
  });

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Function to start real-time detection using webcam
function startRealtime() {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  const detector = new Detector(canvas);

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
     
      // Call the detect function every 33ms
      setInterval(function() {
        if (streaming) {
          // Draw the current video frame to the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Detect objects in the current frame
          const results = detector.detect();
          
          // Display the detection results
          detectionResult.innerHTML = "";
          results.forEach(function(result) {
            const label = result[0];
            const score = result[1];
            const x = result[2][0];
            const y = result[2][1];
            const width = result[2][2];
            const height = result[2][3];
            detectionResult.innerHTML += `${label} (${(score * 100).toFixed(2)}%)<br>`;
            ctx.strokeStyle = "red";
            ctx.strokeRect(x, y, width, height);
          });
        }
      }, 33);
    })
    .catch(function(error) {
      console.error('Unable to access the camera.', error);
    });
}

uploadBtn.addEventListener('change', displayImage);
realtimeBtn.addEventListener('click', function() {
  streaming = !streaming;
  if (streaming) {
    startRealtime();
    realtimeBtn.textContent = "Stop Realtime Detection";
  } else {
    realtimeBtn.textContent = "Realtime Detection";
  }
});
