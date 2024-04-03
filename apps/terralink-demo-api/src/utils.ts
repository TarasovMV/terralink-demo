export function jsonToCsv(data: any[]): string {
    const keys = Object.keys(data[0]);
    const header = keys.join(';');
    const rows = data.map((item) => {
        return keys.map((key) => item[key]).join(';');
    });
    return `\uFEFF${header}\n${rows.join('\n')}`;
}
