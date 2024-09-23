import * as functions from "firebase-functions";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { IHttpResponse } from "../interfaces/http-response.service.interface";
import { EStatusCodeType } from "../enums/status-code.enum";

export class BaseHandlerService {
  httpHandler<T>(controller: T, method: keyof T) {
    return functions.https.onRequest(async (req, res) => {
      try {
        const result: IHttpResponse = await (
          controller[method] as (
            req: functions.Request
          ) => Promise<IHttpResponse>
        ).call(controller, req);
        res.status(result.statusCode).json(result.body);
      } catch (error) {
        res
          .status(EStatusCodeType.INTERNAL_SERVER_ERROR)
          .send({ error: (error as Error).message });
      }
    });
  }

  firestoreHandler<T>(trigger: T, method: keyof T) {
    return async (snap: DocumentSnapshot, context: functions.EventContext) => {
      try {
        await (
          trigger[method] as (
            snap: DocumentSnapshot,
            context: functions.EventContext
          ) => Promise<void>
        ).call(trigger, snap, context);
      } catch (error) {
        console.error("Error processing Firestore event", error);
      }
    };
  }
}
