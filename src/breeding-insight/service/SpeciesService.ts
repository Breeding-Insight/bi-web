import {SpeciesDAO} from "@/breeding-insight/dao/SpeciesDAO";
import {Species} from "@/breeding-insight/model/Species";

export class SpeciesService{

  static getAll(): Promise<Species[]> {
    return new Promise<Species[]>(((resolve, reject) => {

      SpeciesDAO.getAll().then((biResponse) => {

        // Parse our users into the vue users param
        const species = biResponse.result.data.map((species: any) => {
          return new Species(species.id, species.commonName);
        });

        resolve(species);

      }).catch((error) => reject(error));

    }));
  }

}