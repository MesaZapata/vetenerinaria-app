const supabase = require('../config/db');

function flatten(row) {
    const { pets, ...rest } = row;
    const pet_name = pets ? pets.name : null;
    const owner_name = pets && pets.owners ? pets.owners.name : null;
    return { ...rest, pet_name, owner_name };
}

const Appointment = {
    async findAllWithDetails() {
        const { data, error } = await supabase
            .from('appointments')
            .select('*, pets ( name, owners ( name ) )')
            .order('appointment_date', { ascending: false });

        if (error) throw error;
        return data.map(flatten);
    },

    async create({ pet_id, service, appointment_date, medical_notes, diagnosis, weight, prescribed_medicine }) {
        const { data, error } = await supabase
            .from('appointments')
            .insert({
                pet_id,
                service,
                appointment_date,
                medical_notes: medical_notes || '',
                diagnosis: diagnosis || '',
                weight: weight || null,
                prescribed_medicine: prescribed_medicine || ''
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async findByPetId(petId) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*, pets ( name, owners ( name ) )')
            .eq('pet_id', petId)
            .order('appointment_date', { ascending: true });

        if (error) throw error;
        return data.map(flatten);
    },

    async deleteById(id) {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

module.exports = Appointment;
