import {SpeciesDAO} from "@/breeding-insight/dao/SpeciesDAO";
import {Species} from "@/breeding-insight/model/Species";

export class SpeciesService{

  static getAll(): Promise<Species[]> {
    return SpeciesDAO.getAll();
  }

  static getOne(id: string): Promise<Species> {
    return SpeciesDAO.getOne(id);
  }
}