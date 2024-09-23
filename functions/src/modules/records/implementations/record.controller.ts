import { IRecordController } from "../interfaces/record.controller.interface";
import { IRecordService } from "../interfaces/record.service.interface";
import { RecordInputDto } from "../dtos/record.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { IHttpRequest } from "../../http/interfaces/requests.interface";
import { IHttpResponse } from "../../http/interfaces/http-response.service.interface";
import { EStatusCodeType } from "../../http/enums/status-code.enum";

export class RecordController implements IRecordController {
  constructor(private readonly recordService: IRecordService) {}

  async create(request: IHttpRequest): Promise<IHttpResponse> {
    const recordInput = plainToInstance(RecordInputDto, request.body);

    const errors = await validate(recordInput);

    if (errors.length > 0) {
      throw new Error(
        JSON.stringify({
          message: "Validation failed",
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        })
      );
    }
    const reqData = request.body as RecordInputDto;

    const result = await this.recordService.createRecord(reqData);

    return {
      statusCode: EStatusCodeType.CREATED,
      body: result,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setNewId(snap: any): Promise<void> {
    await this.recordService.setNewId(snap.id);
  }

  async findAll(): Promise<IHttpResponse> {
    const data = await this.recordService.getAll();
    return {
      statusCode: EStatusCodeType.OK,
      body: data,
    };
  }
}
