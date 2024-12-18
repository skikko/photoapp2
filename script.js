const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const downloadLink = document.getElementById('download-link');
const selectedFrame = document.getElementById('selected-frame');

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
  // Impostiamo le dimensioni del canvas uguali a quelle del video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Disegniamo il frame della fotocamera sul canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Disegniamo la cornice sopra l'immagine
  const frameImg = new Image();
  frameImg.crossOrigin = 'anonymous'; // Impostiamo il crossOrigin
  frameImg.src = selectedFrame.src;
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    // Convertiamo il canvas in data URL
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.style.display = 'inline-block';
  };
});
