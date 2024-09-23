import { RecordInputDto } from "../dtos/record.dto";
import { IRecordEntity } from "./record.entity.interface";

export interface IRecordService {
  createRecord(data: RecordInputDto): Promise<IRecordEntity>;
  getAll(): Promise<IRecordEntity[]>;
  setNewId(id: string): Promise<void>;
}
