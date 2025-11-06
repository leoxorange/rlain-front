function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTypedKeys<T>(obj: any): Array<T> {
    return Object.keys(obj) as Array<T>;
}

const formatTime = (seconds?: number) => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

// Utility function to convert byte array to base64
function bytesToBase64(bytes: number[]): string {
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return btoa(binary);
}

// Convert artwork to data URL
function artworkToDataUrl(artwork: number[] | null): string | undefined {
    if (!artwork || artwork.length === 0) return void 0;

    const base64 = bytesToBase64(artwork);
    return `data:image/jpeg;base64,${base64}`;
}

export { getRandomInt, getTypedKeys, formatTime, debounce, artworkToDataUrl }