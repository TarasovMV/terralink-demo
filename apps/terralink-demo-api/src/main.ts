import express from 'express';
import pgp from 'pg-promise';
import {StandApi, StandStats, UserApi, UserMeta} from '@terralink-demo/models';

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

app.get('/api', (req, res) => {
    res.send({message: 'Welcome to terralink-demo-api!'});
});

app.get('/api/record_visitor', async (req, res) => {
    const key = '/api/record_visitor';
    const cached = getFromCache(key);

    if (cached) {
        res.send(cached);
        return;
    }

    const users = (await db.any('SELECT * FROM user_meta')) as UserMeta[];
    const response: UserApi[] = users.map(u => ({
        id_visitor: u.user_id,
        music_type: u.music_genre,
        full_name: u.fullname || '',
        record_time: new Date(u.created_at),
    }));

    setCache(key, response);

    res.send(response);
});

app.get('/api/visitor_route', async (req, res) => {
    const key = '/api/visitor_route';
    const cached = getFromCache(key);

    if (cached) {
        res.send(cached);
        return;
    }

    const standStats = (await db.any('SELECT * FROM user_stand')) as StandStats[];
    const response: StandApi[] = standStats.map(s => ({
        id_visitor: s.user_id,
        id_stand: s.stand_id,
        stand_time: new Date(s.created_at),
    }));

    setCache(key, response);

    res.send(response);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
