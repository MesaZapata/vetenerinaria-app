const supabase = require('../config/db');

const User = {
    async findByUsername(username) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .maybeSingle();

        if (error) throw error;
        return data;
    }
};

module.exports = User;
