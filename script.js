const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const downloadLink = document.getElementById('download-link');
const selectedFrame = document.getElementById('selected-frame');
const uploadFrameBtn = document.getElementById('upload-frame-btn');
const frameInput = document.getElementById('frame-input');

// Dimensioni finali 16:9 per l'immagine finale
const desiredWidth = 1280;
const desiredHeight = 720;
canvas.width = desiredWidth;
canvas.height = desiredHeight;

// Accesso alla fotocamera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.error("Errore nell'accesso alla fotocamera:", err);
    alert("Impossibile accedere alla fotocamera. Controlla i permessi o il supporto del tuo browser.");
  });

captureBtn.addEventListener('click', () => {
  // Disegna il frame del video sul canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Disegna la cornice sopra l'immagine
  const frameImg = new Image();
  frameImg.crossOrigin = 'anonymous';
  frameImg.src = selectedFrame.src;
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    // Convertiamo il canvas in data URL
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    // Mostriamo il link di download
    downloadLink.style.display = 'block';
  };
});

// Caricamento nuova cornice
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
