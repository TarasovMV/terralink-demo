export function clearPhoneNumber(phone?: string): string | undefined {
    if (!phone) {
        return undefined;
    }

    return phone.trim().replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '');
}
