// src/lib/logger.ts

import db from '@/lib/db';
import { ActionType } from '@prisma/client';

export async function createLog(
  action: ActionType,
  entity: string,
  entityId?: number,
  userId?: number,
  details?: string
) {
  await db.log.create({
    data: {
      action,
      entity,
      entityId,
      userId,
      details,
    },
  });
}
