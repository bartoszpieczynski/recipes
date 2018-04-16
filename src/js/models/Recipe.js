import axios from "axios";
import { cors, apiKey} from '../config';

export default class Recipe {
   constructor(id) {
      this.id = id;
   }

   async getRecipe() {
      try {
         const result = await axios(`${cors}http://food2fork.com/api/get?key=${apiKey}&rId=${this.id}`);
         this.title = result.data.recipe.title;
         this.author = result.data.recipe.publisher;
         this.img = result.data.recipe.image_url;
         this.url = result.data.recipe.source_url;
         this.ingredients = result.data.recipe.ingredients;
         // console.log(result);
      } catch (error) {
         console.log(error);
         alert('Something went wrong.');
      }
   }

   calcTime() {
         const numIng = this.ingredients.length;
         const periods = Math.ceil(numIng / 3);
         this.time = periods * 15;
   }

   calcServings() {
      this.servings = 4;
   }

   parseIngredients() {
      const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
      const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
      const units = [...unitsShort, 'kg', 'g'];

      const newIngredients = this.ingredients.map(el => {
         // 1) Same units
         let ingredient = el.toLowerCase();
         unitsLong.forEach((unit, i) => {
            ingredient = ingredient.replace(unit, unitsShort[i]);
         });

         //Remove parentheses
         ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

         const arrIng = ingredient.split(' ');
         const unitIndex = arrIng.findIndex(el2 => units.includes(el2));


         let objIng;
         if (unitIndex > -1) {
            //There is a unit
            const arrCount = arrIng.slice(0, unitIndex);

            let count;
            if(arrCount.length === 1) {
               count = eval(arrIng[0].replace('-', '+'));
            } else {
               count = eval(arrIng.slice(0, unitIndex).join('+')); //eval of 4 + 1/2 is 4.5
            }

            objIng = {
               count,
               unit: arrIng[unitIndex],
               ingredient: arrIng.slice(unitIndex + 1).join(' ')
            }

         } else if(parseInt(arrIng[0], 10)) {
            //There is no unit but first el is a number
            objIng = {
               count: parseInt(arrIng[0], 10),
               unit: '',
               ingredient: arrIng.slice(1).join(' ')
            }
         } else if (unitIndex === -1) {
            //There is no unit and no number in first positon
            objIng = {
               count: 1,
               unit: '',
               ingredient
            }
         }

         return objIng;

      });
      this.ingredients = newIngredients;
   }

   updateServings(type) {
      //UPDATE SERVINGS
      const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


      //UPDATE INGREDIENTS
      this.ingredients.forEach(el => {
            el.count *= (newServings / this.servings);
      });


      this.servings = newServings;

   }

}