import {SpeciesDAO} from "@/breeding-insight/dao/SpeciesDAO";
import {Species} from "@/breeding-insight/model/Species";

export class SpeciesService{

  static getAll(): Promise<Species[]> {
    return SpeciesDAO.getAll();
  }

}