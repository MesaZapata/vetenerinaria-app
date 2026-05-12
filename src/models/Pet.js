const supabase = require('../config/db');

const Pet = {
    async findAll() {
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('pets')
            .select('*, owners(name)')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        const { owners, ...pet } = data;
        return { ...pet, owner_name: owners ? owners.name : null };
    },

    async findAllWithOwner() {
        const { data, error } = await supabase
            .from('pets')
            .select('*, owners(name)')
            .order('name', { ascending: true });

        if (error) throw error;
        return data.map(({ owners, ...pet }) => ({
            ...pet,
            owner_name: owners ? owners.name : null
        }));
    },

    async create({ name, owner_id }) {
        const { data, error } = await supabase
            .from('pets')
            .insert({ name, owner_id })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

module.exports = Pet;
