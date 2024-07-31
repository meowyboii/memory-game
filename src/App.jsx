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
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

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
    randomizeList(newList);
  };

  const resetList = () => {
    const resetList = randomList.map((anime) => ({ ...anime, clicked: false }));
    randomizeList(resetList);
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

  const handleClick = (targetIndex) => {
    if (randomList[targetIndex].clicked) {
      setBestScore(score);
      setScore(0);
      setBestScore(Math.max(bestScore, score));
      resetList();
    } else {
      setRandomList((prevList) => {
        const updatedList = prevList.map((anime, index) =>
          index === targetIndex ? { ...anime, clicked: true } : anime
        );
        setScore(score + 1);
        randomizeList(updatedList);
        console.log(updatedList);
        return updatedList;
      });
    }
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
      const poster = animeData.data[0].attributes.posterImage.small;

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
    <>
      <span>
        Best Score: {bestScore} Current Score: {score}
      </span>
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
    </>
  );
}

export default App;
