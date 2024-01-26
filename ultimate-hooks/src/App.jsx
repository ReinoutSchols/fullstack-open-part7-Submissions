import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  const getAll = async () => {
    const response = await axios.get(baseUrl);
    setResources(response.data);
  };

  const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject);
    setResources((prevResources) => [...prevResources, response.data]);
    return response.data;
  };

  const service = {
    getAll,
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  useEffect(() => {
    noteService.getAll();
    personService.getAll();
  }, []);

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    await noteService.create({ content: content.value });
    content.onChange({ target: { value: "" } });
  };

  const handlePersonSubmit = async (event) => {
    event.preventDefault();
    await personService.create({ name: name.value, number: number.value });
    name.onChange({ target: { value: "" } });
    number.onChange({ target: { value: "" } });
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
