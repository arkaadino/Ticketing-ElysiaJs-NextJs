import sequelize from '../config/db'; // Adjusted path
import { Status } from '../models/statuses'; // Adjusted path
import { Category } from '../models/categories'; // Adjusted path
import { Karyawan } from '../models/karyawan';
import { Priority } from '../models/priority'; // Importing Priority model
import { Eskalasi } from '../models/eskalasi';

async function seedDatabase() {
    try {
        // Ensure the database connection is established
        await sequelize.authenticate();
        console.log('Koneksi database berhasil');

        // Create initial statuses
        await Status.bulkCreate([
            { name: 'Completed', is_active: 1 },
            { name: 'Pending', is_active: 1 },
            { name: 'Open', is_active: 1 },
            { name: 'Ongoing', is_active: 1 },
        ]);

        // Create initial categories
        await Category.bulkCreate([
            { name: 'Jaringan', is_active: 1 },
            { name: 'Aplikasi', is_active: 1 },
            { name: 'Data Center', is_active: 1 },
            { name: 'Printer', is_active: 1 },
            { name: 'Laptop/PC', is_active: 1 },
            { name: 'Email', is_active: 1 },
        ]);

        // Create initial priorities
        await Priority.bulkCreate([
            { sla: 24, level: 1, is_active: 1 },
            { sla: 48, level: 2, is_active: 1 },
            { sla: 72, level: 3, is_active: 1 },
        ]);

        // Create initial karyawan
        await Karyawan.bulkCreate([
            {
              nik: 1123213,
              name: 'Budi Santoso',
              position: 'Staff IT',
              unit_kerja: 'Teknologi Informasi',
              job_title: 'Software Engineer',
              is_active: 1,
              id_priorities: 1, // Assigning id_priorities
            },
            {
              nik: 1124,
              name: 'Siti Aminah',
              position: 'HR',
              unit_kerja: 'Human Resources',
              job_title: 'HR Specialist',
              is_active: 1,
              id_priorities: 2, // Assigning id_priorities
            },
        ]);

        await Eskalasi.bulkCreate([
            {
              nik: 123456,
              name: 'Bayu Andaika',
              position: 'IT Helpdesk',
              unit_kerja: 'Teknologi Informasi',
              job_title: 'Software Engineer',
              password: 'lrsjaya1',
              is_active: 1,
            },
        ]);

        console.log('Database seeded successfully');
        process.exit();

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit();

    }
} 

// Run the seeding function
seedDatabase();
