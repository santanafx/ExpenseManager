export class Entity<TProps> {
  public readonly id: string
  protected readonly props: TProps

  protected constructor(props: TProps, id: string) {
    this.id = id
    this.props = props
  }
}