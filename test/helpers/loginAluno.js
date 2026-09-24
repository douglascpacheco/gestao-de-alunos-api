import { api } from './api.js';

export default async function loginAluno(email, senha) {
  const resposta = await api().post('/api/auth/login').send({ email, senha });

  return resposta.body.token;
}
