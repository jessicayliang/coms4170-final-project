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
    let droppedWine = event.dataTransfer.getData("text");
    console.log("Drop event: item dropped:", droppedWine);

    // Update the background color to indicate correct or incorrect drop
    if (quizData[currentQuestionNumber.toString()].correct_answer.wine === droppedWine) {
        event.target.style.backgroundColor = 'green'; // Correct choice
        quizData[currentQuestionNumber.toString()].is_correct = 1; // Mark as correct
        score++; // Increment score
    } else {
        event.target.style.backgroundColor = 'red'; // Incorrect choice
        quizData[currentQuestionNumber.toString()].is_correct = 0; // Mark as incorrect
    }
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
  const questionData = quizData[currentQuestionNumber.toString()]; // Ensure the key is accessed as a string

  if (!questionData) {
      console.log("No more questions available.");
      sendResults(); // Send results instead of showing them directly
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

  setTimeout(() => {
      const nextQuestionButton = document.querySelector('#next-question-btn');
      if (questionData.next_question) {
          currentQuestionNumber = questionData.next_question;
          nextQuestionButton.style.display = 'block'; // Show next question button after a delay
      } else {
          nextQuestionButton.style.display = 'block';
          nextQuestionButton.textContent = 'Show Results'; // Change button text for the last question
          nextQuestionButton.onclick = () => {
              sendResults(); // Change event handler to send results
          };
      }
  }, 500); // Maintain the 500ms delay for UI consistency
}



function drag(event) {
  console.log("Dragging item:", event.target.id);
  event.dataTransfer.setData("text/plain", event.target.id);
}

function showResults() {
  // Redirect to quiz_results.html with score and total questions as URL parameters
  window.location.href = `/quiz_results.html?score=${score}&total_questions=${Object.keys(quizData).length}`;
}


function sendResults() {
  let answers = {};
  Object.keys(quizData).forEach(key => {
      answers[key] = quizData[key]['user_answer'];
  });

  let totalCorrect = Object.values(quizData).reduce((acc, curr) => acc + (curr.is_correct || 0), 0);
  let totalQuestions = Object.keys(quizData).length;

  $.ajax({
      type: 'POST',
      url: '/submit_quiz',
      contentType: 'application/json',
      data: JSON.stringify({ score: totalCorrect, totalQuestions: totalQuestions, answers: answers }),
      success: function(response) {
          window.location.href = response.url; // Make sure the server sends back the correct URL
      },
      error: function(xhr) {
          console.error('Error submitting quiz results', xhr);
      }
  });
}

