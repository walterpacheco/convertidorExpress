const { exec } = require('child_process');

// Definir los argumentos que se enviarán al proceso hijo
const command = `node convertir.js registro txt dolar 250000`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al ejecutar el archivo: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    console.log(`Salida:\n${stdout}`);
});