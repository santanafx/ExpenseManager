import { Entity } from "../../common/entity.js";

export class Category extends Entity {
  constructor(
    id: string,
    private _name: string,
    private _description?: string,
    private _userId: string = "",
    private _created_at: Date = new Date(),
    private _updated_at?: Date
  ) {
    super()
    this.id = id
  }

  public get name(): string {
    return this._name
  }
  private set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Category name cannot be empty')
    }
    this._name = value
  }

  public get description(): string | undefined {
    return this._description
  }
  private set description(value: string | undefined) {
    this._description = value
  }

  public get userId(): string {
    return this._userId
  }
  private set userId(value: string) {
    this._userId = value
  }

  public get created_at(): Date {
    return this._created_at
  }
  private set created_at(value: Date) {
    this._created_at = value
  }

  public get updated_at(): Date | undefined {
    return this._updated_at
  }
  private set updated_at(value: Date) {
    this._updated_at = value
  }
}