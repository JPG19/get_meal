import React, { useRef, useState, useCallback } from "react";

import { Link } from "react-router-dom";

import useMealSearch from "../hooks/useMealSearch";

const MealList: React.FC = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState<string>("");

  const [category, setCategory] = useState(0);
  const { results, hasMore, isLoading, error } = useMealSearch(category);

  const selectRef = useRef<HTMLSelectElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const observer = useRef<any>();
  const lastMeal = useCallback(
    (node: any) => {
      if (isLoading) return;
      if (observer.current) {
        observer.current?.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCategory(category + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  const handleSearch = async () => {
    setIsSearching(true);
    // pick correct url
    let filterCategory = selectRef.current?.value;
    let filterValue = inputRef.current?.value;
    let url = process.env.REACT_APP_SEARCH_NAME as string;
    if (filterCategory === "ingredient") {
      url = process.env.REACT_APP_SEARCH_INGREDIENT as string;
    } else if (filterCategory === "category") {
      url = process.env.REACT_APP_SEARCH_CATEGORY as string;
    }
    // search
    try {
      const response = await fetch(url + filterValue);
      const data = await response.json();

      setSearchResults(data.meals);
      setIsSearching(false);
    } catch (error) {
      if (typeof error === "string") {
        setSearchError(error);
      }
      setIsSearching(false);
    }
  };

  if (isSearching) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only" />
        </div>
      </div>
    );
  }

  if (error || searchError) {
    return (
      <div className="alert alert-danger alert-dismissible fade show">
        <strong>Error!</strong> {error || searchError}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
        ></button>
      </div>
    );
  }

  const displayedMeals = searchResults?.length > 0 ? searchResults : results;

  return (
    <>
      <label htmlFor="filter">Choose an option to filter by:</label>

      <select
        name="filter"
        id="filter"
        ref={selectRef}
        className="form-select form-select-lg mb-3"
        aria-label=".form-select-lg example"
      >
        <option value="name">Name</option>
        <option value="ingredient">Ingredient</option>
        <option value="category">Category</option>
      </select>

      <div className="input-group justify-content-center mb-3">
        <input type="text" ref={inputRef} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {searchResults?.length > 0 ? (
        <div className="text-center">
          <button
            className="btn btn-secondary"
            onClick={() => setSearchResults([])}
          >
            Clear Search
          </button>
        </div>
      ) : null}

      <div
        className="d-flex justify-content-center align-items-center flex-wrap"
        style={{ margin: "100px 0 100px 0", gap: "20px" }}
      >
        {displayedMeals.map((item: any, index: number) => (
          <div
            ref={
              searchResults?.length === 0 && index === results?.length - 1
                ? lastMeal
                : null
            }
            key={item.idMeal}
            className="meal d-grid text-center"
          >
            <h5 style={{ maxWidth: "300px", margin: "auto", height: "55px" }}>
              {item.strMeal}
            </h5>

            <Link to={`/meal/${item.idMeal}`}>
              <img style={{ maxWidth: "400px" }} src={item.strMealThumb} />
            </Link>
          </div>
        ))}

        <div>
          {isLoading && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MealList;
