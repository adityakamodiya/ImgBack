import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import connection, { dbName } from './connection.js';

let db;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: false }));

// Serve static files from the uploads directory
app.use('/file', express.static(path.join(__dirname, 'uploads'))); // Change '/uploads' to '/file'

// Handle file upload via POST request
app.post('/send', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFile = req.files.file;
  const uploadDir = path.join(__dirname, 'uploads', uploadedFile.name);

  uploadedFile.mv(uploadDir, async (err) => {
    if (err) return res.status(500).send(err);

    // Save the file information in the database
    const fileId = uploadedFile.name; // This is the filename, you can use a unique ID if needed
    const filePath = path.join(__dirname, 'uploads', fileId); // Store the full path if needed

    try {
    //   await db.collection('files').insertOne({ fileId: fileId, filePath: filePath });
      res.send({ message: `File uploaded successfully`, fileId: fileId, filePath: filePath });
    } catch (dbError) {
      return res.status(500).send('Error saving file info to database.');
    }
  });
});

// Start the server on a specific port
const PORT = 8000;
connection.then((client) => {
  db = client.db(dbName);
});
app.listen(PORT, () => console.log(PORT + ' started'));
