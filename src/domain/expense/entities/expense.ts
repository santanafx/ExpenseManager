import { Entity } from "../../common/entity.js"
import type { STATUS } from "../enums/status.js"

export class Expense extends Entity {
  constructor(
    id: string,
    private _description: string,
    private _amount: number,
    private _categoryId: string,
    private _date: Date,
    private _userId: string,
    private _status: STATUS,
    private _notes?: string,
    private _created_at: Date = new Date(),
    private _updated_at?: Date
  ) {
    super()
    this.id = id
  }

  public get description(): string {
    return this._description
  }
  private set description(value: string) {
    this._description = value
  }

  public get amount(): number {
    return this._amount
  }
  private set amount(value: number) {
    this._amount = value
  }

  public get categoryId(): string {
    return this._categoryId
  }
  public set categoryId(value: string) {
    this._categoryId = value
  }

  public get date(): Date {
    return this._date
  }
  private set date(value: Date) {
    this._date = value
  }

  public get userId(): string {
    return this._userId
  }
  private set userId(value: string) {
    this._userId = value
  }

  public get status(): STATUS {
    return this._status
  }
  private set status(value: STATUS) {
    this._status = value
  }

  public get notes(): string | undefined {
    return this._notes
  }
  private set notes(value: string) {
    this._notes = value
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