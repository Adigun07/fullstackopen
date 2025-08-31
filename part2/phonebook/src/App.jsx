import noteServices from "./services/notes";
import { useEffect, useState } from "react";
import "./index.css";

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with: <input value={value} onChange={onChange} />
    </div>
  );
};

const Notification = ({ message, isError }) => {
  if (message !== null) {
    return (
      <div className={isError ? "notification error" : "notification"}>
        {message}
      </div>
    );
  }
};

const PersonForm = ({ inputsInfo, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {inputsInfo.map((inputInfo) => {
        return (
          <div key={inputInfo.text}>
            {inputInfo.text}:{" "}
            <input value={inputInfo.value} onChange={inputInfo.onChange} />
          </div>
        );
      })}
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, deleteFunc }) => {
  return (
    <>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deleteFunc(person.id)}>delete</button>
        </div>
      ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterString, setFilterString] = useState("");
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    noteServices.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterInput = (event) => {
    setFilterString(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.some((person) => newName === person.name)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, do you want to replace the old number with the new one?`,
        )
      ) {
        const personToUpdate = structuredClone(
          persons.find((person) => newName === person.name),
        );
        personToUpdate.number = newNumber;
        noteServices
          .update(personToUpdate.id, personToUpdate)
          .then((updatedPerson) => {
            const updatePersons = persons.map((person) =>
              person.id === updatedPerson.id ? updatedPerson : person,
            );
            setPersons(updatePersons);
            setNewName("");
            setNewNumber("");
            setNotification(`${updatedPerson.name} was updated`);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          })
          .catch(() => {
            setNotification(
              `${personToUpdate.name} was already removed from the server`,
            );
            noteServices.getAll().then((persons) => {
              setPersons(persons);
            });
            setIsError(true);
            setTimeout(() => {
              setNotification(null);
              setIsError(false);
            }, 5000);
          });
      }
      return;
    }

    let id = persons.length + 1;
    while (persons.some((person) => parseInt(person.id) === id)) {
      id++;
    }

    const newPersonObj = {
      name: newName,
      number: newNumber,
      id: id + "",
    };

    noteServices.create(newPersonObj).then((newPerson) => {
      setPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
      setNotification(`${newPerson.name} was created`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToDelete?.name} ?`)) {
      noteServices
        .del(id)
        .then((deletedPerson) => {
          const updatedPersons = [];
          persons.map((person) => {
            if (person.id !== deletedPerson.id) {
              updatedPersons.push(person);
            }
          });
          setPersons(updatedPersons);
          setNotification(`${deletedPerson.name} has been  deleted`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch(() => {
          setNotification(
            `${personToDelete.name} was already removed from the server`,
          );
          setIsError(true);
          noteServices.getAll().then((persons) => {
            setPersons(persons);
          });
          setTimeout(() => {
            setNotification(null);
            setIsError(false);
          }, 5000);
        });
    }
  };

  const filteredPersons = [];
  persons.map((person) => {
    if (person.name.toLowerCase().includes(filterString.toLowerCase())) {
      filteredPersons.push(person);
    }
  });

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={isError} />
      <Filter value={filterString} onChange={handleFilterInput} />
      <h2>add new</h2>
      <PersonForm
        onSubmit={handleSubmit}
        inputsInfo={[
          { text: "name", value: newName, onChange: handleNameInput },
          { text: "number", value: newNumber, onChange: handleNumberInput },
        ]}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deleteFunc={handleDelete} />
    </div>
  );
};

export default App;
