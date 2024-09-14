const fs = require('fs');
const https = require('https');

// Recibir argumentos
const [,, filename, extension, indicator, pesos] = process.argv;

if (!filename || !extension || !indicator || !pesos) {
    console.error('Debes ingresar todos los argumentos: <nombre_archivo> <extension> <indicador> <pesos>');
    process.exit(1);
}

const apiUrl = `https://mindicador.cl/api/${indicator}`;

https.get(apiUrl, (resp) => {
    let data = '';

    // Recibir los datos en chunks
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // Cuando se reciben todos los datos
    resp.on('end', () => {
        const jsonData = JSON.parse(data);

        if (!jsonData.serie || jsonData.serie.length === 0) {
            console.error('No se encontraron datos para el indicador solicitado.');
            return;
        }

        const valorIndicador = jsonData.serie[0].valor;
        const conversion = pesos / valorIndicador;

        // Generar el contenido para el archivo
        const contenidoArchivo = `
A la fecha: ${new Date().toString()}
Fue realizada cotización con los siguientes datos:
Cantidad de pesos a convertir: ${pesos} pesos
Convertido a "${indicator}" da un total de:
$${conversion.toFixed(2)}
        `;

        // Escribir el archivo
        fs.writeFile(`${filename}.${extension}`, contenidoArchivo, (err) => {
            if (err) throw err;
            console.log('Archivo creado y guardado:');
            console.log(contenidoArchivo);
        });
    });

}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
