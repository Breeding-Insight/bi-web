import {Species} from "@/breeding-insight/model/Species";

export class SpeciesDAO {

  static getAll(): Promise<Species[]> {

    return new Promise<Species[]>((resolve, reject) => {

      // Get programs
      const programs: Species[] = [
        new Species('1', 'Grape'),
        new Species('2', 'Sweet Potato'),
        new Species('3', 'Blueberry')
      ];

      resolve(programs);

      if (programs.length < 0){
        reject();
      }
    });
  }

}