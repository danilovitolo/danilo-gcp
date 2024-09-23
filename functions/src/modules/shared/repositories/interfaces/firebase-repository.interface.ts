export type TReflectPartialEntityProperties<T> = Partial<{
  [key in keyof T]: T[key];
}>;

export type TAcceptedEntityproperties<T> = Partial<{
  [key in keyof T]: boolean;
}>;

export interface IFirebaseQueryParams<T> {
  select?: TAcceptedEntityproperties<T>;
  where?:
    | TReflectPartialEntityProperties<T>
    | TReflectPartialEntityProperties<T>[];
  orderBy?: { field: keyof T; direction?: "asc" | "desc" };
  limit?: number;
}

export interface IFirebaseRepository<T> {
  find(queryParams: IFirebaseQueryParams<T>): {
    getOne: () => Promise<T | undefined>;
    getAll: () => Promise<T[]>;
  };
  create(entity: Partial<T>): Promise<T | unknown>;
  findAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}
