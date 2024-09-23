import { RecordInputDto } from "../../../../src/modules/records/dtos/record.dto";
import { RecordService } from "../../../../src/modules/records/implementations/record.sevice";
import { IRecordEntity } from "../../../../src/modules/records/interfaces/record.entity.interface";
import { setupFirebaseTestEnv } from "../../../mocks/firebase.setup.mock";
import { mockRecordRepository } from "../mocks/record.repository.mock.";

describe("RecordService", () => {
  let recordService: RecordService;

  setupFirebaseTestEnv();

  beforeEach(() => {
    recordService = new RecordService(mockRecordRepository);
  });

  it("should create a new record", async () => {
    const mockRecord = { id: "1", name: "Test Record", incremental_id: 1 };
    mockRecordRepository.create.mockResolvedValue(mockRecord);

    const result = await recordService.createRecord({
      name: "Test Record",
    } as RecordInputDto);

    expect(result).toEqual(mockRecord);
    expect(mockRecordRepository.create).toHaveBeenCalledWith({
      name: "Test Record",
    });
  });

  it("should get all records", async () => {
    const mockRecords = [
      { id: "1", name: "Test1", incremental_id: 1 },
      { id: "2", name: "Test2", incremental_id: 2 },
    ];
    mockRecordRepository.findAll.mockResolvedValue(mockRecords);

    const result = await recordService.getAll();

    expect(result).toEqual(mockRecords);
    expect(mockRecordRepository.findAll).toHaveBeenCalled();
  });

  it("should set a new incremental id", async () => {
    const recordFinded = { id: "1", name: "Test Record", incremental_id: 1 };
    const lastRecord = { id: "2", name: "Last Record", incremental_id: 2 };

    mockRecordRepository.find.mockImplementationOnce(({ where }) => ({
      getOne: () =>
        Promise.resolve(
          !Array.isArray(where) && where?.id === "1" ? recordFinded : undefined
        ),
      getAll: () => Promise.resolve([]),
    }));

    mockRecordRepository.find.mockImplementationOnce(() => ({
      getOne: () => Promise.resolve(lastRecord),
      getAll: () => Promise.resolve([]),
    }));

    await recordService.setNewId("1");

    expect(mockRecordRepository.update).toHaveBeenCalledWith("1", {
      incremental_id: 3,
    });
  });

  it("should set incremental id to 1 if no last record is found", async () => {
    const recordFinded = { id: "1", name: "Test Record", incremental_id: 1 };

    mockRecordRepository.find.mockImplementationOnce(({ where }) => ({
      getOne: () =>
        Promise.resolve(
          !Array.isArray(where) && where?.id === "1" ? recordFinded : undefined
        ),
      getAll: () => Promise.resolve([]),
    }));

    mockRecordRepository.find.mockImplementationOnce(() => ({
      getOne: () => Promise.resolve(undefined),
      getAll: () => Promise.resolve([]),
    }));

    await recordService.setNewId("1");

    expect(mockRecordRepository.update).toHaveBeenCalledWith("1", {
      incremental_id: 1,
    });
  });

  it("should throw error if record not found", async () => {
    mockRecordRepository.find.mockReturnValue({
      getOne: () => Promise.resolve(undefined),
      getAll: function (): Promise<IRecordEntity[]> {
        throw new Error("Function not implemented.");
      },
    });

    await expect(recordService.setNewId("1")).rejects.toThrow(
      "Registro com ID 1 não encontrado"
    );
  });
});
