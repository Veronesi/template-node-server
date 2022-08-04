/* eslint-disable max-classes-per-file */
import { Model, ModelCtor } from 'sequelize-typescript';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { Attributes, WhereOptions } from 'sequelize/types'; // BulkCreateOptions
import IBaseRepository from '../interfaces/IBaseRepository';
import { BaseError } from './baseError.core';

export class ResourceNotFoundError extends BaseError {
  constructor(public originalName: string = '', public stackTrace: string = '') {
    super(404, 'ResourceNotFoundError', 'Resource Not Found', 'The requested resource was not found or does not exist.', originalName, stackTrace);
  }
}

export default abstract class SequelizeBaseRepository<M extends Model> implements IBaseRepository {
  public model!: ModelCtor<M>;

  constructor(model: ModelCtor<M>) {
    this.model = model;
  }

  public async findAll(query?: WhereOptions<Attributes<M>>, attributes?: string[]): Promise<M[] | null> {
    const resource = await this.model.findAll({
      where: query,
      attributes,
    });
    if (resource) {
      return resource;
    }

    return null;
  }

  public async findById(id: number, attributes?: string[]): Promise<M | null> {
    const resource = await this.model.findByPk(id, {
      attributes,
    });

    if (resource) {
      return resource;
    }

    return null;
  }

  public async findOne(query: WhereOptions<Attributes<M>>, attributes?: string[]): Promise<M | null> {
    const resource = await this.model.findOne({
      where: query,
      attributes,
    });

    if (resource) {
      return resource;
    }

    return null;
  }

  public async create(data: MakeNullishOptional<M['_creationAttributes']>): Promise<M> {
    const resource = this.model.create<M>(data);
    if (!resource) {
      throw new ResourceNotFoundError();
    }
    return resource;
  }

  public async bulkCreate(
    data: readonly MakeNullishOptional<M['_creationAttributes']>[]
    // options?: BulkCreateOptions<Attributes<M>> | undefined
  ): Promise<M[]> {
    const resource = this.model.bulkCreate<M>(data);
    if (!resource) {
      throw new ResourceNotFoundError();
    }
    return resource;
  }

  public async update(query: WhereOptions<Attributes<M>>, data: any): Promise<M> {
    const resource = await this.findOne(query);

    if (resource) {
      return resource.update(data);
    }

    throw new ResourceNotFoundError();
  }

  public async delete(query: WhereOptions<Attributes<M>>, clearAllRecords?: boolean): Promise<boolean> {
    const resource = await this.findOne(query);
    if (clearAllRecords) {
      await this.model.destroy({ where: {} });
      return true;
    }
    if (resource) {
      await resource.destroy();
      return true;
    }
    return false;
  }
}
