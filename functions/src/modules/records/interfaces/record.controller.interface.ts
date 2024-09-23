import { IHttpResponse } from "../../http/interfaces/http-response.service.interface";
import { IHttpRequest } from "../../http/interfaces/requests.interface";

export interface IRecordController {
  create(request: IHttpRequest): Promise<IHttpResponse>;
  setNewId(id: string): Promise<void>;
  findAll(request: IHttpRequest): Promise<IHttpResponse>;
}
