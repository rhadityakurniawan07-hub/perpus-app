import { IsIn } from 'class-validator';

export const READING_STATUS_VALUES = ['WISHLIST', 'READING', 'FINISHED'] as const;
export type ReadingStatusValue = (typeof READING_STATUS_VALUES)[number];

export class SetReadingStatusDto {
  @IsIn(READING_STATUS_VALUES as unknown as string[])
  status: ReadingStatusValue;
}
