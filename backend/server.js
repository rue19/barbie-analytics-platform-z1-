import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory database (replace with real database in production)
let users = [
  {
    id: '1',
    email: 'admin@excelanalytics.com',
    username: 'admin',
    password: '$2a$10$8K1p/a0dRTlB0.Z6Kz7k.e8.9.9.9.9.9.9.9.9.9.9.9.9.9.9.9.9.9', // admin123
    role: 'admin',
    joined: new Date(),
    lastLogin: new Date(),
    status: 'active',
    preferences: {
      theme: 'light',
      language: 'en',
      defaultChartType: 'bar'
    }
  }
];

let analyses = [];
let files = [];

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      email,
      username,
      password: hashedPassword,
      role: 'user',
      joined: new Date(),
      lastLogin: new Date(),
      status: 'active',
      preferences: {
        theme: 'light',
        language: 'en',
        defaultChartType: 'bar'
      }
    };

    users.push(user);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File Upload Routes
app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 1) {
      return res.status(400).json({ error: 'The sheet is empty' });
    }

    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    // Detect data types
    const dataTypes = headers.map((header, colIndex) => {
      const columnData = dataRows.map(row => row[colIndex]).filter(val => val != null);
      
      if (columnData.length === 0) return 'string';
      
      // Check for numbers
      if (columnData.every(val => !isNaN(Number(val)))) return 'number';
      
      // Check for dates
      if (columnData.every(val => !isNaN(Date.parse(val)))) return 'date';
      
      // Check for booleans
      if (columnData.every(val => 
        ['true', 'false', '1', '0'].includes(String(val).toLowerCase())
      )) return 'boolean';
      
      return 'string';
    });

    const fileData = {
      id: uuidv4(),
      userId: req.user.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      parsedData: {
        headers,
        data: dataRows,
        metadata: {
          rowCount: dataRows.length,
          columnCount: headers.length,
          dataTypes
        }
      }
    };

    files.push(fileData);

    res.json({
      fileId: fileData.id,
      parsedData: fileData.parsedData,
      fileName: fileData.fileName
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Analysis Routes
app.post('/api/analysis/create', authenticateToken, (req, res) => {
  try {
    const { fileId, chartType, chartData, description, isPublic } = req.body;

    const analysis = {
      id: uuidv4(),
      userId: req.user.userId,
      fileId,
      chartType,
      chartData,
      description,
      isPublic: isPublic || false,
      saved: new Date(),
      insights: [],
      summary: ''
    };

    analyses.push(analysis);

    res.status(201).json(analysis);
  } catch (error) {
    console.error('Analysis creation error:', error);
    res.status(500).json({ error: 'Error creating analysis' });
  }
});

app.get('/api/analysis/user/:userId', authenticateToken, (req, res) => {
  try {
    const userAnalyses = analyses.filter(analysis => analysis.userId === req.user.userId);
    res.json(userAnalyses);
  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: 'Error fetching analyses' });
  }
});

// Admin Routes
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  try {
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalAnalyses: analyses.length,
      totalFiles: files.length,
      storageUsed: files.reduce((sum, file) => sum + file.fileSize, 0)
    };
    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});