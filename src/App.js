import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

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
      const response = await axios.post("https://bajaj-backend-phi-two.vercel.app/bfhl", parsedJson);
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
  ];

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>API Interaction</h1>
      <textarea
        value={jsonInput}
        onChange={handleJsonInputChange}
        placeholder='Enter JSON here, e.g., { "data": ["A","C","z"] }'
        rows="6"
        cols="50"
      />
      <br />
      <button onClick={handleSubmit} style={{ margin: "10px" }}>
        Submit
      </button>
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
