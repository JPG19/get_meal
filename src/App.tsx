import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { MealList, Meal } from './components'
import './App.css'

export const UserContext = React.createContext({})

interface CategoryProps {
  strCategory: string
}

const App: React.FC = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    window.process = {
      ...window.process
    }
  }, [])

  useEffect(() => {
    const getAllMeals = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_GET_ALL_CATEGORIES as string
        )
        const allCategories = await response.json()

        setCategories(allCategories.meals)
      } catch (error) {
        if (typeof error === 'string') {
          setError(error)
        }
      }
    }
    getAllMeals()
  }, [])

  if (error) {
    ;<div>{error}</div>
  }

  return (
    <UserContext.Provider value={{ categories }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MealList />} />
          <Route path='/meal/:id' element={<Meal />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
