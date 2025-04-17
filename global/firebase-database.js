// firebase-database.js

import { database, ref, set, get, child, onValue } from 'firebase/app';

/**
 * Save a new recording entry
 */
export function createRecording(recordingID, status = 'pending') {
  const recordingRef = ref(database, `recordings/${recordingID}`);
  return set(recordingRef, {
    recordingID,
    status,
    createdAt: Date.now()
  });
}

/**
 * Update status of an existing recording
 */
export function updateRecordingStatus(recordingID, newStatus) {
  const recordingRef = ref(database, `recordings/${recordingID}/status`);
  return set(recordingRef, newStatus);
}

/**
 * Get a specific recording entry once
 */
export function getRecording(recordingID) {
  const dbRef = ref(database);
  return get(child(dbRef, `recordings/${recordingID}`));
}

/**
 * Listen for changes to a recording's status
 */
export function onRecordingStatusChange(recordingID, callback) {
  const statusRef = ref(database, `recordings/${recordingID}/status`);
  onValue(statusRef, (snapshot) => {
    const status = snapshot.val();
    callback(status);
  });
}
