// contactsController.js

const db = require('../db'); // Import the database connection

// Create a new contact
exports.createContact = (req, res) => {
    const { area, site } = req.body;
    // Busca analistas según área y site
    const query = `
        SELECT a.*, s.nombre as site_nombre, ar.subsidiaria
        FROM Analista a
        JOIN Site s ON a.site_id = s.id
        JOIN AreaTrabajo ar ON a.area_id = ar.id
        WHERE ar.id = ? AND s.id = ?
    `;
    db.query(query, [area, site], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
};
// Get all contacts
exports.getContacts = (req, res) => {
    const query = 'SELECT * FROM contacts';
    
    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
};

// Update a contact
exports.updateContact = (req, res) => {
    const { id } = req.params;
    const { area, site, contactNumber } = req.body;
    const query = 'UPDATE contacts SET area = ?, site = ?, contact_number = ? WHERE id = ?';
    
    db.query(query, [area, site, contactNumber, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json({ id, area, site, contactNumber });
    });
};

// Delete a contact
exports.deleteContact = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM contacts WHERE id = ?';
    
    db.query(query, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(204).send();
    });
};