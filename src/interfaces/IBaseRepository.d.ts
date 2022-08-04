import { Model } from 'sequelize-typescript';
import { WhereOptions } from 'sequelize/types';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { BulkCreateOptions } from 'sequelize';

export default interface IBaseRepository {
  // eslint-disable-next-line no-unused-vars
  findAll(query?: WhereOptions, attributes?: string[]): Promise<Model[] | null>;
  // eslint-disable-next-line no-unused-vars
  findById(id: number, attributes?: string[]): Promise<Model | null>;
  // eslint-disable-next-line no-unused-vars
  findOne(query: WhereOptions, attributes?: string[]): Promise<Model | null>;
  // eslint-disable-next-line no-unused-vars
  create(data: MakeNullishOptional): Promise<Model>;
  // eslint-disable-next-line no-unused-vars
  bulkCreate(data: MakeNullishOptional, options?: BulkCreateOptions): Promise<Model[]>;
  // eslint-disable-next-line no-unused-vars
  update(query: WhereOptions, data: Model): Promise<Model>;
  // eslint-disable-next-line no-unused-vars
  delete(query: WhereOptions, clearAllRecords?: boolean): Promise<boolean>;
}
