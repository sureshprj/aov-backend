const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express(); 
const PORT = 3004;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json()); //handle json request
app.use(cors()); // Enable CORS for all origins

// Helper function to read data from JSON file
function readData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Helper function to write data to JSON file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// CREATE - Add new item
app.post('/items', (req, res) => {
  const data = readData();
  const newItem = req.body;
  newItem.id = Date.now().toString(); // simple unique ID
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// READ - Get all items
app.get('/items', (req, res) => {
  const data = readData();
  res.json(data);
});

// READ - Get item by ID
app.get('/items/:id', (req, res) => {

  const data = readData();
  const item = data.find((item) => item.id == req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// UPDATE - Update item by ID
app.put('/items/:id', (req, res) => {
  const data = readData();
  const index = data.findIndex((item) => item.id == req.params.id);
  if (index !== -1) {
    const updatedItem = { ...data[index], ...req.body };
    data[index] = updatedItem;
    writeData(data);
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// DELETE - Delete item by ID
app.delete('/items/:id', (req, res) => {
  const data = readData();
  const newData = data.filter((item) => item.id != req.params.id);
  if (newData.length !== data.length) {
    writeData(newData);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
