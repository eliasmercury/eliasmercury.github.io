// ── IndexedDB wrapper ────────────────────────────────────────────────────────
const DB_NAME = 'lmc';
const DB_VER  = 1;
let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('workouts')) {
        const ws = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
        ws.createIndex('date', 'date');
      }
      if (!db.objectStoreNames.contains('sets')) {
        const ss = db.createObjectStore('sets', { keyPath: 'id', autoIncrement: true });
        ss.createIndex('workoutId', 'workoutId');
      }
      if (!db.objectStoreNames.contains('bodyStats')) {
        db.createObjectStore('bodyStats', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('water')) {
        db.createObjectStore('water', { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains('nutrition')) {
        const ns = db.createObjectStore('nutrition', { keyPath: 'id', autoIncrement: true });
        ns.createIndex('date', 'date');
      }
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror   = e => reject(e.target.error);
  });
}

function tx(store, mode = 'readonly') {
  return openDB().then(db => db.transaction(store, mode).objectStore(store));
}

// Generic CRUD
const DB = {
  add:    (store, obj)     => tx(store,'readwrite').then(s => idbReq(s.add(obj))),
  put:    (store, obj)     => tx(store,'readwrite').then(s => idbReq(s.put(obj))),
  get:    (store, key)     => tx(store).then(s => idbReq(s.get(key))),
  del:    (store, key)     => tx(store,'readwrite').then(s => idbReq(s.delete(key))),
  getAll: (store)          => tx(store).then(s => idbReq(s.getAll())),
  getAllByIndex: (store, idx, val) => tx(store).then(s => idbReq(s.index(idx).getAll(val))),
};

function idbReq(req) {
  return new Promise((res, rej) => {
    req.onsuccess = e => res(e.target.result);
    req.onerror   = e => rej(e.target.error);
  });
}

// ── Workout helpers ──────────────────────────────────────────────────────────
const WDB = {
  saveWorkout: (w) => DB.add('workouts', { ...w, date: w.date || todayStr() }),
  getWorkouts: ()  => DB.getAll('workouts'),
  saveSets:    (workoutId, sets) =>
    Promise.all(sets.map(s => DB.add('sets', { ...s, workoutId }))),
  getSetsFor:  (workoutId) => DB.getAllByIndex('sets', 'workoutId', workoutId),
  updateWorkoutNote: async (workoutId, note) => {
    const w = await DB.get('workouts', workoutId);
    if (!w) return;
    return DB.put('workouts', { ...w, note });
  },
  deleteWorkout: async (workoutId) => {
    await DB.del('workouts', workoutId);
    const sets = await DB.getAllByIndex('sets', 'workoutId', workoutId);
    await Promise.all(sets.map(s => DB.del('sets', s.id)));
  },

  saveBodyStat: (s)  => DB.add('bodyStats', { ...s, date: todayStr() }),
  getBodyStats: ()   => DB.getAll('bodyStats'),

  getWater: (date)   => DB.get('water', date).then(r => r || { date, ml: 0 }),
  addWater: async (ml) => {
    const d   = todayStr();
    const cur = await DB.get('water', d).then(r => r || { date: d, ml: 0 });
    return DB.put('water', { ...cur, ml: Math.max(0, cur.ml + ml) });
  },
  putWater: async (ml) => {
    const d = todayStr();
    return DB.put('water', { date: d, ml: Math.max(0, ml) });
  },
  resetWater: async () => {
    const d = todayStr();
    return DB.put('water', { date: d, ml: 0 });
  },

  addNutrition: (item) => DB.add('nutrition', { ...item, date: item.date || todayStr() }),
  getNutritionFor: (date) => DB.getAllByIndex('nutrition', 'date', date),
  deleteNutrition: (id) => DB.del('nutrition', id),
};

function todayStr() {
  return new Date().toISOString().split('T')[0];
}
