import request from 'supertest';
import { config } from 'dotenv';

config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export function api() {
    return request(BASE_URL);
}