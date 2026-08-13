import { useEffect, useState } from "react";
import { fetchMovies } from "../Service/api";
import { MovieCard } from "../components/MovieCard";


export function Home(){

const [movies,setMovies] = useState([]);
const [loading,setLoading] = useState(false);


useEffect(()=>{

 async function getMovies(){

 setLoading(true);

 const data = await fetchMovies();

 setMovies(data || []);

 setLoading(false);

 }

 getMovies();

},[]);



return (

<div className="container py-5">


<h2 className="text-center fw-bold mb-4">
🔥 Popular Movies
</h2>


{
loading ?

<div className="text-center">
<div className="spinner-border text-warning"></div>
</div>


:

<div className="row">

{
movies.map(movie=>(

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