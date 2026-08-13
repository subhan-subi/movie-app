import { createContext, useContext, useEffect, useState } from "react";
export const WishlistContext = createContext();

export function WishlistProvider({children}){
const [wishlist,setWishlist] = useState([]);
  
useEffect(()=>{
  const savewishlist = localStorage.getItem("wishlist");
  if(savewishlist){
    setWishlist(JSON.parse(savewishlist));
  }
},[]);
 function addToWishlist(movie){
  const addedWishlist = wishlist.find((item)=> item.id === movie.id);
    if(addedWishlist){
        alert("Movie already in wishlist");
    } else {
        alert("Movie added to wishlist");
        const savdate = [...wishlist,movie];
        setWishlist(savdate);
        localStorage.setItem("wishlist",JSON.stringify(savdate));
    }
 }
 function removetowishlist(movie){
    const remove = wishlist.filter((item)=> item.id !== movie.id);
    if(remove){
        alert("Movie removed from wishlist");
    }
      
        setWishlist(remove);
        localStorage.setItem("wishlist",JSON.stringify(remove));
    
 }
return (
  <WishlistContext.Provider
    value={{
      wishlist,
      addToWishlist,
      removetowishlist
    }}
  >
    {children}
  </WishlistContext.Provider>
)
}