import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import Loader from "./components/Loader/Loader";
import MovieModal from "./components/MovieModal/MovieModal";
import { fetchMovies } from "./services/movieService";
import type { Movie } from "./types/movie";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setIsError(false);
      setIsloading(true);
      setMovies([]);

      try {
        const results = await fetchMovies(query);

        if (results.length === 0) {
          toast.error("No movies found for your request.");
          return;
        }

        setMovies(results);
      } catch {
        setIsError(true);
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, [query]);

  const handleSearch = async (value: string) => {
    setQuery(value);
  };

  const handleSelectMovie = async (movie: Movie): Promise<void> => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {query.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      <Toaster position="top-center" />
    </>
  );
}
