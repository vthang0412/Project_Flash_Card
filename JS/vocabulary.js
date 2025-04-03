// Khởi tạo mảng từ vựng từ localStorage hoặc mảng rỗng nếu chưa có
let vocabularyList = JSON.parse(localStorage.getItem('vocabularyList')) || [];

// Hiển thị danh sách từ vựng
function displayVocabularyList() {
    const vocabularyTableBody = document.getElementById('vocabularyTableBody');
    if (!vocabularyTableBody) return;

    vocabularyTableBody.innerHTML = '';
    vocabularyList.forEach((vocab, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${vocab.word}</td>
            <td>${vocab.meaning}</td>
            <td>${vocab.category}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="openEditModal(${index})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${index})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        `;
        vocabularyTableBody.appendChild(row);
    });
}

// Thêm từ vựng mới
function addVocabulary(word, meaning, category) {
    vocabularyList.push({
        word: word,
        meaning: meaning,
        category: category
    });
    saveToLocalStorage();
    displayVocabularyList();
}

// Sửa từ vựng
function editVocabulary(index, word, meaning, category) {
    vocabularyList[index] = {
        word: word,
        meaning: meaning,
        category: category
    };
    saveToLocalStorage();
    displayVocabularyList();
}

// Xóa từ vựng
function deleteVocabulary(index) {
    vocabularyList.splice(index, 1);
    saveToLocalStorage();
    displayVocabularyList();
}

// Tìm kiếm từ vựng
function searchVocabulary(searchTerm) {
    const filteredList = vocabularyList.filter(vocab => 
        vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vocab.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vocab.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const vocabularyTableBody = document.getElementById('vocabularyTableBody');
    if (!vocabularyTableBody) return;

    vocabularyTableBody.innerHTML = '';
    filteredList.forEach((vocab, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${vocab.word}</td>
            <td>${vocab.meaning}</td>
            <td>${vocab.category}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="openEditModal(${vocabularyList.indexOf(vocab)})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${vocabularyList.indexOf(vocab)})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        `;
        vocabularyTableBody.appendChild(row);
    });
}

// Lưu vào localStorage
function saveToLocalStorage() {
    localStorage.setItem('vocabularyList', JSON.stringify(vocabularyList));
}

// Modal handlers
function openAddModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addVocabModal'));
    addModal.show();
}

function openEditModal(index) {
    const vocab = vocabularyList[index];
    document.getElementById('editWord').value = vocab.word;
    document.getElementById('editMeaning').value = vocab.meaning;
    document.getElementById('editCategory').value = vocab.category;
    document.getElementById('editIndex').value = index;
    
    const editModal = new bootstrap.Modal(document.getElementById('editVocabModal'));
    editModal.show();
}

function openDeleteModal(index) {
    document.getElementById('deleteIndex').value = index;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteVocabModal'));
    deleteModal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị danh sách từ vựng khi trang load
    displayVocabularyList();

    // Xử lý thêm từ vựng
    const addVocabForm = document.getElementById('addVocabForm');
    if (addVocabForm) {
        addVocabForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const word = document.getElementById('newWord').value;
            const meaning = document.getElementById('newMeaning').value;
            const category = document.getElementById('newCategory').value;
            addVocabulary(word, meaning, category);
            bootstrap.Modal.getInstance(document.getElementById('addVocabModal')).hide();
            addVocabForm.reset();
        });
    }

    // Xử lý sửa từ vựng
    const editVocabForm = document.getElementById('editVocabForm');
    if (editVocabForm) {
        editVocabForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const index = document.getElementById('editIndex').value;
            const word = document.getElementById('editWord').value;
            const meaning = document.getElementById('editMeaning').value;
            const category = document.getElementById('editCategory').value;
            editVocabulary(parseInt(index), word, meaning, category);
            bootstrap.Modal.getInstance(document.getElementById('editVocabModal')).hide();
        });
    }

    // Xử lý xóa từ vựng
    const deleteVocabForm = document.getElementById('deleteVocabForm');
    if (deleteVocabForm) {
        deleteVocabForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const index = document.getElementById('deleteIndex').value;
            deleteVocabulary(parseInt(index));
            bootstrap.Modal.getInstance(document.getElementById('deleteVocabModal')).hide();
        });
    }

    // Xử lý tìm kiếm
    const searchInput = document.getElementById('searchVocab');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchVocabulary(e.target.value);
        });
    }
});


