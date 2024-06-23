"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Card {
  id: number;
  name: string;
  image: string;
}

interface BoardCard extends Card {
  flipped: boolean;
  content: string;
}

export default function Comp1() {
  const [topic, setTopic] = useState<string>("");
  const [boardData, setBoardData] = useState<BoardCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [fetchedCards, setFetchedCards] = useState<boolean>(false);

  const shuffle = (cards: Card[]): BoardCard[] => {
    return [...cards, ...cards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        content: card.name,
        flipped: false,
      }));
  };

  const flipCard = (index: number): void => {
    if (flippedCards.length === 2 || matchedCards.includes(index)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    setMoves(moves + 1);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (boardData[firstIndex].content === boardData[secondIndex].content) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const fetchCardsForTopic = async (): Promise<Card[]> => {
    // For this example, we'll use Pokemon API regardless of the topic
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=6`);
    const data = await response.json();
    const pokemonCards: Card[] = await Promise.all(
      data.results.map(async (pokemon: { url: string }) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.front_default,
        };
      })
    );
    return pokemonCards;
  };

  const initializeGame = async (): Promise<void> => {
    setFetchedCards(false);
    const cards = await fetchCardsForTopic();
    const shuffledCards = shuffle(cards);
    console.log(shuffledCards);
    setBoardData(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameOver(false);
    setFetchedCards(true);
  };

  //   useEffect(() => {
  //     initializeGame();
  //   }, [initializeGame]);

  useEffect(() => {
    if (matchedCards.length === boardData.length && boardData.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, boardData]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* <div className="w-80 flex space-x-4"> */}
      {/* <input
          type="text"
          value={topic}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTopic(e.target.value)
          }
          placeholder="Enter a topic"
          className="border border-gray-300 p-2 rounded"
        /> */}
      <button
        onClick={initializeGame}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Start Game
      </button>
      {/* </div> */}
      {fetchedCards && (
        <div className="grid grid-cols-3 gap-4">
          {boardData.map((card, index) => (
            <div
              key={card.id}
              className={`card w-24 h-24 flex text-black items-center justify-center border border-gray-300 rounded cursor-pointer ${
                flippedCards.includes(index) || matchedCards.includes(index)
                  ? "bg-white"
                  : "bg-gray-200"
              }`}
              onClick={() => flipCard(index)}
            >
              {flippedCards.includes(index) || matchedCards.includes(index) ? (
                <Image
                  src={card.image}
                  alt={card.content}
                  width={100}
                  height={100}
                />
              ) : (
                "?"
              )}
            </div>
          ))}
        </div>
      )}
      <div>Moves: {moves}</div>

      {gameOver && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Game Over! You won in {moves} moves.
          </h2>
          <button
            onClick={initializeGame}
            className="mt-4 bg-green-500 text-white p-2 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
