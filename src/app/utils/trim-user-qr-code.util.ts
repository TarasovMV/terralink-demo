export function trimUserQrCode(rawQrCode: string): number | null {
    if (!rawQrCode.includes('user_')) {
        return null;
    }

    const strQr = rawQrCode.split('_')?.[1];
    const qr = +strQr;

    if (Number.isNaN(qr)) {
        return null;
    }

    return qr;
}
