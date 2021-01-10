import admin, { ServiceAccount, firestore } from "firebase-admin";
import { injectable } from "inversify";
import serviceAccount from "../resources/gcp-service-account.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

const database: firestore.Firestore = admin.firestore();

@injectable()
export abstract class AbstractFirestoreProvider<
    CollectionId extends Collections,
    T extends firestore.DocumentData
> {

    protected get collection(): firestore.CollectionReference<T> {
        return database.collection(this.collectionId) as firestore.CollectionReference<T>; 
    }

    public constructor(
        private readonly collectionId: CollectionId
    ) {}

    protected cleanObjectForStorage(object: T): T {
        Object.keys(object).forEach(key => {
            if (object[key] === undefined) {
                delete object[key];
            }
        })

        return object;
    }

}

// Must be string-valued enums!
export enum Collections {
    Users = "users"
}
