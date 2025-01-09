import React, { useEffect, useState } from "react";

const App = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("/api/questions") // Automatiškai pridės proxy (http://localhost:5000/api/questions)
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question._id}>{question.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
