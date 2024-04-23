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
        dropArea.style.backgroundColor = '#d6d6d6'; // color on hover
    });

    dropArea.addEventListener('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();
        const droppedWine = event.dataTransfer.getData("text");
        console.log("Drop event: item dropped:", droppedWine);

        const correctAnswer = quizData[currentQuestionNumber].correct_answer.wine;
        if (droppedWine === correctAnswer) {
            quizData[currentQuestionNumber].is_correct = 1; // Mark as correct
            score += 1; // Increment the score
        } else {
            quizData[currentQuestionNumber].is_correct = 0; // Mark as incorrect
        }

        console.log(`Answer recorded. Current score: ${score}`);
        dropArea.style.backgroundColor = '#d6d6d6'; // color to indicate answer recorded
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
          dropArea.style.backgroundColor = ''; // Reset background color on new question
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

    document.querySelector('.question').textContent = questionData.question;
    const foodImage = document.querySelector('.food-pairing img');
    foodImage.src = questionData.food_pairing.image_url;
    foodImage.alt = questionData.food_pairing.description;
    foodImage.draggable = false;

    const wineChoicesContainer = document.querySelector('.wine-choices');
    wineChoicesContainer.innerHTML = '';

    questionData.wine_choices.forEach(choice => {
        const wineChoiceElement = document.createElement('div');
        wineChoiceElement.classList.add('wine-choice');
        wineChoiceElement.draggable = true;
        wineChoiceElement.id = choice.wine;
        wineChoiceElement.setAttribute('ondragstart', 'drag(event)');

        const image = document.createElement('img');
        image.src = choice.image_url;
        image.alt = choice.wine;
        image.id = choice.wine;
        image.draggable = true;

        const label = document.createElement('p');
        label.textContent = choice.wine;

        wineChoiceElement.appendChild(image);
        wineChoiceElement.appendChild(label);
        wineChoicesContainer.appendChild(wineChoiceElement);
    });
}

function drag(event) {
    let id = event.target.id;
    if (!id) {
        id = event.target.parentElement.id;
    }
    console.log("Dragging item:", id);
    event.dataTransfer.setData("text/plain", id);
}

function showResults() {
    console.log(`Final Score: ${score} out of ${Object.keys(quizData).length}`);
    window.location.href = `/results?score=${score}&total_questions=${Object.keys(quizData).length}`;
}
