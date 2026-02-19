import express from 'express';
import { db } from '../server.js';

const router = express.Router();


router.get('/', (req, res) => {
    
    const sql = 'SELECT * FROM user_permissions_granted';

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({err: 'Database connection error: initiate all accessRoute'})
        }

        connection.query(sql, (err, result) => {
            connection.release();

            if (err){
                return res.status(500).json({err: 'error fetching user_permissions'})
            }

            res.json(result);
        });
    });
});


// Get single set of access assigned to a user
router.get('/:id', (req, res) => {
    
    const { id } = req.params;
    
    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ err: 'Database connection error: initiate single accessRoute'})
        }

        const sql = 'SELECT * FROM user_permissions_granted where id = ?';

        connection.query(sql, (err, result) => {
            connection.release();

            if (err) {
                return res.status(500).json({ err: 'error fetching user_permissions - get single id'})
            };

            if(result === 0){
                return res.status(404).json({err: 'user permission not found'})
            };

            res.json(result[0]);
        });
    });
});

// Create set of acess assigned to a user
router.post('/', (req, res) => {
    const { id, U_PERM,  U_MAIN = 0, U_CODE, MAIN_CODE, G_CODE } = req.body;

    if(!G_CODE){
        return res.status(400).json({err: 'G_CODE is required'});
    }

    db.getConnection((err, connection) => {
        if(err){
            return res.status(500).json({err: 'Database connection failed!'});
        }

        const sql = 'INSERT INTO user_permissions_granted(id, U_PERM,  U_MAIN, U_CODE, MAIN_CODE, G_CODE) VALUES (?,?,?,?,?,?)';
        const params = [id, U_PERM,  U_MAIN, U_CODE, MAIN_CODE, G_CODE ];

        connection.query(sql, params, (err, result) => {
            connection.release();

            if(err) {
                return res.status(500).json({ err: 'Error inserting access rights'})
            }

            res.status(201).json({
                message: 'Access rights successfully assigned',
                success: true
            })
        });
    });
});

// Update assigned access rights to a user
// router.put('/:id', (req, res) => {
//     const { id } = req.params;
//     const { U_PERM,  U_MAIN = 0, U_CODE, MAIN_CODE, G_CODE } = req.body;

//     if (!G_CODE) {
//         return res.status(400).json({ error: 'G_CODE is required'});
//     }

    

// })

export default router;