const db = require('../index');
const bcrypt = require('bcrypt');

(async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin1234', salt);
        
        await db.usuario.create({
            nombre: 'Admin',
            apellido: 'Admin',
            correoelectronico: 'admin@example.com',
            contrasena: hashedPassword,
            direccion: 'Dirección de Admin',
            telefono: '1234567890',
            rol: 'administrador'
        });
        
        console.log('Administrador por defecto creado con éxito.');
    } catch (error) {
        console.error('Error creando el administrador por defecto:', error);
    } finally {
        db.sequelize.close();
    }
})();
