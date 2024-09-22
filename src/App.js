import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");

  const handleJsonInputChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON
      const parsedJson = JSON.parse(jsonInput);
      setError("");

      // Call the backend API
      const response = await axios.post("https://bajaj-finserv-backend-neon.vercel.app/bfhl", parsedJson);
      setResponseData(response.data);

      // Reset selected options
      setSelectedOptions([]);
    } catch (err) {
      setError("Invalid JSON or API Error");
    }
  };

  const handleDropdownChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    let filteredData = {};
    selectedOptions.forEach((option) => {
      if (option.value === "Alphabets") {
        filteredData.alphabets = responseData.alphabets;
      }
      if (option.value === "Numbers") {
        filteredData.numbers = responseData.numbers;
      }
      if (option.value === "Highest lowercase alphabet") {
        filteredData.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
      }
      if (option.value === "File Valid") {
        filteredData.file_valid = responseData.file_valid; // Added to capture file_valid
      }
    });

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredData, null, 2)}</pre>
      </div>
    );
  };

  const options = [
    { value: "Alphabets", label: "Alphabets" },
    { value: "Numbers", label: "Numbers" },
    { value: "Highest lowercase alphabet", label: "Highest lowercase alphabet" },
    { value: "File Valid", label: "File Valid" }, // Added new option
  ];

  return (
    <div className="App" style={{ padding: "50px 0", width: "80%", margin: "auto" }}>
      <h1>API Interaction</h1>
      <fieldset style={{ borderWidth: "1.2px", borderRadius: "5px" }}>
        <legend style={{ color: "gray", fontWeight: "600" }}>API Input</legend>
        <textarea
          value={jsonInput}
          onChange={handleJsonInputChange}
          placeholder='Enter JSON here, e.g., { "data": ["A","C","z"] }'
          rows="4"
          cols="100"
          style={{ width: "100%", outline: "none", border: "none" }}
        />
      </fieldset>
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {responseData && (
        <div>
          <label>Select data to display:</label>
          <Select
            isMulti
            options={options}
            onChange={handleDropdownChange}
            value={selectedOptions}
            placeholder="Choose options..."
          />
        </div>
      )}

      {renderResponse()}
    </div>
  );
}

export default App;
