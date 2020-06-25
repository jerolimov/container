import db from 'pg';

const connectionString = process.env.DB_URL;
const autoMigrate = !process.env.DB_SKIP_MIGRATION;

const connection = new db.Pool({
  connectionString,
});

async function migrateDB() {
  await createTableIfNotExists();
}

async function createTableIfNotExists() {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS values (
      version integer NOT NULL,
      name varchar(200) NOT NULL,
      value varchar(200) NOT NULL,
      PRIMARY KEY (name)
    )
  `);
}

if (autoMigrate) {
  migrateDB().catch(error => console.warn('Could not migrate DB', error));
}

export const testConnection = async () => (await connection.connect()).release();

export interface Value {
  version: number;
  name: string;
  value: string;
}

export const values = {
  getAll: async (): Promise<db.QueryResult<Value>> => {
    return await connection.query<Value>(
      'SELECT * FROM values',
    );
  },
  getValue: async (name: string): Promise<Value> => {
    return (await connection.query<Value>(
      'SELECT * FROM values WHERE name = $1',
      [name]
    )).rows[0];
  },
  upsert: async (name: string, value: string): Promise<Value> => {
    return (await connection.query<Value>(
      `
        INSERT INTO values (version, name, value) VALUES (1, $1, $2)
        ON CONFLICT (name) DO UPDATE
        SET
          version = values.version + 1,
          value = EXCLUDED.value
        RETURNING *
      `,
      [name, value]
    )).rows[0];
  },
};

export default ({
  testConnection,
  values,
});
