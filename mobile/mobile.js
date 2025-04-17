import { db, ref, set, onValue } from '../global/firebase-config.js';

// Button to start recording
const button = document.getElementById('startRecordingBtn');

// Status message element
const messageDiv = document.createElement('div');
messageDiv.id = 'statusMessage';
document.body.appendChild(messageDiv);

// Write 'recording' status when button is pressed
button.addEventListener('click', () => {
  const recordingRef = ref(db, 'recordings/recording1'); // or use dynamic ID

  set(recordingRef, {
    status: 'recording',
    createdAt: new Date().toISOString(),
    recordingID: 'recording1',
  })
    .then(() => {
      console.log('Recording started');
    })
    .catch((err) => {
      console.error('Failed to start recording:', err);
    });
});

// Listen for changes to status
const statusRef = ref(db, 'recordings/recording1/status');

onValue(statusRef, (snapshot) => {
  const status = snapshot.val();
  console.log('Status changed:', status);
  if (status === 'recording') {
    messageDiv.textContent = '🎥 Recording has started!';
    messageDiv.style.color = 'green';
  } else {
    messageDiv.textContent = '';
  }
});
