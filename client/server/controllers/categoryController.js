const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        // Default categories if empty db
        if (categories.length === 0) {
            return res.json([
                { name: 'CSE' },
                { name: 'EEE' },
                { name: 'ME' },
                { name: 'NSS' },
                { name: 'IEEE' },
                { name: 'Arts Club' },
                { name: 'Whole College' }
            ]);
        }
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCategories };
