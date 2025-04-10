// Khởi tạo các biến toàn cục
let vocabularyList = JSON.parse(localStorage.getItem('vocabularyList')) || [];
let currentCardIndex = 0;
let isFlipped = false;

// Khởi tạo flashcard khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initializeFlashcards();
    updateCategoryFilter();
    
    // Thêm sự kiện cho nút flip
    const flashcard = document.querySelector('.flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', flipCard);
    }
});

// Khởi tạo flashcards
function initializeFlashcards() {
    if (vocabularyList.length === 0) {
        document.getElementById('cardWord').textContent = 'No words available';
        document.getElementById('cardMeaning').textContent = 'Please add some words';
        updateControls(true); // Disable controls
        return;
    }
    
    displayCurrentCard();
    updateWordList();
    updateProgress();
}

// Hiển thị thẻ hiện tại
function displayCurrentCard() {
    const currentWord = vocabularyList[currentCardIndex];
    document.getElementById('cardWord').textContent = currentWord.word;
    document.getElementById('cardMeaning').textContent = currentWord.meaning;
}

// Chuyển đến thẻ tiếp theo
function nextCard() {
    if (currentCardIndex < vocabularyList.length - 1) {
        currentCardIndex++;
        isFlipped = false;
        document.querySelector('.flashcard-inner').style.transform = 'rotateY(0deg)';
        displayCurrentCard();
        updateProgress();
    }
}

// Quay lại thẻ trước
function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        isFlipped = false;
        document.querySelector('.flashcard-inner').style.transform = 'rotateY(0deg)';
        displayCurrentCard();
        updateProgress();
    }
}

// Đánh dấu từ đã học
function markAsLearned() {
    const currentWord = vocabularyList[currentCardIndex];
    currentWord.learned = true;
    localStorage.setItem('vocabularyList', JSON.stringify(vocabularyList));
    updateWordList();
    nextCard();
}

// Cập nhật danh sách từ
function updateWordList() {
    const wordListBody = document.getElementById('wordListBody');
    wordListBody.innerHTML = '';
    
    vocabularyList.forEach((word) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${word.word}</td>
            <td class="px-6 py-4 whitespace-nowrap">${word.meaning}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${word.learned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${word.learned ? 'Learned' : 'Not Learned'}
                </span>
            </td>
        `;
        wordListBody.appendChild(row);
    });
}

// Cập nhật thanh tiến trình
function updateProgress() {
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    
    progressText.textContent = `${currentCardIndex + 1}/${vocabularyList.length}`;
    const progressPercentage = ((currentCardIndex + 1) / vocabularyList.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

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
    
    // Thêm sự kiện lọc
    categoryFilter.addEventListener('change', function() {
        const selectedCategory = this.value;
        if (selectedCategory) {
            vocabularyList = JSON.parse(localStorage.getItem('vocabularyList')).filter(
                word => word.category === selectedCategory
            );
        } else {
            vocabularyList = JSON.parse(localStorage.getItem('vocabularyList')) || [];
        }
        currentCardIndex = 0;
        isFlipped = false;
        document.querySelector('.flashcard-inner').style.transform = 'rotateY(0deg)';
        initializeFlashcards();
    });
}

// Cập nhật trạng thái các nút điều khiển
function updateControls(disabled) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = disabled;
    });
}
