export function addWavHeader(samples: Uint8Array, sampleRate: number, numChannels: number): Uint8Array {
    const buffer = new ArrayBuffer(44 + samples.length);
    const view = new DataView(buffer);
    const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); 
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true); 
    writeString(36, 'data');
    view.setUint32(40, samples.length, true);
    const dataView = new Uint8Array(buffer);
    dataView.set(samples, 44);
    return dataView;
}
