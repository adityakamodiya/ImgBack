import{MongoClient} from "mongodb"
const connection = MongoClient.connect("mongodb://127.0.0.1:27017")
export const dbName = "MulterData"
export default connection
// mongodb://127.0.0.1:27017
