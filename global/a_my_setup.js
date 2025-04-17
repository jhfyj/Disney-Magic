// a_my_setup.js

// ✅ Global state variables
let currentState = 'idle'; // Can be 'idle', 'recording', 'completed', etc.
let recordingID = null;
let userID = null;

// ✅ Shared setup logic (not p5.js-specific setup, that stays in sketch.js)
function initApp() {
  console.log("Shared setup initialized");

  // Generate a simple ID for this session (if needed)
  if (!userID) {
    userID = `user_${Date.now()}`;
  }
}

// ✅ Shared helper functions
function updateStatus(newStatus) {
  if (window.fireb_ && window.fireb_.ref && window.fireb_.database) {
    const db = window.fireb_.database;
    const statusRef = window.fireb_.ref(db, `recordings/${recordingID}`);

    window.fireb_.set(statusRef, {
      status: newStatus,
      createdAt: Date.now(),
      recordingID: recordingID
    }).then(() => {
      console.log(`Status updated to ${newStatus}`);
    }).catch((err) => {
      console.error("Error updating status:", err);
    });
  } else {
    console.warn("Firebase not initialized");
  }
}
