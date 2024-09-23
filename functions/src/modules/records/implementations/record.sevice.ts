import { RecordInputDto } from "../dtos/record.dto";
import { IRecordService } from "../interfaces/record.service.interface";
import { IFirebaseRepository } from "../../shared/repositories/interfaces/firebase-repository.interface";
import { IRecordEntity } from "../interfaces/record.entity.interface";

export class RecordService implements IRecordService {
  constructor(
    private readonly recordRepository: IFirebaseRepository<IRecordEntity>
  ) {}

  async createRecord(data: RecordInputDto): Promise<IRecordEntity> {
    const result = await this.recordRepository.create({ name: data.name });
    return result as IRecordEntity;
  }

  async getAll(): Promise<IRecordEntity[]> {
    const result = await this.recordRepository.findAll();
    return result;
  }

  async setNewId(id: string): Promise<void> {
    const recordFinded = await this.recordRepository
      .find({
        where: { id: id },
      })
      .getOne();

    if (!recordFinded) {
      throw new Error(`Registro com ID ${id} não encontrado`);
    }

    const lastRecord = await this.recordRepository
      .find({
        limit: 1,
        orderBy: { field: "incremental_id", direction: "desc" },
      })
      .getOne();

    const newId = lastRecord?.incremental_id
      ? lastRecord.incremental_id + 1
      : 1;

    await this.recordRepository.update(recordFinded.id, {
      incremental_id: newId,
    });
  }
}
