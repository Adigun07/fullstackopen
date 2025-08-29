import { useState } from "react";

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  return props.good + props.bad + props.neutral === 0 ? (
    <p>No feedback given</p>
  ) : (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.good} />
        <StatisticLine text="neutral" value={props.neutral} />
        <StatisticLine text="bad" value={props.bad} />
        <StatisticLine
          text="all"
          value={props.good + props.neutral + props.bad}
        />
        <StatisticLine
          text="average"
          value={
            (props.good - props.bad) / (props.good + props.neutral + props.bad)
          }
        />
        <StatisticLine
          text="positive"
          value={
            (props.good / (props.good + props.neutral + props.bad)) * 100 + "%"
          }
        />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <h1>Give Feedback</h1>
      <Button
        text="good"
        onClick={() => {
          setGood(good + 1);
        }}
      />
      <Button
        text="neutral"
        onClick={() => {
          setNeutral(neutral + 1);
        }}
      />
      <Button
        text="bad"
        onClick={() => {
          setBad(bad + 1);
        }}
      />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
