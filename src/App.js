import React, {useEffect, useState} from "react";
import './App.css';
import Recipe from "./Recipe.js";
import env from "react-dotenv";

const App = () => {

  const APP_ID = env.APP_ID;
  const APP_KEY = env.APP_KEY;


  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('chicken');

  useEffect(() =>{
    getRecipes();
    // eslint-disable-next-line
  }, [query]);

  const getRecipes = async () => {
    const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`);
    const data = await response.json();
    setRecipes(data.hits);
  };
  const getSearch = e =>{
    e.preventDefault();
    setQuery(search);
    setSearch('');
  }
  const updateSearch = e =>{
    setSearch(e.target.value);
    console.log(search);
  }
  return(
    <div className= "App">
      <form onSubmit ={getSearch} className ="search-form">
        <input className= "search-bar" type = "text" value ={search} onChange ={updateSearch}/>
        <button className= "search-button" type = "submit">
          Search
        </button>
        
      </form>
      <div className="recipes">
        {recipes.map((recipe, index) => (
          <Recipe
              key= {index}
              title = {recipe.recipe.label} 
              calories = {recipe.recipe.calories}
              image ={ recipe.recipe.image}
              ingredients = {recipe.recipe.ingredients}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
