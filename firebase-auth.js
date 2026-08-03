(function () {
  const config = window.FIREBASE_CONFIG;
  if (!config) {
    console.error('Firebase config missing.');
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
  script.onload = () => {
    const authScript = document.createElement('script');
    authScript.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js';
    authScript.onload = () => {
      const firestoreScript = document.createElement('script');
      firestoreScript.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js';
      firestoreScript.onload = () => {
        try {
          firebase.initializeApp(config);
          window.firebaseAuth = firebase.auth();
          const db = firebase.firestore();
          window.firebaseDb = db;
        } catch (error) {
          console.error('Firebase initialization failed.', error);
        } finally {
          window.dispatchEvent(new Event('firebase-ready'));
        }
      };
      document.head.appendChild(firestoreScript);
    };
    document.head.appendChild(authScript);
  };
  document.head.appendChild(script);
})();
