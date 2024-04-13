import express from 'express';
import pgp from 'pg-promise';
import {StandApi, StandMeta, StandStats, UserApi, UserMeta} from '@terralink-demo/models';

export function argsConfig<T>(key: string): T {
    const args = process.argv.slice(2);
    const config = args.reduce((cur, next) => {
        const arg = next.split('=');
        return {...cur, [arg[0]]: arg[1]};
    }, {});

    return config?.[key] || undefined;
}

const DB_URL = argsConfig<string>('DB_URL') || process.env.DB_URL;

console.log(DB_URL);

const app = express();
const db = pgp()(DB_URL);
const cache = new Map<string, {data: any; expires: number}>();

const getFromCache = (key: string) => {
    const cached = cache.get(key);
    if (!cached || Date.now() > cached.expires) {
        return null;
    }

    return cached.data;
};

const setCache = <T>(key: string, data: T): void => {
    const cacheTime = 1000 * 60 * 5; // 5 минут

    cache.set(key, {
        data,
        expires: Date.now() + cacheTime,
    });
};

db.connect().then();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api', (req, res) => {
    res.send({message: 'Welcome to terralink-demo-api!'});
});

app.get('/api/record_visitor', async (req, res, next) => {
    const key = '/api/record_visitor';
    const cached = getFromCache(key);

    if (cached) {
        return res.send(cached);
    }

    let users: UserMeta[] = [];

    try {
        users = (await db.any('SELECT * FROM user_meta')) as UserMeta[];
    } catch (e) {
        return res.status(500).send('DB ERROR');
    }

    const response: UserApi[] = users.map(u => ({
        id_visitor: u.user_id,
        music_type: u.music_genre,
        full_name: u.fullname || '',
        record_time: new Date(u.created_at),
        organization: u.organization,
    }));

    setCache(key, response);

    return res.send(response);
});

app.get('/api/record_stand', async (req, res) => {
    const key = '/api/record_stand';
    const cached = getFromCache(key);

    if (cached) {
        return res.send(cached);
    }

    let stands: StandMeta[] = [];

    try {
        stands = (await db.any('SELECT * FROM stand')) as StandMeta[];
    } catch (e) {
        return res.status(500).send('DB ERROR');
    }

    const response: any[] = stands.map(s => ({
        id_stand: s.id,
        title: s.title,
    }));

    setCache(key, response);

    return res.send(response);
});

app.get('/api/visitor_route', async (req, res) => {
    const key = '/api/visitor_route';
    const cached = getFromCache(key);

    if (cached) {
        res.send(cached);
        return;
    }

    let standStats: StandStats[] = [];

    try {
        standStats = (await db.any('SELECT * FROM user_stand')) as StandStats[];
    } catch (e) {
        return res.status(500).send('DB ERROR');
    }

    const response: StandApi[] = standStats.map(s => ({
        id_visitor: s.user_id,
        id_stand: s.stand_id,
        stand_time: new Date(s.created_at),
    }));

    setCache(key, response);

    res.send(response);
});

app.get('/api/record_visitor/csv', async (req, res) => {
    const users = (await db.any('SELECT * FROM user_meta')) as UserMeta[];
    const userList: any[] = users.map(u => ({
        qr_code: u.qr_code,
        full_name: u.fullname || '',
        music_type: u.music_genre || '',
        organization: u.organization || '',
    }));

    if (userList.length === 0) {
        res.status(404).end('Нет участников');
    }

    const header = 'QR-код;Посетитель;Стиль музыки';
    const rows = [];
    for (const user of userList) {
        rows.push(`${user.qr_code};${user.full_name}\\${user.organization};${user.music_type}`);
    }
    res.setHeader('Content-Type', 'text/csv;');
    res.setHeader('Content-Disposition', 'attachment; filename=Users.csv');
    res.status(200).end(`\uFEFF${header}\n${rows.join('\n')}`);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
