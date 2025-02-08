const vcs = window.indexedDB.open("verifiableCredential", 1);
let db;
let dbInitialized = false;

export const dbReady = new Promise((resolve, reject) => {
    vcs.onupgradeneeded = function(event) {
        console.log("Upgrade needed: " + event.target.result);
        db = event.target.result;
        db.createObjectStore("verifiableCredentials", { autoIncrement: true, keyPath: "id" });
        db.createObjectStore("vcJWTs", { autoIncrement: true, keyPath: "id" });
    };

    vcs.onsuccess = function(event) {
        console.log("Success: " + event.target.result);
        db = event.target.result;
        dbInitialized = true;
        resolve();
    };

    vcs.onerror = function(event) {
        console.error("Database error: " + event.target.errorCode);
        reject(event.target.errorCode);
    };
});

export const addVC = ( vc, vcJWT ) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject('Database is not initialized');
        }
        const transaction = db.transaction(['verifiableCredentials', 'vcJWTs'], 'readwrite');
        const store1 = transaction.objectStore('verifiableCredentials');
        const request1 = store1.add(vc);
        request1.onsuccess = () => {};
        request1.onerror = () => reject('Failed to add vc'); 
        const store2 = transaction.objectStore('vcJWTs');
        const request2 = store2.add(vcJWT);

        request2.onsuccess = () => resolve();
        request2.onerror = () => reject('Failed to add vcJWT');
    });
}

export const getVc = ( index ) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('verifiableCredentials', 'readonly');
        const store = transaction.objectStore('verifiableCredentials');
        const request = store.get();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Failed to get data');
    });
}

export const getAllVCs = () => {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject('Database is not initialized');
        }
        const transaction = db.transaction('verifiableCredentials', 'readonly');
        const store = transaction.objectStore('verifiableCredentials');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Failed to get data');
    });
}