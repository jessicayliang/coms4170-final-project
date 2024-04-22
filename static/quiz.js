let currentQuestionNumber = 1;
let quizData = {};
let score = 0;  // Define score variable to keep track of user scores.

document.addEventListener('DOMContentLoaded', () => {
  fetch('/static/quiz.json')
  .then(response => response.json())
  .then(data => {
      quizData = data;
      console.log("Initial load, current question number:", currentQuestionNumber);
      loadNextQuestion(); // Load initial question on data fetch success
  })
  .catch(error => console.error('Error loading the quiz data:', error));

  const dropArea = document.querySelector('.drop-area');
  const nextQuestionButton = document.querySelector('#next-question-btn');

  dropArea.addEventListener('dragover', function(event) {
      event.preventDefault();
      event.stopPropagation();
  });

  dropArea.addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Drop event: item dropped:", event.dataTransfer.getData("text"));
    event.target.style.backgroundColor = 'red';
    nextQuestionButton.style.display = 'block';
});



  nextQuestionButton.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (nextQuestionButton.style.display === 'block') {
          console.log("Next question button clicked, current question number before load:", currentQuestionNumber);
          loadNextQuestion();
          nextQuestionButton.style.display = 'none';
          dropArea.style.backgroundColor = '';
      }
  });
});

function loadNextQuestion() {
  console.log("Before loading new question - Current question ID:", currentQuestionNumber);
  const questionData = quizData[currentQuestionNumber];

  if (!questionData) {
      console.log("No more questions available.");
      showResults(); // Show results if no more questions
      return;
  }

  console.log("Loading question ID:", currentQuestionNumber);
  console.log("Current question data:", questionData);


  // Update the question text and image
  document.querySelector('.question').textContent = questionData.question;
  const foodImage = document.querySelector('.food-pairing img');
  foodImage.src = questionData.food_pairing.image_url;
  foodImage.alt = questionData.food_pairing.description;

  // Update wine choices
  const wineChoicesContainer = document.querySelector('.wine-choices');
  wineChoicesContainer.innerHTML = ''; // Clear previous choices

  questionData.wine_choices.forEach(choice => {
      const wineChoiceElement = document.createElement('div');
      wineChoiceElement.classList.add('wine-choice');
      wineChoiceElement.draggable = true;
      wineChoiceElement.id = choice.wine;
      wineChoiceElement.setAttribute('ondragstart', 'drag(event)');

      const image = document.createElement('img');
      image.src = choice.image_url;
      image.alt = choice.wine;

      const label = document.createElement('p');
      label.textContent = choice.wine;

      wineChoiceElement.appendChild(image);
      wineChoiceElement.appendChild(label);
      wineChoicesContainer.appendChild(wineChoiceElement);
  });

  // Correctly update the next question ID
  if (questionData.next_question) {
      currentQuestionNumber = questionData.next_question; // Ensure this is a string if your keys are strings
  } else {
      console.log("No next question specified, showing results.");
      showResults();
  }
}

function drag(event) {
  console.log("Dragging item:", event.target.id);
  event.dataTransfer.setData("text/plain", event.target.id);
}
function showResults() {
  const quizContainer = document.querySelector('.quiz-container');
  quizContainer.innerHTML = '<div>Your final score is: ' + score + '</div>';
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
            console.error('Error submitting quiz results', xhr);
        }
    });
}
