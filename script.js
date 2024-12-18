const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const downloadLink = document.getElementById('download-link');
const selectedFrame = document.getElementById('selected-frame');
const uploadFrameBtn = document.getElementById('upload-frame-btn');
const frameInput = document.getElementById('frame-input');
const discardBtn = document.getElementById('discard-btn');
const previewImg = document.getElementById('preview-img');

// Dimensioni finali 16:9
const desiredWidth = 1280;
const desiredHeight = 720;
canvas.width = desiredWidth;
canvas.height = desiredHeight;

// Accesso camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.error("Errore nell'accesso alla fotocamera:", err);
    alert("Impossibile accedere alla fotocamera. Controlla i permessi o il supporto del tuo browser.");
  });

// Scatta Foto
captureBtn.addEventListener('click', () => {
  // Disegna il frame del video sul canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Disegna la cornice
  const frameImg = new Image();
  frameImg.crossOrigin = 'anonymous';
  frameImg.src = selectedFrame.src;
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    // Mostra anteprima
    const dataURL = canvas.toDataURL('image/png');
    previewImg.src = dataURL;
    previewImg.style.display = 'block';
    
    // Nascondi video e frame
    video.style.display = 'none';
    selectedFrame.style.display = 'none';

    // Mostra i pulsanti post-scatto
    downloadLink.href = dataURL;
    downloadLink.style.display = 'block';
    discardBtn.style.display = 'block';

    // Nascondi i pulsanti pre-scatto
    captureBtn.style.display = 'none';
    uploadFrameBtn.style.display = 'none';
  };
});

// Carica nuova cornice
uploadFrameBtn.addEventListener('click', () => {
  frameInput.click();
});

frameInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    selectedFrame.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Scarta la foto scattata
discardBtn.addEventListener('click', () => {
  // Ripristina situazione iniziale
  previewImg.style.display = 'none';
  video.style.display = 'block';
  selectedFrame.style.display = 'block';

  downloadLink.style.display = 'none';
  discardBtn.style.display = 'none';

  captureBtn.style.display = 'block';
  uploadFrameBtn.style.display = 'block';
});
