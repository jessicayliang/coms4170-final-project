let currentQuestionNumber = '1';  // Start with a string if your keys are strings in JSON
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
          if (quizData[currentQuestionNumber] && quizData[currentQuestionNumber].next_question) {
              currentQuestionNumber = quizData[currentQuestionNumber].next_question;
          } else {
              showResults();
              return;
          }
          loadNextQuestion();
          nextQuestionButton.style.display = 'none';
          dropArea.style.backgroundColor = '';
      }
  });
});

function loadNextQuestion() {
  console.log("Loading new question - Current question ID:", currentQuestionNumber);
  const questionData = quizData[currentQuestionNumber];

  if (!questionData) {
      console.log("No more questions available.");
      showResults();
      return;
  }

  // Update the question text
  document.querySelector('.question').textContent = questionData.question;

  // Set the food image source, alt text, and ensure it is not draggable
  const foodImage = document.querySelector('.food-pairing img');
  foodImage.src = questionData.food_pairing.image_url;
  foodImage.alt = questionData.food_pairing.description;
  foodImage.draggable = false; // Ensure the food image is not draggable

  // Clear and populate wine choices
  const wineChoicesContainer = document.querySelector('.wine-choices');
  wineChoicesContainer.innerHTML = '';

  questionData.wine_choices.forEach(choice => {
      const wineChoiceElement = document.createElement('div');
      wineChoiceElement.classList.add('wine-choice');
      wineChoiceElement.draggable = true; // Ensure only wine choices are draggable
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
}

function drag(event) {
    console.log("Dragging item:", event.target.id);
    event.dataTransfer.setData("text/plain", event.target.id);
}

function showResults() {
  window.location.href = `/results?score=${score}&total_questions=${Object.keys(quizData).length}`;
}

