import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const postChallengeItem = createAPI(
  async ({
    body: {
      challengeId,
      name,
      type,
      intervalType,

      repeatType,
      repeat,
      rest,

      days,

      dates,
      weeks,

      months,

      targetCount,
      unit,
      accumulateType,

      startAt,
      endAt,
    },
    userId,
    prismaClient,
  }) => {
    const challenge = await prismaClient.challenge.findUnique({
      where: {
        id: challengeId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (challenge == null) {
      throw new BadRequestError('can not find challenge data');
    }

    const result = await prismaClient.challengeItem.create({
      data: {
        challengeId,
        name,
        type,
        intervalType,
        repeatType,
        repeat,
        rest,
        days,
        dates,
        weeks,
        months,
        targetCount,
        unit,
        accumulateType,
        startAt,
        endAt,
      },
      select: {
        id: true,
      },
    });

    return {
      id: result.id,
    };
  },
  {
    body: t.Object({
      challengeId: t.String(),
      name: v.isChallengeItemName,
      type: v.isChallengeItemType,
      intervalType: v.isChallengeItemIntervalType,

      repeatType: v.isChallengeItemRepeatType,
      repeat: t.Optional(t.Nullable(t.Number())),
      rest: t.Optional(t.Nullable(t.Number())),

      days: t.Optional(v.isChallengeItemDays),

      dates: t.Optional(t.Array(t.Number())),
      weeks: t.Optional(t.Array(t.Number())),

      months: t.Optional(t.Array(t.String())),

      targetCount: t.Optional(t.Nullable(t.Number())),
      unit: t.Optional(t.Nullable(t.String())),
      accumulateType: t.Optional(t.Nullable(v.isChallengeItemIntervalType)),

      startAt: v.isDate,
      endAt: t.Optional(t.Nullable(v.isDate)),
    }),
  }
);
