import * as request from 'supertest';
import { InAccountDTO } from '../../src/account/dto/in.account.dto';
import { InAccount2FAAuthDTO } from '../../src/account/dto/in.account.2fa.auth.dto';

export async function authorizeAccount(data: { email: string, password: string, agent: request.SuperTest<request.Test>}) {
  const loginResponse = await data.agent
    .post('/account/authorization/login')
    .send({
      email: data.email,
      password: data.password,
    } as InAccountDTO)
    .expect(201);

  const auth2FAResponse = await data.agent
    .post('/account/authorization/2fa')
    .send({
      code: '000000',
    } as InAccount2FAAuthDTO)
    .expect(201);
}