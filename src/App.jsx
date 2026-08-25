import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { MainLayout } from './components/Layout'
import { Home } from './pages/home'
import { SearchResults } from './pages/SearchResults'
import { Movie } from './pages/Movie'
import { Wishlist } from './pages/Wishlist'
import {WishlistProvider} from './context/WishlistContext'
import { TVShowDetails } from './pages/TVShowDetails'
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
     

  <Route path="/tv/:id" element={<TVShowDetails />} /> {/* <-- Add TV Show Route */}



    </Routes>

    </WishlistProvider>

  
     );
   
}

export default App
