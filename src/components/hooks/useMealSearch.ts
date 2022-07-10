import React, { useState, useEffect, useContext } from "react";

import { UserContext } from "../../App";

interface MealProps {
  [key: string]: string;
}

const useMealSearch = (category: number) => {
  const { categories } = useContext<any>(UserContext);
  const [currentCategory, setCurrentCategory] = useState<number>();
  const [results, setResults] = useState<MealProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadMore = async () => {
      if (categories.length > 0 && category !== currentCategory) {
        setIsLoading(true);
        setCurrentCategory(category);
        try {
          const response1 = await fetch(
            process.env.REACT_APP_SEARCH_CATEGORY +
              categories[category]?.strCategory
          );
          const data = await response1.json();
          if (data.meals) {
            setResults([...results, ...data.meals]);
            setIsLoading(false);
            setHasMore(categories[category + 1]?.strCategory);
          }
        } catch (error) {
          setIsLoading(false);
          setError("Error");
        }
      }
    };

    loadMore();
  }, [category, categories]);

  return { results, hasMore, isLoading, error };
};

export default useMealSearch;
