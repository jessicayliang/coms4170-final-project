let currentQuestionNumber = 0;
let quizData = {};

document.addEventListener('DOMContentLoaded', () => {
  fetch('/static/quiz.json')
    .then(response => response.json())
    .then(data => {
      quizData = data;
      loadNextQuestion();
    });

    const dropArea = document.querySelector('.drop-area');
    const nextQuestionButton = document.querySelector('#next-question-btn');
    
    dropArea.addEventListener('dragover', function(event) {
      event.preventDefault();
      console.log("Drag over!");
    });
  
    dropArea.addEventListener('drop', function(event) {
      event.preventDefault();
      console.log("Dropped!");
      event.target.style.backgroundColor = 'red';
      nextQuestionButton.style.display = 'block'; // Show the 'Next Question' button
    });
  
    nextQuestionButton.addEventListener('click', function() {
      loadNextQuestion(); // Function to load the next question
      nextQuestionButton.style.display = 'none'; // Hide button again until next drop
      dropArea.style.backgroundColor = ''; // Reset drop area color
    });
  });
  function loadNextQuestion() {
    console.log("Loading next question...");
  
    // Increment the question number to move to the next question
    currentQuestionNumber++;
  
    // Check if the next question exists
    if (!quizData[currentQuestionNumber]) {
      console.log("No more questions available.");
      showResults(); // Function to display final results or some end message
      return;
    }
  
    const questionData = quizData[currentQuestionNumber];
  
    // Update question text
    document.querySelector('.question').textContent = questionData.question;
  
    // Update food pairing image
    const foodImage = document.querySelector('.food-pairing img');
    foodImage.src = questionData.food_pairing.image_url;
    foodImage.alt = questionData.food_pairing.description;
  
    // Clear previous wine choices and add new ones
    const wineChoicesContainer = document.querySelector('.wine-choices');
    wineChoicesContainer.innerHTML = ''; // Clear previous choices
    console.log("Wine choices container cleared and ready for new choices.");
  
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
  
      // Reattach the drag event listener
      wineChoiceElement.addEventListener('dragstart', drag);
    });
  
    console.log("New wine choices added.");
  
    // Reset drop area
    const dropArea = document.querySelector('.drop-area');
    dropArea.style.backgroundColor = ''; // Reset background color
    dropArea.style.backgroundImage = ''; // Clear any previous wine image set as background
  }
  
  function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log("Dragging:", event.target.id);
  }
  
  function showResults() {
    document.querySelector('.quiz-container').innerHTML = `<div>Your final score is: ${score}</div>`;
    // Optionally reset the quiz or offer options to restart or leave
  }


  function sendResults() {
    let answers = {};
    Object.keys(quizData).forEach(key => {
        answers[key] = quizData[key]['user_answer'];
    });

    $.ajax({
        type: 'POST',
        url: '/submit_quiz',
        contentType: 'application/json',
        data: JSON.stringify(answers),
        success: function(response) {
            window.location.href = '/results?score=' + response.score + '&total_questions=' + response.total_questions;
        },
        error: function(xhr) {
            console.log('Error submitting quiz results', xhr);
        }
    });
  }
