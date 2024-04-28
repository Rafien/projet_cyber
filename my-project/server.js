const express = require('express');
const session = require('express-session');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const PGSession = require('connect-pg-simple')(session);
require('dotenv').config();
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

const pgPool = new pg.Pool({
  connectionString: process.env.POSTGRES_URI
});
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' 
}));
app.use(express.json());
app.use(session({
  store: new PGSession({
    pool: pgPool,               
    tableName: 'session'        
  }),
  secret: '1234',              
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 5 * 60 * 1000 } // 30 days
}));

// PostgreSQL table creation logic
const createUserTable = async () => {
  const client = await pgPool.connect();
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL
      );
    `;
    await client.query(sql);
  } finally {
    client.release();
  }
};
const addUsers = async () => {
   const username = 'admin';
     hashedPassword = bcrypt.hash('admin', 10)
   const client = await pgPool.connect();
   try {
    
     await client.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING id', [username, hashedPassword]);
   } finally {
     client.release();
   }

}

createUserTable();
addUsers();

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = await pgPool.connect();
  try {
    const result = await client.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING id', [username, hashedPassword]);
    req.session.userId = result.rows[0].id;
    res.status(201).send(/*'User created successfully', */{ userId: req.session.userId });
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  } finally {
    client.release();
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const client = await pgPool.connect();
  try {
    const result = await client.query(`SELECT id, password FROM users WHERE username = '${username}'`);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = result.rows[0];
    const isMatch = true;
    // const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    req.session.userId = user.id;
    res.send(/*'Logged in successfully', */{ userId: user.id });
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    client.release();
  }
});

app.get('/profile', async (req, res) => {
  const userId = req.query.id; // Access the ID passed in query string
  const client = await pgPool.connect();
  if (!userId) {
      return res.status(400).send("User ID is required");
  }

  try {
      const result = await client.query('SELECT username FROM users WHERE id = $1', [userId]);
      if (result.rows.length > 0) {
          res.json(result.rows[0]);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error('Failed to fetch user profile:', error);
      res.status(500).send('Server Error');
  }finally {
    client.release();  // Assurez-vous que cette ligne est présente
}
});

// Middleware pour vérifier si l'utilisateur est administrateur
// const verifyAdmin = require('./middleware/verifyAdmin');

app.get('/api/admin/users', async (req, res) => {
  const client = await pgPool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Internal Server Error');
  }finally {
    client.release();  // Assurez-vous que cette ligne est présente
}
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
