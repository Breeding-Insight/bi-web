import {RoleDAO} from "@/breeding-insight/dao/RoleDAO";
import {Role} from "@/breeding-insight/model/Role";

export class RoleService {

  static getAll(): Promise<Role[]> {
    return new Promise<Role[]>(((resolve, reject) => {

      RoleDAO.getAll().then((biResponse) => {

        const roles = biResponse.result.data.map((roles: any) => {
          return new Role(roles.id, roles.domain);
        });

        resolve(roles);

      }).catch((error) => reject(error));

    }));
  }

}