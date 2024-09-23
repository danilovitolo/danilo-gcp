import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import {
  IFirebaseQueryParams,
  IFirebaseRepository,
} from "../interfaces/firebase-repository.interface";

admin.initializeApp();

export class FirebaseRepository<T> implements IFirebaseRepository<T> {
  private collection: firestore.CollectionReference;
  private db = admin.firestore();

  constructor(collectionName: string) {
    this.collection = this.db.collection(collectionName);
  }

  find(queryParams: IFirebaseQueryParams<T>) {
    let query: firestore.Query = this.collection;

    let idFilter: string | undefined = undefined;

    if (queryParams.where) {
      const whereClauses = Array.isArray(queryParams.where)
        ? queryParams.where
        : [queryParams.where];

      whereClauses.forEach((clause) => {
        Object.entries(clause).forEach(([field, value]) => {
          if (field === "id") {
            idFilter = value as string;
          } else {
            query = query.where(field, "==", value);
          }
        });
      });
    }

    if (queryParams.orderBy) {
      query = query.orderBy(
        queryParams.orderBy.field as string,
        queryParams.orderBy.direction
      );
    }

    if (queryParams.limit) {
      query = query.limit(queryParams.limit);
    }

    return {
      getOne: async () => {
        if (idFilter) {
          const doc = await this.collection.doc(idFilter).get();
          if (!doc.exists) return undefined;
          return {
            ...doc.data(),
            id: doc.id,
          } as T;
        }

        const snapshot = await query.limit(1).get();
        if (snapshot.empty) return undefined;
        return snapshot.docs[0].data() as T;
      },
      getAll: async () => {
        const snapshot = await query.get();
        return snapshot.docs.map((doc) => doc.data() as T);
      },
    };
  }

  async create(entity: Partial<T>): Promise<T | unknown> {
    try {
      const docRef = await this.collection.add(entity);
      const docSnapshot = await docRef.get();
      return {
        ...docSnapshot.data(),
        id: docSnapshot.id,
      };
    } catch (error) {
      console.error("Erro ao criar o documento:", error);
      throw error;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T));
    } catch (error) {
      console.error("Erro ao buscar todos os documentos:", error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      await this.collection.doc(id).update(data);
    } catch (error) {
      console.error(`Erro ao atualizar o documento ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.doc(id).delete();
    } catch (error) {
      console.error(`Erro ao deletar o documento ${id}:`, error);
      throw error;
    }
  }
}
