// Khởi tạo mảng danh mục từ localStorage hoặc mảng rỗng nếu chưa có
let categories = JSON.parse(localStorage.getItem('categories')) || [];

// Hiển thị danh sách danh mục
function displayCategories() {
    const categoryTableBody = document.getElementById('categoryTableBody');
    if (!categoryTableBody) return;

    categoryTableBody.innerHTML = '';
    categories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="openEditCategoryModal(${index})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteCategoryModal(${index})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        `;
        categoryTableBody.appendChild(row);
    });
    // Cập nhật danh sách danh mục trong form thêm từ vựng
    updateCategoryDropdowns();
}

// Cập nhật dropdown danh mục trong các form
function updateCategoryDropdowns() {
    const categoryDropdowns = document.querySelectorAll('.category-dropdown');
    categoryDropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Chọn danh mục</option>';
        categories.forEach(category => {
            dropdown.innerHTML += `<option value="${category.name}">${category.name}</option>`;
        });
    });
}

// Thêm danh mục mới
function addCategory(name, description) {
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        alert('Danh mục này đã tồn tại!');
        return false;
    }
    categories.push({
        name: name,
        description: description
    });
    saveCategoriesToLocalStorage();
    displayCategories();
    return true;
}

// Sửa danh mục
function editCategory(index, name, description) {
    // Kiểm tra xem tên mới có trùng với danh mục khác không
    if (categories.some((cat, i) => i !== index && cat.name.toLowerCase() === name.toLowerCase())) {
        alert('Danh mục này đã tồn tại!');
        return false;
    }
    categories[index] = {
        name: name,
        description: description
    };
    saveCategoriesToLocalStorage();
    displayCategories();
    return true;
}

// Xóa danh mục
function deleteCategory(index) {
    // Kiểm tra xem danh mục có đang được sử dụng không
    const vocabularyList = JSON.parse(localStorage.getItem('vocabularyList')) || [];
    const categoryName = categories[index].name;
    if (vocabularyList.some(vocab => vocab.category === categoryName)) {
        alert('Không thể xóa danh mục này vì đang có từ vựng sử dụng!');
        return false;
    }
    categories.splice(index, 1);
    saveCategoriesToLocalStorage();
    displayCategories();
    return true;
}

// Tìm kiếm danh mục
function searchCategories(searchTerm) {
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categoryTableBody = document.getElementById('categoryTableBody');
    if (!categoryTableBody) return;

    categoryTableBody.innerHTML = '';
    filteredCategories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="openEditCategoryModal(${categories.indexOf(category)})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-sm btn-danger" onclick="openDeleteCategoryModal(${categories.indexOf(category)})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        `;
        categoryTableBody.appendChild(row);
    });
}

// Lưu vào localStorage
function saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Modal handlers
function openAddCategoryModal() {
    const addModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    addModal.show();
}

function openEditCategoryModal(index) {
    const category = categories[index];
    document.getElementById('editCategoryName').value = category.name;
    document.getElementById('editCategoryDescription').value = category.description;
    document.getElementById('editCategoryIndex').value = index;
    
    const editModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    editModal.show();
}

function openDeleteCategoryModal(index) {
    document.getElementById('deleteCategoryIndex').value = index;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteCategoryModal'));
    deleteModal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị danh sách danh mục khi trang load
    displayCategories();

    // Xử lý thêm danh mục
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('newCategoryName').value;
            const description = document.getElementById('newCategoryDescription').value;
            if (addCategory(name, description)) {
                bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
                addCategoryForm.reset();
            }
        });
    }

    // Xử lý sửa danh mục
    const editCategoryForm = document.getElementById('editCategoryForm');
    if (editCategoryForm) {
        editCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const index = parseInt(document.getElementById('editCategoryIndex').value);
            const name = document.getElementById('editCategoryName').value;
            const description = document.getElementById('editCategoryDescription').value;
            if (editCategory(index, name, description)) {
                bootstrap.Modal.getInstance(document.getElementById('editCategoryModal')).hide();
            }
        });
    }

    // Xử lý xóa danh mục
    const deleteCategoryForm = document.getElementById('deleteCategoryForm');
    if (deleteCategoryForm) {
        deleteCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const index = parseInt(document.getElementById('deleteCategoryIndex').value);
            if (deleteCategory(index)) {
                bootstrap.Modal.getInstance(document.getElementById('deleteCategoryModal')).hide();
            }
        });
    }

    // Xử lý tìm kiếm
    const searchInput = document.getElementById('searchCategory');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchCategories(e.target.value);
        });
    }
});


