import { RecordEntity } from "../../modules/records/entities/record.entity";
import { RecordService } from "../../modules/records/implementations/record.sevice";
import { FirebaseRepository } from "../../modules/shared/repositories/implementations/firebase-repository";

const firebaseRepository = new FirebaseRepository<RecordEntity>("records");

export const recordService = new RecordService(firebaseRepository);

export default {
  recordService,
};
