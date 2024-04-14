import React, { useState } from 'react';
import './App.css';
import pantry from './pantry';

const fetchCompletion = async (prompt, setResponse) => {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: prompt })
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  const lastMessage = data.choices[data.choices.length - 1].message.content;
  console.log(lastMessage);
  setResponse(lastMessage);
};




const createPrompt = (ingredients, modifier1, modifier2) => {
  return `Based on the following ingredients, generate a recipe for a ${modifier1} ${modifier2}, 
  format the recipe into a JSON-like list like {
    "ingredients": {
      "name": {"unit": "unit", "quantity": quantity},
      "name": {"unit": "unit", "quantity": quantity},
      ...
      
    },
    "recipe": {
      "title": "title",
      "instructions": [
        "step 1...",
        "step 2...",
        "step 3...",
        ...
      ]
    }
  }, ${JSON.stringify(ingredients)}.`;
};


const handleSubmit = async (event, setResponse) => {

  event.preventDefault();
  const modifier1 = document.getElementById('modifier1').value;  
  const modifier2 = document.getElementById('modifier2').value;  
  const prompt = createPrompt(pantry, modifier1, modifier2);  
  await fetchCompletion(prompt, setResponse);
};

function App() {
  const [response, setResponse] = useState('');  

  return (
    <div className="App">
  <header className="App-header">
  <h1>Welcome to Your Virtual Pantry</h1>
        <div className="pantry-list">
          <h2>Available Ingredients:</h2>
          <ul>
            {Object.keys(pantry).map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </div>
    <h1>What type of meal would you like to make?</h1>
    <form id="queryForm" onSubmit={(e) => handleSubmit(e, setResponse)}>
      
      <input type="text" id="modifier1" name="modifier1" placeholder="Lunch?" required />
      <input type="text" id="modifier2" name="modifier2" placeholder="Lunch?" required />
      
      <button type="submit">Submit</button>
    </form>

    <section className="responseSection">
      <h2>Recipe:</h2>
      <div className="responseArea">{response}</div>
    </section>
  </header>
</div>
  );
}

export default App;
