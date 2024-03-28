const RANGE = [2000, 2200];

export function getQrCode(existedQrs: number[]): number {
    const allQrs = new Array(RANGE[1] - RANGE[0])
        .fill(null)
        .map((_, idx) => RANGE[0] + idx);

    const availableQrs = allQrs.filter(q => !existedQrs.includes(q));

    const randomIdx = Math.ceil(Math.random() * availableQrs.length);

    return availableQrs[randomIdx];
}
