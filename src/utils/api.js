import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

// const TMDB_TOKEN ="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MmY3MTg0OWFhMzZiZWI0NTBlNDE5OWIxZmUzY2MwZiIsInN1YiI6IjY2MTE5MDQ1MTEwOGE4MDE0YThiZmQyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.90JIKJnm1AYYIn4AX2dc7qvLCkOx2nUDtIcyvDnWtQY";


const headers = {
  Authorization: "bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi=async(url,params)=>{
    try{
        const {data}=await axios.get(BASE_URL + url,{
            headers,
            params
        })
        return data;
    }
    catch (err){
        console.log(err);
        return err;
    }
};