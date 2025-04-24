// setup_dbase.js

import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';

/**
 * Updates the recording status in the Firebase Realtime Database
 * @param {string} recordingID - Unique ID for the current recording
 * @param {string} status - New status to set (e.g., 'recording', 'completed')
 */
export function updateStatus(recordingID, status) {
  if (!recordingID || !getDatabase()) {
    console.warn('Missing recordingID or Firebase not initialized');
    return;
  }

  const statusRef = ref(getDatabase(), `recordings/${recordingID}`);
  set(statusRef, {
    status: status,
    createdAt: Date.now(),
    recordingID: recordingID,
  })
    .then(() => console.log(`Updated status to "${status}" for ${recordingID}`))
    .catch((err) => console.error('Error updating status:', err));
}

/**
 * Listens for changes in status for a specific recording ID
 * @param {string} recordingID - ID to listen on
 * @param {function} callback - Callback to execute when status changes
 */
export function listenToStatus(recordingID, callback) {
  if (!recordingID || !getDatabase) {
    console.warn('Missing recordingID or Firebase not initialized');
    return;
  }

  const statusRef = ref(getDatabase(), `recordings/${recordingID}`);

  onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    if (data?.status) {
      console.log(`Detected status change: ${data.status}`);
      callback(data.status);
    }
  });
}
