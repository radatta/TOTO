"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import axios from "axios";

import { useToast } from "@/components/ui/use-toast";

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

  const { toast } = useToast();

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

  const fetchCardsForTopic = async (topic: string): Promise<Card[]> => {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: "44548486-67be1b5309113d170e47eeeb9",
        q: topic,
        image_type: "vector",
        min_width: 100,
        min_height: 100,
        per_page: 8,
      },
    });
    if (!response.data.totalHits) {
      toast({
        title: "Error",
        description: "No images found for the topic, please try another topic!",
        variant: "destructive",
      });
      return [];
    } else {
      const cards: Card[] = response.data.hits.map((hit: any) => ({
        id: hit.id,
        name: hit.tags,
        image: hit.webformatURL,
      }));
      return cards;
    }
  };

  const initializeGame = async (e): Promise<void> => {
    e.preventDefault();
    console.log("topic", topic);
    if (topic) {
      const cards = await fetchCardsForTopic(topic);
      const shuffledCards = shuffle(cards);
      console.log(shuffledCards);
      setBoardData(shuffledCards);
      setFlippedCards([]);
      setMatchedCards([]);
      setMoves(0);
      setGameOver(false);
    }
  };

  useEffect(() => {
    if (matchedCards.length === boardData.length && boardData.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, boardData]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <form onSubmit={(e) => initializeGame(e)} className="w-80 flex space-x-4">
        <input
          type="text"
          value={topic}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTopic(e.target.value)
          }
          placeholder="Enter a topic"
          className="border border-gray-300 text-black p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Start Game
        </button>
      </form>
      <div className="grid grid-cols-4 gap-4">
        {boardData.map((card, index) => (
          <div
            key={card.id}
            className={`w-24 h-24 max-w-24 max-h-24 flex items-center justify-center text-black border border-gray-300 rounded cursor-pointer ${
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
      {/* <div>Moves: {moves}</div> */}

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
