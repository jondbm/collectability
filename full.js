const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const PORT = 3000;

// Opening the SQLite database
async function openDb() {
    return open({
        filename: 'collectibles.db',
        driver: sqlite3.Database
    });
}

// Initialize and set up the database
async function initializeDb() {
    const db = await openDb();
    await db.exec('CREATE TABLE IF NOT EXISTS collectibles (id INTEGER PRIMARY KEY, image TEXT, description TEXT, price REAL)');
    return db;
}

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to upload a new collectible
app.post('/api/upload', upload.single('image'), async (req, res) => {
    const { description, price } = req.body;
    const image = req.file ? req.file.path : '';

    const db = await openDb();
    await db.run('INSERT INTO collectibles (image, description, price) VALUES (?, ?, ?)', [image, description, price]);
    res.status(201).send({ message: 'Collectible uploaded successfully' });
});

// Endpoint to get the catalog of collectibles
app.get('/api/catalog', async (req, res) => {
    const db = await openDb();
    const collectibles = await db.all('SELECT * FROM collectibles');
    res.status(200).send(collectibles);
});

// Endpoint to get an individual collectible item
app.get('/api/catalog/item/:id', async (req, res) => {
    const db = await openDb();
    const item = await db.get('SELECT * FROM collectibles WHERE id = ?', req.params.id);
    if (item) {
        res.status(200).send(item);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});

app.post('/api/edit', upload.single('image'), async (req, res) => {
    const { id, description, price } = req.body;
    const db = await openDb();

    let query, params;
    if (req.file) {
        query = 'UPDATE collectibles SET description = ?, price = ?, image = ? WHERE id = ?';
        params = [description, price, req.file.path, id];
    } else {
        query = 'UPDATE collectibles SET description = ?, price = ? WHERE id = ?';
        params = [description, price, id];
    }

    await db.run(query, params);
    res.status(200).send({ message: 'Collectible updated successfully' });
});

// Endpoint to delete an existing collectible
app.delete('/api/catalog/:id', async (req, res) => {
    const db = await openDb();
    await db.run('DELETE FROM collectibles WHERE id = ?', req.params.id);
    res.status(200).send({ message: 'Collectible deleted successfully' });
});

// Start the server
(async () => {
    const db = await initializeDb();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();
