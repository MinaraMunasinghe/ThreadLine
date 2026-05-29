import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db';
import { User } from '../models/User';

async function seedAdmin(): Promise<void> {
    try {
        await connectDatabase();

        const adminEmail = 'admin@threadline.com';
        const adminPassword = 'admin123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const newAdmin = new User({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                firstName: 'System',
                lastName: 'Admin',
            });
            await newAdmin.save();
            console.log('Admin user created successfully.');
        }

        console.log('\n--- Admin Credentials ---');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('-------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
