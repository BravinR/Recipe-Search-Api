import React from 'react';
import style from './recipe.module.css';

const Recipe = ({title,calories, image, ingredients}) => {
    return(
        <div className= {style.recipe}>
            <h1>{title}</h1>
            <ol>
                {ingredients.map((ingredient, index) =>(
                    <div key = {index}>
                    <li>{ingredient.text}</li>
                    </div>
                ))}
            </ol>
            <p>Calories: {calories.toFixed()}</p>
            <img className= {style.image} src={image} alt="" />

        </div>
    );
};

export default Recipe;
