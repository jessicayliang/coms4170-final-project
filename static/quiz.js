document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let currentQuestionNumber = 1;
    let quizData = {};
  
    function initializeQuiz() {
      loadQuestion(currentQuestionNumber);
    }
  
    function loadQuestion(currentQuestionNumber) {
      const questionData = quizData[currentQuestionNumber]; // Correctly access the quiz data
      if (!questionData) {
          console.error('No data available for question number:', currentQuestionNumber);
          return;
      }
  
      document.querySelector('.question').textContent = questionData.question;
      const foodImage = document.querySelector('.food-pairing img');
      foodImage.src = questionData.food_pairing.image_url;
      foodImage.alt = questionData.food_pairing.description;
  
      // Update wine choices
      const wineChoicesContainer = document.querySelector('.wine-choices');
      wineChoicesContainer.innerHTML = '';
      questionData.wine_choices.forEach(choice => {
          const wineChoiceElement = document.createElement('div');
          wineChoiceElement.classList.add('wine-choice');
          wineChoiceElement.draggable = true;
          wineChoiceElement.id = choice.wine;
  
          const image = document.createElement('img');
          image.src = choice.image_url;
          image.alt = choice.wine;
  
          const label = document.createElement('p');
          label.textContent = choice.wine;
  
          wineChoiceElement.appendChild(image);
          wineChoiceElement.appendChild(label);
          wineChoicesContainer.appendChild(wineChoiceElement);
      });
    }
  
    function allowDrop(event) {
      event.preventDefault();
    }
  
    function drag(event) {
      console.log("Dragging: ", event.target.id);
      // Set the image URL as the data to transfer
      ev.dataTransfer.setData("text/plain", event.target.id); // Assuming ev.target is the img element
    }
    
    function drop(event) {
      event.preventDefault();
      const draggedWineId = event.dataTransfer.getData("text/plain");
      const dropZone = document.querySelector('.drop-area');
      dropZone.style.backgroundColor = 'red';
  
      // Make sure to convert numbers to strings if your keys are strings
      const questionKey = String(currentQuestionNumber);
      if (!quizData[questionKey]) {
          console.error('No data available for question number:', questionKey);
          return;
      }
  
      // Check if the dropped wine is a valid choice
      if (quizData[questionKey].wine_choices.some(wine => wine.wine === draggedWineId)) {
          const wine = quizData[questionKey].wine_choices.find(wine => wine.wine === draggedWineId);
          dropZone.style.backgroundImage = `url(${wine.image_url})`; // Set the dropped image as the background
          checkAnswer(draggedWineId, questionKey);
      } else {
          console.log('Dropped wine is not a valid choice');
      }
    } 
  
  
    function checkAnswer(selectedWineId, questionKey) {
      const currentQuestion = quizData[questionKey];
      const isCorrect = selectedWineId === currentQuestion.correct_answer.wine;
  
      if (isCorrect) {
          score++;
          document.querySelector('.feedback').textContent = 'Correct!';
      } else {
          document.querySelector('.feedback').textContent = 'Incorrect, try again!';
      }
  
      document.querySelector('#next-question-btn').style.display = 'block';
    }
  
    
    function showNextQuestion() {
      console.log('Current question number before increment:', currentQuestionNumber);
      currentQuestionNumber++;
      console.log('Current question number after increment:', currentQuestionNumber);
  
      if (currentQuestionNumber <= Object.keys(quizData).length) {
          console.log('Loading next question:', currentQuestionNumber);
          loadQuestion(currentQuestionNumber);
          document.querySelector('#next-question-btn').style.display = 'none';
      } else {
          console.log('End of quiz');
          document.querySelector('.quiz-container').innerHTML = `<div>Your score is: ${score}</div>`;
      }
    
      document.querySelector('#next-question-btn').style.display = 'none';
    }
    
    // Add event listener for 'Next Question' button
    document.querySelector('#next-question-btn').addEventListener('click', showNextQuestion);
    
  
    // Fetch the quiz data and start the quiz
    fetch('quiz.json')
      .then(response => response.json())
      .then(quiz_data => {
        quizData = quiz_data; // Store the fetched quiz data
        initializeQuiz();
      })
      .catch(error => console.error('Failed to load quiz data:', error));
  
    // Add event listeners for the drop area
    const dropArea = document.querySelector('.drop-area');
    dropArea.addEventListener('dragover', allowDrop);
    dropArea.addEventListener('drop', drop);
  });
  
  