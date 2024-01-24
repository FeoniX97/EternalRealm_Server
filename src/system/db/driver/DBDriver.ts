export interface DBDriver {
  collection(collection: string): DBDriver

  /** @returns the inserted document ID */
  insertOne(json: any): Promise<string>;

  updateOne(docID: string, json: any): Promise<void>;

  findOne(docID: string): Promise<any>
}
