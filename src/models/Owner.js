const supabase = require('../config/db');

const Owner = {
    async findAll() {
        const { data, error } = await supabase
            .from('owners')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data;
    }
};

module.exports = Owner;
