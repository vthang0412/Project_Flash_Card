// Khởi tạo mảng từ vựng từ localStorage hoặc mảng rỗng nếu chưa có
let vocabularyList = JSON.parse(localStorage.getItem('vocabularyList')) || [];
let currentPage = 1;
const itemsPerPage = 6;
let currentFilter = '';

// Cập nhật danh sách danh mục trong dropdown
function updateCategoryFilter() {
    const categoryList = document.getElementById('categoryList');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categoryDropdown = document.getElementById('categoryDropdown');

    // Keep the "All Categories" option
    categoryList.innerHTML = `<li><a class="dropdown-item ${!currentFilter ? 'active' : ''}" href="#" data-category="">All Categories</a></li>`;

    // Add categories that have vocabulary words
    const usedCategories = [...new Set(vocabularyList.map(vocab => vocab.category))];
    usedCategories.forEach(category => {
        if (category) {
            categoryList.innerHTML += `
                <li><a class="dropdown-item ${currentFilter === category ? 'active' : ''}" 
                       href="#" 
                       data-category="${category}">${category}</a></li>
            `;
        }
    });

    // Add click event listeners to dropdown items
    const dropdownItems = categoryList.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedCategory = e.target.dataset.category;
            currentFilter = selectedCategory;

            // Update button text
            categoryDropdown.textContent = selectedCategory || 'All Categories';

            // Update active state
            dropdownItems.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');

            // Reset to first page and display filtered list
            currentPage = 1;
            displayVocabularyList();
        });
    });
}

// Lọc danh sách từ vựng theo danh mục
function filterVocabularyList() {
    const searchTerm = document.getElementById('searchVocab')?.value.toLowerCase() || '';
    let filteredList = vocabularyList;

    // Lọc theo danh mục nếu có
    if (currentFilter) {
        filteredList = filteredList.filter(vocab => vocab.category === currentFilter);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
        filteredList = filteredList.filter(vocab =>
            vocab.word.toLowerCase().includes(searchTerm) ||
            vocab.meaning.toLowerCase().includes(searchTerm)
        );
    }

    return filteredList;
}

// Hiển thị danh sách từ vựng có phân trang
function displayVocabularyList() {
    const vocabularyTableBody = document.getElementById('vocabularyTableBody');
    const paginationContainer = document.getElementById('pagination');
    if (!vocabularyTableBody) return;

    vocabularyTableBody.innerHTML = '';

    // Lấy danh sách đã lọc
    const filteredList = filterVocabularyList();

    // Tính toán phân trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedList = filteredList.slice(startIndex, endIndex);

    if (paginatedList.length === 0) {
        vocabularyTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                No vocabulary found
                </td>
            </tr>
        `;
    } else {
        paginatedList.forEach((vocab, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${vocab.word}</td>
                <td>${vocab.meaning}</td>
                <td>${vocab.category}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="openEditModal(${vocabularyList.indexOf(vocab)})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${vocabularyList.indexOf(vocab)})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            vocabularyTableBody.appendChild(row);
        });
    }

    // Hiển thị phân trang
    if (paginationContainer) {
        const totalPages = Math.ceil(filteredList.length / itemsPerPage);
        let paginationHTML = '';
        // Nếu xóa từ tra
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
        `;

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }

        // Nút Next
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }
}

// Đổi trang
function changePage(page) {
    if (page < 1 || page > Math.ceil(vocabularyList.length / itemsPerPage)) return;
    currentPage = page;
    displayVocabularyList();
}

// Thêm từ vựng mới với validation
function addVocabulary(word, meaning, category) {
    // Validation
    if (!validateVocabularyInput(word, meaning, category)) return false;

    vocabularyList.push({
        word: word,
        meaning: meaning,
        category: category
    });
    saveToLocalStorage();
    displayVocabularyList();
    return true;
}

// Sửa từ vựng với validation
function editVocabulary(index, word, meaning, category) {
    // Validation
    const currentWord = vocabularyList[index].word;
    if (!validateVocabularyInput(word, meaning, category, currentWord)) return false;
    vocabularyList[index] = {
        word: word,
        meaning: meaning,
        category: category
    };
    saveToLocalStorage();
    displayVocabularyList();
    return true;
}

// Validation cho input từ vựng
function validateVocabularyInput(word, meaning, category, currentWord = '') {
    const newWord = document.querySelector('#newWord + .invalid-feedback');
    const newMeaning = document.querySelector('#newMeaning + .invalid-feedback');
    const newCategory = document.querySelector('#newCategory + .invalid-feedback');
    if (!word.trim()) {
        newWord.textContent = 'Please enter a word';
        newWord.classList.remove('hidden');
        return false;
    }
    // if (word.trim().length < 2){
    //     newWord.textContent = 'Word must be at least 2 characters long';
    //     newWord.classList.remove('hidden');
    //     return false;
    // }
    // if (word.trim().split('').some(char => !isNaN(char) && char !== ' ')) {
    //     newWord.textContent = 'Word cannot contain numbers or a mix of numbers and letters';
    //     newWord.classList.remove('hidden');
    //     return false;
    // }
    // if(word.trim().includes('f')){
    //     newWord.textContent = 'Word cannot contain the letter "f"';
    //     newWord.classList.remove('hidden');
    //     return false;
    // }
    if (!meaning.trim()) {
        newMeaning.textContent = 'Please enter the meaning';
        newMeaning.classList.remove('hidden');
        return false;
    }
    if (!category) {
        newCategory.textContent = 'Please select a category';
        newCategory.classList.remove('hidden');
        return false;
    }

    // Kiểm tra từ vựng đã tồn tại (trừ trường hợp đang sửa chính từ đó)
    const existingWord = vocabularyList.find(
        v => v.word.toLowerCase() === word.toLowerCase()
    );
    if (existingWord && word.toLowerCase() !== currentWord.toLowerCase()) {
        // Không dùng alert mà dùng textcontent để hiển thị thông báo
        newWord.textContent = 'This word already exists';
        newWord.classList.remove('hidden');
        return false;
    }

    return true;
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
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${vocabularyList.indexOf(vocab)})">
                    <i class="fas fa-trash"></i> Delete
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

// Cập nhật danh mục trong các form
function updateCategoryDropdowns() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const dropdowns = document.querySelectorAll('.category-dropdown');

    dropdowns.forEach(dropdown => {
        // Giữ lại option đầu tiên (placeholder)
        const firstOption = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(firstOption);

        // Thêm các danh mục
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            dropdown.appendChild(option);
        });
    });
}

// Modal handlers
function openAddModal() {
    updateCategoryDropdowns(); // Cập nhật danh mục trước khi mở modal
    const addModal = new bootstrap.Modal(document.getElementById('addVocabModal'));
    document.getElementById('newWord').value = '';
    document.getElementById('newMeaning').value = '';
    document.getElementById('newCategory').value = '';
    addModal.show();
}

function openEditModal(index) {
    updateCategoryDropdowns(); // Cập nhật danh mục trước khi mở modal
    const vocab = vocabularyList[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editWord').value = vocab.word;
    document.getElementById('editMeaning').value = vocab.meaning;
    document.getElementById('editCategory').value = vocab.category;

    const editModal = new bootstrap.Modal(document.getElementById('editVocabModal'));
    editModal.show();
}

function openDeleteModal(index) {
    document.getElementById('deleteIndex').value = index;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteVocabModal'));
    deleteModal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo hiển thị ban đầu
    displayVocabularyList();
    updateCategoryFilter();
    updateCategoryDropdowns();

    // Form thêm từ vựng mới
    const addForm = document.getElementById('addVocabForm');
    if (addForm) {
        addForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const word = document.getElementById('newWord').value;
            const meaning = document.getElementById('newMeaning').value;
            const category = document.getElementById('newCategory').value;

            if (addVocabulary(word, meaning, category)) {
                // Đóng modal nếu thêm thành công
                const addModal = bootstrap.Modal.getInstance(document.getElementById('addVocabModal'));
                addModal.hide();
                // Reset form
                addForm.reset();
                // Cập nhật danh sách danh mục
                updateCategoryFilter();
            }
        });
    }

    // Form sửa từ vựng
    const editForm = document.getElementById('editVocabForm');
    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const index = document.getElementById('editIndex').value;
            const word = document.getElementById('editWord').value;
            const meaning = document.getElementById('editMeaning').value;
            const category = document.getElementById('editCategory').value;

            if (editVocabulary(parseInt(index), word, meaning, category)) {
                // Đóng modal nếu sửa thành công
                const editModal = bootstrap.Modal.getInstance(document.getElementById('editVocabModal'));
                editModal.hide();
                // Cập nhật danh sách danh mục
                updateCategoryFilter();
            }
        });
    }

    // Form xóa từ vựng
    const deleteForm = document.getElementById('deleteVocabForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const index = document.getElementById('deleteIndex').value;
            deleteVocabulary(parseInt(index));
            // Đóng modal sau khi xóa
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteVocabModal'));
            deleteModal.hide();
            // Cập nhật danh sách danh mục
            updateCategoryFilter();
        });
    }

    // Tìm kiếm từ vựng
    const searchInput = document.getElementById('searchVocab');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            currentPage = 1;
            displayVocabularyList();
        });
    }
});



