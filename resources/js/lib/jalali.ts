/**
 * Dependency-free Jalaali (Persian) <-> Gregorian date conversion, ported from
 * the public-domain jalaali-js algorithm, plus a few helpers for building a
 * Persian calendar UI.
 */

export type Jalaali = { jy: number; jm: number; jd: number };
export type Gregorian = { gy: number; gm: number; gd: number };

export const JALALI_MONTHS = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
];

export const JALALI_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

function div(a: number, b: number): number {
    return Math.floor(a / b);
}

function mod(a: number, b: number): number {
    return a - Math.floor(a / b) * b;
}

function jalCal(jy: number): { leap: number; gy: number; march: number } {
    const breaks = [
        -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
        2192, 2262, 2324, 2394, 2456, 3178,
    ];
    const bl = breaks.length;
    const gy = jy + 621;
    let leapJ = -14;
    let jp = breaks[0];

    let jm = 0;
    let jump = 0;

    for (let i = 1; i < bl; i += 1) {
        jm = breaks[i];
        jump = jm - jp;

        if (jy < jm) {
            break;
        }

        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
    }

    let n = jy - jp;

    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);

    if (mod(jump, 33) === 4 && jump - n === 4) {
        leapJ += 1;
    }

    const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
    const march = 20 + leapJ - leapG;

    if (jump - n < 6) {
        n = n - jump + div(jump + 4, 33) * 33;
    }

    let leap = mod(mod(n + 1, 33) - 1, 4);

    if (leap === -1) {
        leap = 4;
    }

    return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
    let d =
        div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
        div(153 * mod(gm + 9, 12) + 2, 5) +
        gd -
        34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;

    return d;
}

function d2g(jdn: number): Gregorian {
    let j = 4 * jdn + 139361631;
    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = div(mod(j, 1461), 4) * 5 + 308;
    const gd = div(mod(i, 153), 5) + 1;
    const gm = mod(div(i, 153), 12) + 1;
    const gy = div(j, 1461) - 100100 + div(8 - gm, 6);

    return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
    const r = jalCal(jy);

    return (
        g2d(r.gy, 3, r.march) +
        (jm - 1) * 31 -
        div(jm, 7) * (jm - 7) +
        jd -
        1
    );
}

function d2j(jdn: number): Jalaali {
    const gy = d2g(jdn).gy;
    let jy = gy - 621;
    const r = jalCal(jy);
    const jdn1f = g2d(gy, 3, r.march);
    let k = jdn - jdn1f;

    if (k >= 0) {
        if (k <= 185) {
            const jm = 1 + div(k, 31);
            const jd = mod(k, 31) + 1;

            return { jy, jm, jd };
        }

        k -= 186;
    } else {
        jy -= 1;
        k += 179;

        if (r.leap === 1) {
            k += 1;
        }
    }

    const jm = 7 + div(k, 30);
    const jd = mod(k, 30) + 1;

    return { jy, jm, jd };
}

export function toJalaali(gy: number, gm: number, gd: number): Jalaali {
    return d2j(g2d(gy, gm, gd));
}

export function toGregorian(jy: number, jm: number, jd: number): Gregorian {
    return d2g(j2d(jy, jm, jd));
}

export function isLeapJalaali(jy: number): boolean {
    return jalCal(jy).leap === 0;
}

export function jalaaliMonthLength(jy: number, jm: number): number {
    if (jm <= 6) {
        return 31;
    }

    if (jm <= 11) {
        return 30;
    }

    return isLeapJalaali(jy) ? 30 : 29;
}

/**
 * Convert an ISO `YYYY-MM-DD` string to a Jalaali date.
 */
export function isoToJalaali(iso: string): Jalaali | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);

    if (!match) {
        return null;
    }

    return toJalaali(Number(match[1]), Number(match[2]), Number(match[3]));
}

/**
 * Convert a Jalaali date to an ISO `YYYY-MM-DD` string.
 */
export function jalaaliToIso(jy: number, jm: number, jd: number): string {
    const g = toGregorian(jy, jm, jd);
    const pad = (n: number) => String(n).padStart(2, '0');

    return `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`;
}

/**
 * Format an ISO date as a Persian (Jalaali) string, e.g. "۱۴۰۳ تیر ۱۵".
 */
export function formatJalaali(iso: string | null | undefined): string {
    if (!iso) {
        return '';
    }

    const j = isoToJalaali(iso);

    if (!j) {
        return '';
    }

    return `${j.jd} ${JALALI_MONTHS[j.jm - 1]} ${j.jy}`;
}

/**
 * The JS weekday (0=Sun..6=Sat) of the first day of a Jalaali month, mapped to
 * a Persian week starting on Saturday (0=Sat..6=Fri).
 */
export function jalaaliFirstWeekday(jy: number, jm: number): number {
    const g = toGregorian(jy, jm, 1);
    const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay();

    return (jsDay + 1) % 7;
}
