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
const printBtn = document.getElementById('print-btn');

// Chiediamo una risoluzione alta alla fotocamera
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: "environment",
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  },
  audio: false
}).then(stream => {
  video.srcObject = stream;
  video.play();
}).catch(err => {
  console.error("Errore nell'accesso alla fotocamera:", err);
  alert("Impossibile accedere alla fotocamera. Controlla i permessi o il supporto del tuo browser.");
});

// Dopo che il video è pronto, impostiamo il canvas alle dimensioni native del video
video.addEventListener('loadedmetadata', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
});

// Scatta Foto
captureBtn.addEventListener('click', () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const frameImg = new Image();
  frameImg.crossOrigin = 'anonymous';
  frameImg.src = selectedFrame.src;
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    previewImg.src = dataURL;
    previewImg.style.display = 'block';

    video.style.display = 'none';
    selectedFrame.style.display = 'none';

    downloadLink.href = dataURL;
    downloadLink.style.display = 'block';
    printBtn.style.display = 'block';
    discardBtn.style.display = 'block';

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

// Scarta foto
discardBtn.addEventListener('click', () => {
  previewImg.style.display = 'none';
  video.style.display = 'block';
  selectedFrame.style.display = 'block';

  downloadLink.style.display = 'none';
  discardBtn.style.display = 'none';
  printBtn.style.display = 'none';

  captureBtn.style.display = 'block';
  uploadFrameBtn.style.display = 'block';
});

// Stampa
printBtn.addEventListener('click', () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<html><head><title>Stampa Immagine</title></head><body style="margin:0; padding:0;">
  <img src="${previewImg.src}" style="width:100%; height:auto;" />
  </body></html>`);

  printWindow.document.close();
  printWindow.focus();
  printWindow.document.querySelector('img').onload = () => {
    printWindow.print();
    printWindow.close();
  };
});
