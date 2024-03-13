import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addList, getList, removeList } from "./redux/action/action";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const list = useSelector((state) => state.listReducer.list);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users`);
      dispatch(getList(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setInputValue("");

    try {
      const response = await axios.post(`http://localhost:3000/users`, {
        name: inputValue,
        id: (list.length + 1).toString(),
      });
      dispatch(addList(response.data));
      fetchData();
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      dispatch(removeList(id));
    } catch (error) {
      console.error("Error removing data:", error);
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setInputValue(name);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/users/${editingId}`, {
        name: inputValue,
      });
      fetchData();
      setEditingId(null);
      setInputValue("");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInputValue("");
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <div className="container">
      <h1>Todo List</h1>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Enter your list"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      {list.map((text) => (
        <div key={text.id} className="list-item">
          {editingId === text.id ? (
            <>
              <input
                type="text"
                value={inputValue}
                setInputValue={setInputValue}
                setEditingId={setEditingId}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <span>{text.name}</span>
              <button
                className="edit-button"
                onClick={() => handleEdit(text.id, text.name)}
              >
                Edit
              </button>
              <button
                className="remove-button"
                onClick={() => handleRemove(text.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
