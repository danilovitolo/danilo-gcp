import * as functions from "firebase-functions";
import { recordService } from "../../infrastructure/container/services.container";
import { BaseHandlerService } from "../../modules/http/implementations/base-handler.service";
import { RecordController } from "../../modules/records/implementations/record.controller";

const handler = new BaseHandlerService();

const recordController = new RecordController(recordService);

export const createRecord = handler.httpHandler(recordController, "create");

export const findAllRecords = handler.httpHandler(recordController, "findAll");

const setNewIdFunction = handler.firestoreHandler(recordController, "setNewId");

export const setNewId = functions.firestore
  .document("records/{docId}")
  .onCreate((snap, context) => {
    return setNewIdFunction(snap, context);
  });
