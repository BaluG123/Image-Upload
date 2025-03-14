// const fs = require('fs');
// const path = require('path');
// const { generateId } = require('../utils/idGenerator');

// const dataFile = path.join(__dirname, '../data.json');

// // Initialize data file if it doesn't exist
// if (!fs.existsSync(dataFile)) {
//   fs.writeFileSync(dataFile, JSON.stringify([]));
// }

// // Add a new user
// const addUser = (req, res) => {
//   try {
//     const name = req.body.name;
//     if (!name) {
//       return res.status(400).json({ error: 'Name is required' });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: 'Image is required' });
//     }

//     const id = generateId(name);
//     console.log("Uploaded filename:", req.file.filename);
//     const newUser = {
//       id,
//       name,
//       imagePath: `/uploads/${req.file.filename}`,
//       createdAt: new Date().toISOString()
//     };

//     let data = [];
//     try {
//       const fileContent = fs.readFileSync(dataFile, 'utf8');
//       data = JSON.parse(fileContent);
//     } catch (err) {
//       console.error('Error reading data file:', err);
//     }

//     data.push(newUser);

//     // Write updated data back to file
//     fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

//     // Return success response with user data
//     res.status(201).json({
//       success: true,
//       user: newUser
//     });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).json({ error: 'Server error', message: error.message });
//   }
// };

// // Get all users
// const getUsers = (req, res) => {
//   try {
//     const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
//     res.json(data);
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ error: 'Server error', message: error.message });
//   }
// };

// module.exports = { addUser, getUsers };

//*****FOR VERCEL */
// const fs = require('fs');
// const path = require('path');
// const { generateId } = require('../utils/idGenerator');
// const { put } = require('@vercel/blob');

// let dataFile;
// let data = [];

// // In production (Vercel)
// if (process.env.VERCEL) {
//   // Will use Vercel KV or similar for data storage in a real app
//   // For simplicity in this example, we'll use an in-memory array
//   data = [];
// } else {
//   // Local development
//   dataFile = path.join(__dirname, '../data.json');
  
//   // Initialize data file if it doesn't exist
//   if (!fs.existsSync(dataFile)) {
//     fs.writeFileSync(dataFile, JSON.stringify([]));
//   }
  
//   try {
//     const fileContent = fs.readFileSync(dataFile, 'utf8');
//     data = JSON.parse(fileContent);
//   } catch (err) {
//     console.error('Error reading data file:', err);
//   }
// }

// // Add a new user
// const addUser = async (req, res) => {
//   try {
//     const name = req.body.name;
//     if (!name) {
//       return res.status(400).json({ error: 'Name is required' });
//     }
    
//     if (!req.file) {
//       return res.status(400).json({ error: 'Image is required' });
//     }
    
//     const id = generateId(name);
    
//     // Upload file to Vercel Blob Storage
//     const blob = await put(
//       `${id}-${Date.now()}${path.extname(req.file.originalname || '.jpg')}`, 
//       req.file.buffer, 
//       { access: 'public' }
//     );
    
//     const newUser = {
//       id,
//       name,
//       imagePath: blob.url,
//       createdAt: new Date().toISOString()
//     };
    
//     // Add to data
//     data.push(newUser);
    
//     // If running locally, save to file
//     if (!process.env.VERCEL && dataFile) {
//       fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
//     }
    
//     // Return success response with user data
//     res.status(201).json({
//       success: true,
//       user: newUser
//     });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).json({ error: 'Server error', message: error.message });
//   }
// };

// // Get all users
// const getUsers = (req, res) => {
//   try {
//     if (!process.env.VERCEL && dataFile) {
//       // Read from file in local development
//       const fileData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
//       res.json(fileData);
//     } else {
//       // Return in-memory data in production
//       res.json(data);
//     }
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ error: 'Server error', message: error.message });
//   }
// };

// module.exports = { addUser, getUsers };

//********FOR CLOUDINARY */
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { generateId } = require('../utils/idGenerator');

let dataFile;
let data = [];

async function getData() {
  if (process.env.VERCEL) {
    try {
      // Try to get data from environment variable
      // This is a simplistic approach for demonstration purposes
      // In a real app, you'd use a proper database or Vercel KV Store
      return JSON.parse(process.env.APP_DATA || '[]');
    } catch (err) {
      console.error('Error parsing data:', err);
      return [];
    }
  } else {
    // Local development
    try {
      const fileContent = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(fileContent);
    } catch (err) {
      console.error('Error reading data file:', err);
      return [];
    }
  }
}

// Function to save data
async function saveData(newData) {
  if (process.env.VERCEL) {
    // This is just a placeholder - data won't persist between deployments
    // In a real app, you'd use a proper database
    data = newData;
  } else {
    // Local development
    fs.writeFileSync(dataFile, JSON.stringify(newData, null, 2));
  }
}

// Then modify your addUser and getUsers functions to use these functions
// Replace the existing addUser implementation with:
const addUser = async (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    const id = generateId(name);
    
    const newUser = {
      id,
      name,
      imagePath: req.file.path, // Cloudinary URL
      createdAt: new Date().toISOString()
    };
    
    // Get current data and add new user
    const currentData = await getData();
    currentData.push(newUser);
    
    // Save updated data
    await saveData(currentData);
    
    // Return success response with user data
    res.status(201).json({
      success: true,
      user: newUser
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

// Replace the existing getUsers implementation with:
const getUsers = async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

module.exports = { addUser, getUsers };