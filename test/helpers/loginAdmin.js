import { api } from './api.js';

export default async function loginAdmin() {
  const resposta = await api().post('/api/auth/login').send({
    email: process.env.ADMIN_USER,
    senha: process.env.ADMIN_PASSWORD,
  });

  return resposta.body.token;
}
