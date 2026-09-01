export interface UploadHistoryItem {
  id: string;
  timestamp: number;
  type: "deck" | "map";
  name: string;
  data: any;
}

const DB_NAME = "WizardsOfTheNorthDB";
const STORE_NAME = "uploadHistory";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function initDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        dbPromise = null;
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    } catch (err) {
      dbPromise = null;
      reject(err);
    }
  });

  return dbPromise;
}

const LOCAL_STORAGE_KEY = "wizards_upload_history";

function getLocalStorageHistory(): UploadHistoryItem[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Local storage read failed", err);
    return [];
  }
}

function saveLocalStorageHistory(items: UploadHistoryItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Local storage write failed", err);
  }
}

export async function saveHistoryItem(item: UploadHistoryItem): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (dbErr) {
    console.warn("IndexedDB failed, falling back to localStorage", dbErr);
    const items = getLocalStorageHistory();
    const filtered = items.filter((i) => i.id !== item.id);
    filtered.unshift(item);
    saveLocalStorageHistory(filtered);
  }
}

export async function getHistoryItems(): Promise<UploadHistoryItem[]> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as UploadHistoryItem[];
        items.sort((a, b) => b.timestamp - a.timestamp);
        resolve(items);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (dbErr) {
    console.warn("IndexedDB failed, falling back to localStorage", dbErr);
    const items = getLocalStorageHistory();
    items.sort((a, b) => b.timestamp - a.timestamp);
    return items;
  }
}

export async function deleteHistoryItem(id: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (dbErr) {
    console.warn("IndexedDB failed, falling back to localStorage", dbErr);
    const items = getLocalStorageHistory();
    const filtered = items.filter((i) => i.id !== id);
    saveLocalStorageHistory(filtered);
  }
}
