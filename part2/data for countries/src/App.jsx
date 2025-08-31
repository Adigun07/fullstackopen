import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Countries = ({ countries, buttonClickHandler }) => {
  return countries.map((country) => (
    <div key={country.name.common}>
      {country.name.common}
      <button onClick={() => buttonClickHandler(country)}>Show</button>
    </div>
  ));
};

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    const getWeatherData = async () => {
      const request = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital[0]}&limit=1&appid=${import.meta.env.VITE_API_KEY}`,
      );
      const response = request.data;
      const { lat, lon } = response[0];
      const weatherRequest = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric`,
      );
      setWeatherData(weatherRequest.data);
    };
    getWeatherData();
  }, [country]);
  if (!weatherData) return <p>Loading weather...</p>;

  return (
    <>
      <h1>Weather in {country.capital[0]}</h1>
      <p>Temperature {weatherData.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt=""
      />
      <p>Wind {weatherData.wind.speed} m/s</p>
    </>
  );
};

const SingleCountry = ({ country }) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <div>Capital {country.capital[0]}</div>
      <div>Area {country.area}</div>

      <h2>Languages</h2>
      {Object.entries(country.languages).map(([code, language]) => (
        <li key={code}>{language}</li>
      ))}

      <img src={country.flags.png} alt={country.flags.alt} />
      <Weather country={country} />
    </>
  );
};

const App = () => {
  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
  const [filterText, setFilterText] = useState("");
  const [foundCountries, setFoundCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [isMuch, setIsMuch] = useState(false);
  const [shownCountry, setShownCountry] = useState(null);
  useEffect(() => {
    axios.get(`${baseUrl}`).then((request) => {
      const countries = request.data;
      setAllCountries(countries);
    });
  }, []);

  const handleFilter = (event) => {
    setFilterText(event.target.value);
    setShownCountry(null);
    const filtered = allCountries.filter((country) =>
      country.name.common
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase()),
    );

    if (filtered.length > 10) {
      setIsMuch(true);
      return;
    }
    setIsMuch(false);

    if (filtered.length === 1) {
      setShownCountry(filtered[0]);
    }
    setFoundCountries(filtered);
  };

  const handleClick = (country) => {
    setShownCountry(country);
  };

  if (allCountries.length === 0) return <p>Getting Countries...</p>;

  return (
    <>
      find countries <input value={filterText} onChange={handleFilter} />
      {isMuch && <div>Too many matches, specify another filter</div>}
      {foundCountries.length > 1 && !isMuch && (
        <Countries
          countries={foundCountries}
          buttonClickHandler={handleClick}
        />
      )}
      {shownCountry && <SingleCountry country={shownCountry} />}
    </>
  );
};

export default App;
