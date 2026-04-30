const fs = require('fs');
const path = require('path');

// Simple PNG generator without external dependencies
// Creates a minimal valid PNG with radiation symbol

function createRadiationIcon(size) {
    const width = size;
    const height = size;
    const centerX = Math.floor(size / 2);
    const centerY = Math.floor(size / 2);
    const radius = Math.floor(size * 0.35);
    const strokeWidth = Math.floor(size * 0.04);
    const centerRadius = Math.floor(size * 0.07);

    // Create simple bitmap (black background with yellow radiation symbol)
    const pixels = new Uint8Array(width * height * 4);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            
            // Black background
            pixels[idx] = 11;     // R
            pixels[idx + 1] = 11; // G
            pixels[idx + 2] = 11; // B
            pixels[idx + 3] = 255; // A
            
            const dx = x - centerX;
            const dy = y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Outer circle
            if (Math.abs(dist - radius) < strokeWidth) {
                pixels[idx] = 212;
                pixels[idx + 1] = 160;
                pixels[idx + 2] = 23;
            }
            
            // Center circle
            if (dist < centerRadius) {
                pixels[idx] = 212;
                pixels[idx + 1] = 160;
                pixels[idx + 2] = 23;
            }
            
            // Rays (4 directions)
            const angle = Math.atan2(dy, dx);
            const rayWidth = strokeWidth;
            const innerR = centerRadius + strokeWidth;
            const outerR = radius - strokeWidth;
            
            for (let ray = 0; ray < 4; ray++) {
                const rayAngle = ray * Math.PI / 2;
                const angleDiff = Math.abs(angle - rayAngle);
                const angleDiff2 = Math.abs(angle - rayAngle - Math.PI * 2);
                const minDiff = Math.min(angleDiff, angleDiff2);
                
                if (minDiff < 0.1 && dist > innerR && dist < outerR) {
                    pixels[idx] = 212;
                    pixels[idx + 1] = 160;
                    pixels[idx + 2] = 23;
                }
            }
        }
    }
    
    return pixels;
}

function writePNG(pixels, width, height, filepath) {
    // Simple PNG writer
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR chunk
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    
    const ihdrChunk = createChunk('IHDR', ihdr);
    
    // IDAT chunk (compressed image data)
    const zlib = require('zlib');
    const rawData = Buffer.from(pixels);
    const compressed = zlib.deflateSync(rawData);
    const idatChunk = createChunk('IDAT', compressed);
    
    // IEND chunk
    const iendChunk = createChunk('IEND', Buffer.alloc(0));
    
    const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
    fs.writeFileSync(filepath, png);
}

function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const typeBuffer = Buffer.from(type);
    const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(buffer) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buffer.length; i++) {
        crc ^= buffer[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
        }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
console.log('Generating PNG icons...');

const pixels192 = createRadiationIcon(192);
writePNG(pixels192, 192, 192, path.join(__dirname, 'icon-192.png'));
console.log('Created: icon-192.png');

const pixels512 = createRadiationIcon(512);
writePNG(pixels512, 512, 512, path.join(__dirname, 'icon-512.png'));
console.log('Created: icon-512.png');

console.log('Icons generated successfully!');
