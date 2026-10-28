(() => {
  const recorder = document.querySelector('#hero-recorder');
  const modeLabel = document.querySelector('#mode-label');
  const previewNote = document.querySelector('#preview-note');
  const micButton = document.querySelector('#enable-mic');
  const restartButton = document.querySelector('#restart-preview');

  if (recorder) {
    recorder.addEventListener('record-start', ({ detail }) => {
      if (!detail.demo && micButton) { micButton.querySelector('span').textContent = 'Microphone is recording'; micButton.disabled = true; }
    });
    recorder.addEventListener('record-stop', ({ detail }) => {
      if (!detail.demo && micButton) { micButton.querySelector('span').textContent = 'Record another take'; micButton.disabled = false; }
    });
    recorder.addEventListener('record-error', () => {
      if (micButton) { micButton.querySelector('span').textContent = 'Try your microphone'; micButton.disabled = false; }
    });
  }

  if (micButton) {
    micButton.addEventListener('click', async () => {
      if (recorder && recorder.hasAttribute('demo')) recorder.removeAttribute('demo');
      if (modeLabel) modeLabel.textContent = 'MICROPHONE MODE';
      if (previewNote) previewNote.textContent = 'Audio stays in this browser. Nothing is uploaded.';
      if (recorder) await recorder.start();
    });
  }

  if (restartButton && recorder) {
    restartButton.addEventListener('click', () => {
      recorder.reset(); recorder.setAttribute('demo', '');
      if (modeLabel) modeLabel.textContent = 'LIVE PREVIEW';
      if (previewNote) previewNote.textContent = 'A visual preview. Your microphone is off.';
      if (micButton) { micButton.querySelector('span').textContent = 'Try your microphone'; micButton.disabled = false; }
    });
  }
})();
