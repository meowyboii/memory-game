import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./components/Card";

function App() {
  const animeList = [
    "Detective Conan",
    "Naruto",
    "One Piece",
    "Death Note",
    "Attack on Titan",
    "Demon Slayer",
  ];

  const [randomList, setRandomList] = useState([]);
  const [counter, setCounter] = useState(0);

  const initializeRandomList = async () => {
    const newList = [];
    for (const anime of animeList) {
      const { id, poster } = await getAnimePoster(anime);
      newList.push({
        id: id,
        title: anime,
        poster: poster,
        clicked: false,
      });
    }
    console.log(newList);
    setRandomList(newList);
  };

  const randomizeList = (list) => {
    let shuffledArray = [...list];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]; // Swap elements
    }
    setRandomList(shuffledArray);
  };

  //Returns false if the card is not yet clicked and true otherwise
  const checkMemory = (index) => {
    if (randomList[index].clicked === false) {
      return false;
    }
    return true;
  };

  const storeMemory = (targetIndex) => {
    setRandomList((prevList) => {
      const updatedList = prevList.map((anime, index) =>
        index === targetIndex ? { ...anime, clicked: true } : anime
      );
      console.log(updatedList);
      return updatedList;
    });
  };

  const handleClick = (index) => {
    if (checkMemory(index) === false) {
      storeMemory(index);
      setCounter(counter + 1);
    } else {
      setCounter(0);
    }
    randomizeList(randomList);
    console.log("Score: ", counter);
  };

  const getAnimePoster = async (titleQuery) => {
    const fetchUrl = `https://kitsu.io/api/edge/anime?filter[text]=${titleQuery}`;
    try {
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const animeData = await response.json();
      if (animeData.data.length === 0) {
        throw new Error("No anime found for the given title.");
      }
      const id = animeData.data[0].id;
      const poster = animeData.data[0].attributes.posterImage.medium;

      return { id, poster };
    } catch (error) {
      console.log("Error", error);
      return null;
    }
  };

  useEffect(() => {
    initializeRandomList();
  }, []);

  return (
    <div className="cards">
      {randomList?.map((anime, index) => (
        <Card
          key={anime.id}
          title={anime.title}
          poster={anime.poster}
          handleClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}

export default App;
