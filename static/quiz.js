let currentQuestionNumber = '1'; // Start with the first question
let quizData = {};
let score = 0; // Initialize score

document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar(0, 10)
    fetch('/static/quiz.json') // Load quiz data from server
        .then(response => response.json())
        .then(data => {
            quizData = data;
            Object.keys(quizData).forEach(key => {
                quizData[key].attempted = false; // Initialize each question as unattempted
            });
            console.log("Quiz data loaded. Current question number:", currentQuestionNumber);
            loadNextQuestion(); // Load the first question
        })
        .catch(error => console.error('Error loading quiz data:', error));

    const dropArea = document.querySelector('.drop-area');
    const nextQuestionButton = document.querySelector('#next-question-btn');

    dropArea.addEventListener('dragover', function(event) {
        event.preventDefault(); // Prevent default to allow drop
        event.stopPropagation();
        dropArea.style.backgroundColor = '#d6d6d6'; // Visual cue on drag over
    });

    dropArea.addEventListener('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();

        const droppedWine = event.dataTransfer.getData("text");
        const correctAnswer = quizData[currentQuestionNumber].correct_answer.wine;

        // Check if the dropped item matches the correct answer
        if (droppedWine === correctAnswer) {
            dropArea.style.backgroundColor = 'green'; // Set color to green for correct answer
            if (!quizData[currentQuestionNumber].attempted) {
                // Increment score only on the first correct attempt
                quizData[currentQuestionNumber].is_correct = true;
                score += 1; 
                quizData[currentQuestionNumber].attempted = true; // Mark the question as attempted
            }
        } else {
            dropArea.style.backgroundColor = 'red'; // Set color to red for incorrect answer
            quizData[currentQuestionNumber].is_correct = false; // Mark as incorrect if first drop is wrong
            quizData[currentQuestionNumber].attempted = true; // Mark the question as attempted
        }

        console.log(`Drop event: item dropped: ${droppedWine}, Correct: ${correctAnswer}, Score: ${score}`);
        nextQuestionButton.style.display = 'block'; // Show the 'Next' button
    });

    nextQuestionButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (nextQuestionButton.style.display === 'block') {
            updateProgressBar(parseInt(currentQuestionNumber, 10), 10)
            if (quizData[currentQuestionNumber] && quizData[currentQuestionNumber].next_question) {
                currentQuestionNumber = quizData[currentQuestionNumber].next_question;
                loadNextQuestion();
                nextQuestionButton.style.display = 'none'; // Hide button until next answer is dropped
                dropArea.style.backgroundColor = ''; // Reset background color
            } else {
                showResults();
            }
        }
    });
});

function loadNextQuestion() {
    if (!quizData[currentQuestionNumber]) {
        console.error("No more questions available.");
        showResults();
        return;
    }

    const questionData = quizData[currentQuestionNumber];
    document.querySelector('.question').textContent = questionData.question;
    
    const foodImage = document.querySelector('.food-pairing img');
    foodImage.src = questionData.food_pairing.image_url;
    foodImage.alt = questionData.food_pairing.description;
    foodImage.draggable = false;  // Ensure the food image is not draggable

    const wineChoicesContainer = document.querySelector('.wine-choices');
    wineChoicesContainer.innerHTML = '';
    questionData.wine_choices.forEach(choice => {
        wineChoicesContainer.appendChild(createWineChoiceElement(choice));
    });
}

function createWineChoiceElement(choice) {
    const wineChoiceElement = document.createElement('div');
    wineChoiceElement.classList.add('wine-choice');
    wineChoiceElement.draggable = true;
    wineChoiceElement.id = choice.wine; // Both text and image have the same ID for drag operation
    wineChoiceElement.setAttribute('ondragstart', 'drag(event)');

    const image = document.createElement('img');
    image.src = choice.image_url;
    image.alt = choice.wine;
    image.classList.add('wine-image');

    const label = document.createElement('p');
    label.textContent = choice.wine;
    label.classList.add('wine-label');

    wineChoiceElement.appendChild(image);
    wineChoiceElement.appendChild(label);
    return wineChoiceElement;
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id || event.target.parentElement.id);
}

function showResults() {
    console.log(`Final Score: ${score} out of ${Object.keys(quizData).length}`);
    window.location.href = `/results?score=${score}&total_questions=${Object.keys(quizData).length}`;
}

function updateProgressBar(questionNumber, totalQuestions) {
    const progressBar = document.querySelector('.progress-bar');
    const width = (questionNumber / totalQuestions) * 100;
    progressBar.style.width = `${width}%`;
}
