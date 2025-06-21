const express = require('express');
const { body, validationResult } = require('express-validator');
const { 
    hashPassword, 
    comparePassword, 
    generateToken, 
    authenticateToken 
} = require('./auth');
const { 
    createUser, 
    findUserByEmail, 
    findUserByUsername 
} = require('./database');

const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUserByEmail = await findUserByEmail(req.db, email);
        if (existingUserByEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const existingUserByUsername = await findUserByUsername(req.db, username);
        if (existingUserByUsername) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await createUser(req.db, username, email, hashedPassword);

        // Generate token
        const token = generateToken(newUser.id);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await findUserByEmail(req.db, email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                created_at: req.user.created_at
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, [
    body('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { username, email } = req.body;
        const updates = {};

        // Check if username is being updated and if it's already taken
        if (username && username !== req.user.username) {
            const existingUser = await findUserByUsername(req.db, username);
            if (existingUser) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            updates.username = username;
        }

        // Check if email is being updated and if it's already taken
        if (email && email !== req.user.email) {
            const existingUser = await findUserByEmail(req.db, email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            updates.email = email;
        }

        // Update user if there are changes
        if (Object.keys(updates).length > 0) {
            const updateFields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
            const updateValues = Object.values(updates);
            
            const sql = `UPDATE users SET ${updateFields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
            
            await new Promise((resolve, reject) => {
                req.db.run(sql, [...updateValues, req.user.id], function(err) {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Get updated user
            const updatedUser = await findUserById(req.db, req.user.id);
            
            res.json({
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    created_at: updatedUser.created_at
                }
            });
        } else {
            res.json({
                message: 'No changes to update',
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email,
                    created_at: req.user.created_at
                }
            });
        }

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 