import { inject, injectable, optional } from "inversify";
import { User } from "../models/User";
import { AbstractFirestoreProvider, Collections } from "./AbstractFirestoreProvider";

@injectable()
export class UserService extends AbstractFirestoreProvider<Collections.Users, User> {


    public constructor(
        // unfortunately this is required for injectables
        // which extend abstract classes which take an arg
        @inject("_unused") @optional() _unused?: never
    ) {
        super(Collections.Users);
    }

    public async store(user: User): Promise<string> {
        const response = await this.collection.add(
            this.cleanObjectForStorage(user)
        );
        return response.id;
    }

    public async fetch(by: keyof User, value: User[typeof by]): Promise<User | undefined> {
        const result = await this.collection.where(by, "==", value).get();

        if (result.empty) {
            return undefined;
        } else {
            const [ document ] = result.docs;
            const user = document.data();
            return {
                id: document.id,
                email: user.email,
                name: user.name
            };
        }
    }

}
