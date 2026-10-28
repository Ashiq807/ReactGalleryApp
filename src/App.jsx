import { useEffect, useState, useReducer, useCallback, useMemo } from "react";
import "./App.css";
import Loader from "./Loader.jsx";
import { useFetchPhotos } from "./useFetchPhotos";

const favReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAV":
      if (!state.includes(action.payload)) {
        return [...state, action.payload];
      }
      return state;
    case "REMOVE_FAV":
      return state.filter((id) => id !== action.payload);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

function initFavs() {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
}

function App() {
  const [photos, loading, error] = useFetchPhotos(
    "https://picsum.photos/v2/list?limit=30",
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [favorites, dispatch] = useReducer(favReducer, [], initFavs);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const searchHandler = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos
      ? photos.filter((item) => {
          return item.author
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        })
      : [];
  }, [photos, searchTerm]);

  const toggleFav = (id) => {
    if (favorites.includes(id)) {
      dispatch({ type: "REMOVE_FAV", payload: id });
    } else {
      dispatch({ type: "ADD_FAV", payload: id });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error loading photos: {error.message}</p>;
  }

  return (
    <>
      <div className="my-1.5 p-1">
        <label>
          <h1>Search by author</h1>
          <input
            type="text"
            onChange={searchHandler}
            value={searchTerm}
            placeholder="Search by author"
            className="w-[50%] p-1 border-4 border-blue-500 my-1.5"
          />
        </label>
      </div>
      <div className="w-screen h-auto p-1 flex justify-center items-start flex-wrap gap-1">
        {filteredPhotos.map((item) => {
          const isFav = favorites.includes(item.id);

          return (
            <div
              key={item.id}
              className="w-full sm:w-[50%] md:w-[24%] p-1 bg-[#faf0e6] rounded-b-md"
            >
              <img
                src={item.download_url}
                alt={item.author}
                className="w-full h-[15rem] object-center object-cover"
              />

              <div className="flex justify-between items-center mt-1 p-1">
                <p className="p-0.5 font-semibold">{item.author}</p>

                {isFav ? (
                  <svg
                    onClick={() => toggleFav(item.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="w-7 h-7 cursor-pointer"
                  >
                    <path
                      fill="rgb(255, 0, 0)"
                      d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"
                    />
                  </svg>
                ) : (
                  <svg
                    onClick={() => toggleFav(item.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="w-7 h-7 cursor-pointer fill-gray-400 hover:fill-gray-600"
                  >
                    <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
