import {SpeciesDAO} from "@/model/dao/SpeciesDAO";
import {Species} from "@/model/Species";

export class SpeciesService{

  static getAll(): Promise<Species[]> {
    return SpeciesDAO.getAll();
  }

  static getOne(id: string): Promise<Species> {
    return SpeciesDAO.getOne(id);
  }
}