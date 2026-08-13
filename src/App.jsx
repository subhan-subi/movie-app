import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { MainLayout } from './components/Layout'
import { Home } from './pages/home'
import { SearchResults } from './pages/SearchResults'
import { Movie } from './pages/Movie'
import { Wishlist } from './pages/Wishlist'
import {WishlistProvider} from './context/WishlistContext'
function App() {
   
     return(
      <WishlistProvider>
        <Routes>

      <Route element={<MainLayout />}>

        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/movie/:id" 
          element={<Movie />} 
        />
        <Route 
           path="/search/:query"  
          element={<SearchResults />} 
        />
        <Route path="/wishlist" element={<Wishlist />} />
      </Route>
     


    </Routes>
    </WishlistProvider>

  
     );
   
}

export default App
