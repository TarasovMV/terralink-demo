export function clearPhoneNumber(phone: string): string {
    return phone.trim().replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '');
}
