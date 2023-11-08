import * as SQLite from 'expo-sqlite';

const database_name = 'HikeApp.db';
const database_version = '1.0';
const database_displayname = 'Hike App Database';
const database_size = 200000;

const db = SQLite.openDatabase(
   database_name,
   database_version,
   database_displayname,
   database_size
);

const initDatabase = () => {
   db.transaction((tx) => {
      tx.executeSql(
         `CREATE TABLE IF NOT EXISTS Hike (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            location TEXT,
            date DATE,
            parking_available BOOLEAN,
            length REAL,
            difficulty_level TEXT,
            description TEXT
         );`,
         [],
         () => console.log('Hike table created successfully.'),
         (error) =>
            console.log('Error occurred while creating Hike table.', error)
      );
      tx.executeSql(
         `CREATE TABLE IF NOT EXISTS Observation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            created_at DATETIME,
            note TEXT,
            hike_id INTEGER,
            FOREIGN KEY (hike_id) REFERENCES Hike (id)
         );`,
         [],
         () => console.log('Observation table created successfully.'),
         (error) =>
            console.log(
               'Error occurred while creating Observation table.',
               error
            )
      );
   });
};

const addNewHike = (hike) => {
   const {
      name,
      location,
      date,
      parking_available,
      length,
      difficulty_level,
      description,
   } = hike;
   
   return new Promise((resolve, reject) => {
      db.transaction((tx) => {
         tx.executeSql(
            'INSERT INTO Hike (name, location, date, parking_available, length, difficulty_level, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
               name,
               location,
               date,
               parking_available,
               length,
               difficulty_level,
               description,
            ],
            (_, { insertId }) => {
               console.log(insertId);
               resolve(insertId);
            },
            (_, error) => {
               reject(error);
            }
         );
      });
   });
};

const getListHike = () => {
   return new Promise((resolve, reject) => {
      db.transaction((tx) => {
         tx.executeSql(
            'SELECT * FROM Hike',
            [],
            (_, { rows }) => {
               resolve(rows._array);
            },
            (_, error) => {
               reject(error);
            }
         );
      });
   });
};

const search = (search) => {
   return new Promise((resolve, reject) => {
     db.transaction((tx) => {
       tx.executeSql(
         "SELECT * FROM Hike WHERE name LIKE ?",
         [`%${search}%`],
         (_, { rows }) => {
           resolve(rows._array);
         },
         (_, error) => {
           reject(error);
         }
       );
     });
   });
 };

const getHikeDetail = (hikeId) => {
   return new Promise((resolve, reject) => {
      db.transaction((tx) => {
         tx.executeSql(
            'SELECT * FROM Hike WHERE id = ?',
            [hikeId],
            (_, results) => {
               if (results.rows.length > 0) {
                  const hikeDetail = results.rows.item(0);
                  resolve(hikeDetail);
               } else {
                  resolve(null);
               }
            },
            (_, error) => {
               reject(error);
            }
         );
      });
   });
};

const updateHike = (id, hikeInfo) => {
   const {
      name,
      location,
      date,
      parking_available,
      length,
      difficulty_level,
      description,
   } = hikeInfo;
   return new Promise((resolve, reject) => {
      db.transaction((tx) => {
         tx.executeSql(
            'UPDATE Hike SET name = ?, location = ?, date = ?, parking_available = ?, length = ?, difficulty_level = ?, description = ? WHERE id = ?',
            [
               name,
               location,
               date,
               parking_available,
               length,
               difficulty_level,
               description,
               id,
            ],
            (_, results) => {
               resolve(results.rowsAffected);
            },
            (_, error) => {
               reject(error);
            }
         );
      });
   });
};

const deleteHike = (id) => {
   return new Promise((resolve, reject) => {
      db.transaction((tx) => {
         tx.executeSql(
            'DELETE FROM Hike WHERE id = ?',
            [id],
            () => {
               resolve();
            },
            (_, error) => {
               reject(error);
            }
         );
      });
   });
};

const deleteAllHikes = () => {
   return new Promise((resolve, reject) => {
      db.transaction((tx) => {
         tx.executeSql(
            'DELETE FROM Hike',
            [],
            (_, results) => {
               resolve(results.rowsAffected);
            },
            (_, error) => {
               reject(error);
            }
         );
      });
   });
};

const Database = {
   initDatabase,
   addNewHike,
   getListHike,
   deleteHike,
   updateHike,
   getHikeDetail,
   deleteAllHikes,
   search
};
export default Database;
