import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const GET_MEAL_BY_ID = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

interface MealProps {
  [key: string]: string;
}

const Meal: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mealDisplayed, setMealDisplayed] = useState<MealProps>({});

  useEffect(() => {
    const getMealById = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(GET_MEAL_BY_ID + params.id);
        const meals = await response.json();
        setMealDisplayed(meals.meals[0]);
        setIsLoading(false);
      } catch (error) {
        if (typeof error === "string") {
          setErrorMessage(error);
        }
        setIsLoading(false);
      }
    };

    if (Object.keys(mealDisplayed).length === 0) {
      getMealById();
    }
  }, []);

  const ingredientKeys = Object.keys(mealDisplayed).filter(
    (key) => key.includes("strIngredient") && mealDisplayed[key] !== ""
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only" />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    <div className="alert alert-danger alert-dismissible fade show">
      <strong>Error!</strong> {errorMessage}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
      ></button>
    </div>;
  }

  return (
    <div style={{ width: "90%", margin: "50px auto 20px auto" }}>
      <Link to="/">Back to list</Link>
      <h1 className="name text-center">{mealDisplayed.strMeal}</h1>
      <div className="area text-center">({mealDisplayed.strArea})</div>
      <div className="category text-center">{mealDisplayed.strCategory}</div>

      <h4 className="text-center">Ingredients</h4>
      <div className="ingredients d-flex justify-content-center align-items-center flex-wrap">
        {ingredientKeys.map((key) => (
          <div key={mealDisplayed[key]} className="m-2">
            {mealDisplayed[key]}
          </div>
        ))}
      </div>

      <h4 className="text-center">Instructions</h4>
      <div className="instructions">{mealDisplayed.strInstructions}</div>

      <div className="img text-center m-5">
        <img style={{ maxWidth: "100%" }} src={mealDisplayed.strMealThumb} />
      </div>
    </div>
  );
};

export default Meal;
