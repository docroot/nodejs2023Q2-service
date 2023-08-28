export class BigintTransformer {
  public to(data: number): bigint {
    return BigInt(data);
  }

  public from(data: bigint): number {
    const res: number = Number(data);
    return res;
  }
}
