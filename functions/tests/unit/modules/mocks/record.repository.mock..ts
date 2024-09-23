import { IRecordEntity } from "../../../../src/modules/records/interfaces/record.entity.interface";
import { IFirebaseRepository } from "../../../../src/modules/shared/repositories/interfaces/firebase-repository.interface";

// Mock do repositório Firebase
export const mockRecordRepository: jest.Mocked<
  IFirebaseRepository<IRecordEntity>
> = {
  find: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
