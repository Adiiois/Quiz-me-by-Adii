document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    const fileInput = document.getElementById('pdfFile');
    formData.append('pdf', fileInput.files[0]);
    
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
            return;
        }
        
        displayQuiz(data.quiz);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the PDF.');
    });
});

function displayQuiz(questions) {
    const quizContainer = document.getElementById('quizContainer');
    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = '';
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${q.question}</p>
            <label><input type="radio" name="q${index}" value="True"> True</label>
            <label><input type="radio" name="q${index}" value="False"> False</label>
        `;
        quizDiv.appendChild(questionDiv);
    });
    
    quizContainer.style.display = 'block';
}

document.getElementById('submitQuiz').addEventListener('click', function() {
    const questions = document.querySelectorAll('.question');
    let score = 0;
    let total = questions.length;
    
    questions.forEach((q, index) => {
        const selected = q.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === 'True') {  // Assuming all are "True" as per backend
            score++;
        }
    });
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p class="results">You scored ${score} out of ${total}.</p>`;
});