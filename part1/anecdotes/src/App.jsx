import { useState } from "react";

const Anecdote = (props) => {
  return (
    <>
      <div>{props.anecdote}</div>
      <div>has {props.votes} votes</div>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [viewed, setViewed] = useState(
    Array(anecdotes.length).fill(false).fill(true, 0, 1),
  );

  const selectNextAnecdote = () => {
    const temp = structuredClone(viewed);
    if (temp.every((x) => x === true)) {
      console.log();
      temp.fill(false);
    }

    let randomId = Math.floor(Math.random() * anecdotes.length);
    while (temp[randomId] === true || selected === randomId) {
      randomId = Math.floor(Math.random() * anecdotes.length);
    }
    temp[randomId] = true;
    setViewed(temp);
    setSelected(randomId);
    console.log(viewedAnecdotes);
  };

  const voteForAnecdote = () => {
    const temp = structuredClone(votes);
    temp[selected] = temp[selected] + 1;
    setVotes(temp);
  };
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0);
  const maxIndex = votes.indexOf(Math.max(...votes));

  return (
    <>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <button onClick={voteForAnecdote}>vote</button>
      <button onClick={selectNextAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <Anecdote anecdote={anecdotes[maxIndex]} votes={votes[maxIndex]} />
    </>
  );
};

export default App;
