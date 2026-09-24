import { expect } from 'chai';
import { api } from '../helpers/api.js';
import loginAdmin from '../helpers/loginAdmin.js';
import loginAluno from '../helpers/loginAluno.js';
import casos from '../fixtures/entrega-trabalho.json' with { type: 'json' };

describe('Entrega de trabalho como aluno', () => {
  let tokenAdmin;

  before(async () => {
    tokenAdmin = await loginAdmin();
  });

  casos.forEach((caso) => {
    it(`deve registrar ${caso.caso}`, async () => {
      const identificador = Date.now();
      const aluno = {
        nome: caso.aluno.nome,
        email: `${caso.aluno.email}.${identificador}@example.com`,
        matricula: `${caso.aluno.matricula}${identificador}`,
        senha: caso.aluno.senha,
      };

      const cadastro = await api().post('/api/admin/alunos')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(aluno);

      expect(cadastro.status).to.equal(201);
      expect(cadastro.body.id).to.be.a('string').and.not.be.empty;
      expect(cadastro.body).to.include({
        nome: aluno.nome, email: aluno.email, matricula: aluno.matricula, role: 'aluno',
      });
      const alunoId = cadastro.body.id;

      const matricula = await api()
        .post(`/api/admin/disciplinas/${caso.trabalho.disciplinaId}/matriculas`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ alunoId });

      expect(matricula.status).to.equal(201);
      expect(matricula.body).to.include({ alunoId, disciplinaId: caso.trabalho.disciplinaId });

      const tokenAluno = await loginAluno(aluno.email, aluno.senha);
      const entrega = await api().post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send(caso.trabalho);

      expect(entrega.status).to.equal(201);
      expect(entrega.body.id).to.be.a('string').and.not.be.empty;
      expect(entrega.body).to.include({
        alunoId,
        disciplinaId: caso.trabalho.disciplinaId,
        titulo: caso.trabalho.titulo,
        descricao: caso.trabalho.descricao,
        status: 'entregue',
      });
    });
  });
});
