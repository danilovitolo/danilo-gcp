import { EStatusCodeType } from "../../../../src/modules/http/enums/status-code.enum";
import { RecordInputDto } from "../../../../src/modules/records/dtos/record.dto";
import { RecordController } from "../../../../src/modules/records/implementations/record.controller";
import { IRecordService } from "../../../../src/modules/records/interfaces/record.service.interface";

describe("RecordController", () => {
  let recordController: RecordController;
  let mockRecordService: Partial<IRecordService>;

  beforeEach(() => {
    mockRecordService = {
      createRecord: jest.fn(),
      getAll: jest.fn(),
      setNewId: jest.fn(),
    };

    recordController = new RecordController(
      mockRecordService as IRecordService
    );
  });

  it("should create a record", async () => {
    const recordInput: RecordInputDto = { name: "Test Record" };
    const req = { body: recordInput };
    const createdRecord = { id: "1", name: "Test Record", incremental_id: 1 };

    if (mockRecordService.createRecord) {
      (mockRecordService.createRecord as jest.Mock).mockResolvedValue(
        createdRecord
      );
    }

    const result = await recordController.create(req);

    expect(result).toEqual({
      statusCode: EStatusCodeType.CREATED,
      body: createdRecord,
    });
    expect(mockRecordService.createRecord).toHaveBeenCalledWith(recordInput);
  });

  it("should throw validation error", async () => {
    const req = { body: {} };

    try {
      await recordController.create(req);
    } catch (error) {
      const parsedError = JSON.parse((error as Error).message);

      expect(parsedError).toEqual(
        expect.objectContaining({
          message: "Validation failed",
          errors: expect.any(Array),
        })
      );

      expect(parsedError.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            property: "name",
            constraints: {
              isString: expect.any(String),
              isNotEmpty: expect.any(String),
            },
          }),
        ])
      );
    }
  });

  it("should set a new id", async () => {
    const snap = { id: "1" };

    await recordController.setNewId(snap);

    expect(mockRecordService.setNewId).toHaveBeenCalledWith(snap.id);
  });

  it("should find all records", async () => {
    const records = [
      { id: "1", name: "Test Record 1", incremental_id: 1 },
      { id: "2", name: "Test Record 2", incremental_id: 2 },
    ];

    if (mockRecordService.getAll) {
      (mockRecordService.getAll as jest.Mock).mockResolvedValue(records);
    }

    const result = await recordController.findAll();

    expect(result).toEqual({
      statusCode: EStatusCodeType.OK,
      body: records,
    });
    expect(mockRecordService.getAll).toHaveBeenCalled();
  });
});
