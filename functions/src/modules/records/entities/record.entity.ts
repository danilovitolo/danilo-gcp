import { IRecordEntity } from "../interfaces/record.entity.interface";

export class RecordEntity implements IRecordEntity {
  public id!: string;

  public incremental_id!: number;

  public name!: string;
}
