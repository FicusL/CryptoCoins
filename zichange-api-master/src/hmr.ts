import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import { Session } from './core/session/session.entity';
import { ConfigsService } from './core/service/configs.service';

declare const module: any;

export async function hmr() {
  if (module.hot && !ConfigsService.isProduction) {
    const entityContext =  (require as any).context('.', true, /\.entity\.ts$/);

    const entities = [
      ...entityContext.keys().map(id => {
        const entityModule = entityContext(id);
        // We must get entity from module (commonjs)
        // Get first exported value from module (which should be entity class)
        const [key] = Object.keys(entityModule).filter(k => k.indexOf('Entity') !== -1);
        if (entityModule.hasOwnProperty(key)) {
          return entityModule[key];
        }
      }),
    ];

    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, { entities: [ ...entities, Session ] });

    try {
      const connection = getConnection();
      if (connection.isConnected) {
        await connection.close();
      }
    } catch (e) { }

    await createConnection();
  }
}