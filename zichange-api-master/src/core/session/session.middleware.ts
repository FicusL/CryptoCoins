import * as expressSession from 'express-session';

import { getRepository } from 'typeorm';
import { Session } from './session.entity';
import { TypeormStore } from 'connect-typeorm';

let store;
let sessionMiddleware;

export async function prepareSessionStore() {
  store = new TypeormStore({
    cleanupLimit: 2,
    ttl: 86400,
  } as any).connect(getRepository(Session));

  sessionMiddleware =  expressSession({
    secret: 'D$32Saj!fdA2ydnFak',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    store,
  });
}

export function getSessionMiddleware() {
  if (!sessionMiddleware) {
    sessionMiddleware = expressSession({
      secret: 'D$32Saj!fdA2ydnFak',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
      },
      store,
    });
  }

  return sessionMiddleware;
}