import { Connection } from 'typeorm';

export async function getLinkedAccountIds(connection: Connection, accountId: number): Promise<number[]> {
  const params = [ accountId ];

  const query = `
    SELECT "accounts"."id" AS "id" FROM "accounts"
    RIGHT JOIN (
      SELECT COALESCE("mainAccountId", "id") AS "id" FROM "accounts" WHERE "id" = $1
    ) AS tmp
    ON (
      "accounts"."id" = "tmp"."id" OR
      "accounts"."mainAccountId" = "tmp"."id"
    );
  `;

  const resultRaw: { id: number }[] = await connection.query(query, params);
  return resultRaw.map(item => item.id);
}

/**
 * Returns id to set of linked accounts ids
 */
export async function getLinkedAccountIdsMap(connection: Connection, accountIds: number[]): Promise<Map<number, Set<number>>> {
  if (accountIds.length === 0) {
    return new Map();
  }

  const accountIdsLine = accountIds.join(',');
  const params = [ ];

  const query = `
    SELECT "accounts"."id" AS "id", "tmp"."id" AS "mainAccountId" FROM "accounts"
    RIGHT JOIN (
      SELECT COALESCE("mainAccountId", "id") AS "id" FROM "accounts" WHERE "id" IN (${accountIdsLine})
    ) AS tmp
    ON (
      "accounts"."id" = "tmp"."id" OR
      "accounts"."mainAccountId" = "tmp"."id"
    );
  `;

  const resultRaw: { id: number, mainAccountId: number }[] = await connection.query(query, params);
  const result = new Map<number, Set<number>>();

  resultRaw.forEach(item => {
    let ids = result.get(item.mainAccountId);

    if (!ids) {
      ids = new Set<number>();
      result.set(item.mainAccountId, ids);
    }

    ids.add(item.id);
  });

  return result;
}