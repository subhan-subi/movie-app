import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { MovieCard } from "../components/MovieCard";
import { searchMovies } from "../Service/api";
import { getSimilarMovies } from "../Service/api";

export function SearchResults() {

  const { query } = useParams();

  const [movies, setMovies] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    async function getSearchMovies(){

      setLoading(true);

      const results = await searchMovies(query);

      setMovies(results || []);

      setLoading(false);

    }


    getSearchMovies();


  }, [query]);

 



  if(loading){

    return (
      <div className="text-center py-5">

        <div className="spinner-border text-warning"></div>

      </div>
    )

  }




  return (

    <div className="container py-5">


      <h2 className="mb-4">
        Search Result For: {query}
      </h2>



      {
        movies.length === 0 ?

        <div className="text-center py-5">

          <h4>
            😔 No movies found
          </h4>

        </div>


        :


        <div className="row">

          {
            movies.map((movie)=>(

              <MovieCard
                key={movie.id}
                movie={movie}
             
              />

            ))
          }

        </div>

      }


    </div>

  )

}