// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const userRoutes = require('./routes/userRoutes');

// const app = express();
// const port = 3001;

// // Enable CORS for all routes
// app.use(cors());

// // Serve static files from the 'uploads' folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Middleware to parse JSON
// app.use(express.json());

// // Use user routes
// app.use('/api/users', userRoutes);

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

//**********FOR VERCEL */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Only create local folders when not on Vercel
if (!process.env.VERCEL) {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  // Serve static files from the 'uploads' folder locally
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Middleware to parse JSON
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel
module.exports = app;
