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
const installBtn = document.getElementById('install-btn');

// Impostiamo direttamente la risoluzione desiderata per l'immagine finale
const desiredWidth = 1671;
const desiredHeight = 1181;
canvas.width = desiredWidth;
canvas.height = desiredHeight;

// Richiesta media con risoluzione ideale
navigator.mediaDevices.getUserMedia({
  video: {
    facingMode: "environment",
    width: { ideal: 1671 },
    height: { ideal: 1181 }
  },
  audio: false
}).then(stream => {
  video.srcObject = stream;
  video.play();
}).catch(err => {
  console.error("Errore nell'accesso alla fotocamera:", err);
  alert("Impossibile accedere alla fotocamera. Controlla i permessi o il supporto del tuo browser.");
});

// Scatta Foto
captureBtn.addEventListener('click', () => {
  ctx.drawImage(video, 0, 0, desiredWidth, desiredHeight);

  const frameImg = new Image();
  frameImg.crossOrigin = 'anonymous';
  frameImg.src = selectedFrame.src;
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0, desiredWidth, desiredHeight);
    const dataURL = canvas.toDataURL('image/png');
    previewImg.src = dataURL;
    previewImg.style.display = 'block';

    video.style.display = 'none';
    selectedFrame.style.display = 'none';

    // Generiamo un nome file unico con data e ora
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const fileName = `foto_${year}${month}${day}_${hours}${minutes}${seconds}.png`;

    downloadLink.href = dataURL;
    downloadLink.download = fileName;
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
  reader.onload = function (event) {
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

// Gestione del prompt di installazione (PWA)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      deferredPrompt = null;
      if (choiceResult.outcome === 'accepted') {
        console.log('L\'utente ha accettato l\'installazione');
      } else {
        console.log('L\'utente ha rifiutato l\'installazione');
      }
    });
  });
});
