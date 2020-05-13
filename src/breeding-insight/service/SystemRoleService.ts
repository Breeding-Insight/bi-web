import {Role} from "@/breeding-insight/model/Role";
import {SystemRoleDao} from "@/breeding-insight/dao/SystemRoleDao";

export class SystemRoleService {

  static errorGetRoles = "Unable to load system roles";

  static getAll(): Promise<Role[]> {
    return new Promise<Role[]>(((resolve, reject) => {

      SystemRoleDao.getAll().then((biResponse) => {

        const roles = biResponse.result.data.map((roles: any) => {
          return new Role(roles.id, roles.domain);
        });

        resolve(roles);

      }).catch((error) => {
        error['errorMessage'] = this.errorGetRoles;
        reject(error);
      });

    }));
  }

}