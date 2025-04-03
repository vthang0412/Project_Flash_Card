// Khởi tạo các biến toàn cục
let vocabularyList = JSON.parse(localStorage.getItem('vocabularyList')) || [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizStarted = false;

// Khởi tạo quiz khi trang load
document.addEventListener('DOMContentLoaded', function() {
    updateCategoryFilter();
    loadQuizHistory();
});

// Cập nhật bộ lọc danh mục
function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(vocabularyList.map(word => word.category))];
    
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        if (category) {
            categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
        }
    });
}

// Bắt đầu quiz
function startQuiz() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    let availableWords = [...vocabularyList];
    
    if (categoryFilter) {
        availableWords = availableWords.filter(word => word.category === categoryFilter);
    }
    
    if (availableWords.length < 4) {
        alert('Need at least 4 words to start a quiz!');
        return;
    }

    // Tạo danh sách câu hỏi
    currentQuestions = shuffleArray(availableWords)
        .slice(0, Math.min(10, availableWords.length))
        .map(word => ({
            ...word,
            options: generateOptions(word, availableWords),
            answered: false,
            selectedAnswer: null
        }));

    currentQuestionIndex = 0;
    score = 0;
    quizStarted = true;

    // Hiển thị quiz container và ẩn kết quả
    document.getElementById('quizContainer').classList.remove('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    
    displayCurrentQuestion();
    updateQuizProgress();
}

// Tạo các lựa chọn cho câu hỏi
function generateOptions(correctWord, wordList) {
    const options = [correctWord.meaning];
    const otherWords = wordList.filter(w => w.word !== correctWord.word);
    
    while (options.length < 4 && otherWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherWords.length);
        const option = otherWords[randomIndex].meaning;
        if (!options.includes(option)) {
            options.push(option);
        }
        otherWords.splice(randomIndex, 1);
    }
    
    return shuffleArray(options);
}

// Hiển thị câu hỏi hiện tại
function displayCurrentQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    
    questionText.textContent = `What is the meaning of "${question.word}"?`;
    
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <button onclick="selectAnswer('${option}')"
                class="w-full text-left p-4 rounded border ${getOptionClass(option)}">
            ${option}
        </button>
    `).join('');
}

// Lấy class cho option dựa trên trạng thái
function getOptionClass(option) {
    const question = currentQuestions[currentQuestionIndex];
    if (!question.answered) {
        return 'hover:bg-blue-50';
    }
    
    if (option === question.meaning) {
        return 'bg-green-100 border-green-500';
    }
    
    if (option === question.selectedAnswer && option !== question.meaning) {
        return 'bg-red-100 border-red-500';
    }
    
    return 'opacity-50';
}

// Chọn câu trả lời
function selectAnswer(answer) {
    const question = currentQuestions[currentQuestionIndex];
    if (question.answered) return;
    
    question.answered = true;
    question.selectedAnswer = answer;
    
    if (answer === question.meaning) {
        score++;
    }
    
    displayCurrentQuestion();
    updateQuizProgress();
    
    // Tự động chuyển câu hỏi sau 1.5 giây
    setTimeout(() => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            nextQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Chuyển đến câu hỏi tiếp theo
function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
        updateQuizProgress();
    }
}

// Quay lại câu hỏi trước
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
        updateQuizProgress();
    }
}

// Cập nhật thanh tiến trình
function updateQuizProgress() {
    const progressText = document.getElementById('quizProgress');
    const progressBar = document.getElementById('quizProgressBar');
    
    progressText.textContent = `${currentQuestionIndex + 1}/${currentQuestions.length}`;
    const progressPercentage = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Hiển thị kết quả
function showResults() {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    
    const percentage = Math.round((score / currentQuestions.length) * 100);
    document.getElementById('finalScore').textContent = `${score}/${currentQuestions.length} (${percentage}%)`;
    
    let message = '';
    if (percentage >= 90) message = 'Excellent!';
    else if (percentage >= 70) message = 'Good job!';
    else if (percentage >= 50) message = 'Keep practicing!';
    else message = 'Need more practice!';
    
    document.getElementById('scoreMessage').textContent = message;
    
    // Lưu kết quả vào lịch sử
    saveQuizResult(percentage);
    loadQuizHistory();
}

// Lưu kết quả quiz
function saveQuizResult(percentage) {
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    quizHistory.push({
        date: new Date().toISOString(),
        category: document.getElementById('categoryFilter').value || 'All',
        score: percentage
    });
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
}

// Tải lịch sử quiz
function loadQuizHistory() {
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    const historyBody = document.getElementById('quizHistoryBody');
    
    historyBody.innerHTML = quizHistory.reverse().map(result => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                ${new Date(result.date).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${result.category}</td>
            <td class="px-6 py-4 whitespace-nowrap">${result.score}%</td>
        </tr>
    `).join('');
}

// Utility function để xáo trộn mảng
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
