import {User} from "@/breeding-insight/model/User";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";

export class UserService {

  static create(user: User): Promise<User> {
    //TODO: Check everything is good
    return new Promise<User>((resolve, reject) => {

      if (user.id === undefined) {
        UserDAO.create(user).then((biResponse) => {
          const result: any = biResponse.result;
          const newUser: User = new User(result.id, result.name, result.email);
          resolve(newUser);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static update(user: User): Promise<User> {
    //TODO: Check everything is good
    return new Promise<User>((resolve, reject) => {

      if (user.id) {
        UserDAO.update(user.id, user).then((biResponse) => {
          const result: any = biResponse.result;
          const newUser: User = new User(result.id, result.name, result.email);
          resolve(newUser);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }


    });
  }

  static delete(user: User): Promise<any> {

    return new Promise<any>(((resolve, reject) => {

      if (user.id){
        return UserDAO.delete(user.id)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }))
  }

  static getAll(): Promise<User[]> {
    return new Promise<User[]>(((resolve, reject) => {

      UserDAO.getAll().then((biResponse) => {

        // Parse our users into the vue users param
        const users = biResponse.result.data.map((user: any) => {
          return new User(user.id, user.name, user.email);
        });

        resolve(users);

      }).catch((error) => reject(error));

    }));
  }

}