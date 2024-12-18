const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const downloadLink = document.getElementById('download-link');
const selectedFrame = document.getElementById('selected-frame');

// Settaggio proporzioni 16:9 per il canvas
const desiredWidth = 1280;
const desiredHeight = 720;
canvas.width = desiredWidth;
canvas.height = desiredHeight;

// Richiesta accesso alla fotocamera
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
  // Disegniamo il frame della fotocamera sul canvas in 16:9
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Disegniamo la cornice sopra l'immagine
  const frameImg = new Image();
  frameImg.crossOrigin = 'anonymous';
  frameImg.src = selectedFrame.src;
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    // Convertiamo il canvas in data URL
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.style.display = 'inline-block';
  };
});

