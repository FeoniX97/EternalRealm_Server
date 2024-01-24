import { Db, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { DBDriver } from "./DBDriver";

export default abstract class MongoDBDriver implements DBDriver {
  private readonly db: Db;

  private collectionStr: string;

  constructor(uri: string, db: string) {
    this.db = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    }).db(db);
  }

  collection(collection: string): DBDriver {
    this.collectionStr = collection;

    return this;
  }

  async insertOne(json: any): Promise<string> {
    let result = await this.db.collection(this.collectionStr).insertOne(json);

    return result.insertedId.toString();
  }

  async updateOne(docID: string, json: any): Promise<void> {
    await this.db
      .collection(this.collectionStr)
      .updateOne({ _id: new ObjectId(docID) }, { $set: json });
  }
}
