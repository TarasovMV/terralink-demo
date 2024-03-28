export function getEmail(qrCode: number): string {
    return `user_${qrCode}@terra.ru`;
}
