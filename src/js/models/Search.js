import axios from "axios";
import { cors, apiKey} from '../config';



export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults(query) {

    try {
      const result = await axios(`${cors}http://food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
      this.result = result.data.recipes;
     // console.log(this.result);
    } catch (error) {
      alert("Something went wrong :(");
    }
  }
}
