// Khởi tạo mảng danh mục từ localStorage hoặc mảng rỗng nếu chưa có
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentCategoryPage = 1;
const categoryItemsPerPage = 6;

// Hiển thị danh sách danh mục
function displayCategories() {
    const categoryTableBody = document.getElementById('categoryTableBody');
    const categoryPagination = document.getElementById('pagination');
    if (!categoryTableBody) return;

    categoryTableBody.innerHTML = '';

    // Tính toán phân trang
    const startIndex = (currentCategoryPage - 1) * categoryItemsPerPage;
    const endIndex = startIndex + categoryItemsPerPage;
    const paginatedCategories = categories.slice(startIndex, endIndex);
    if (paginatedCategories.length === 0 && currentCategoryPage > 1) {
        currentCategoryPage = 1;
        // currentCategoryPage = Math.ceil(categories.length / categoryItemsPerPage);
        displayCategories();
        return;
    } else {
        paginatedCategories.forEach((category, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="openEditCategoryModal(${categories.indexOf(category)})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openDeleteCategoryModal(${categories.indexOf(category)})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });
    }

    // Hiển thị phân trang
    if (categoryPagination) {
        const totalPages = Math.ceil(categories.length / categoryItemsPerPage);
        let paginationHTML = '';
        // Nút Previous
        paginationHTML += `
            <li class="page-item ${currentCategoryPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeCategoryPage(${currentCategoryPage - 1})">Previous</a>
            </li>
        `;

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentCategoryPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeCategoryPage(${i})">${i}</a>
                </li>
            `;
        }

        // Nút Next
        paginationHTML += `
            <li class="page-item ${currentCategoryPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeCategoryPage(${currentCategoryPage + 1})">Next</a>
            </li>
        `;

        categoryPagination.innerHTML = paginationHTML;
    }

    // Cập nhật danh sách danh mục trong form thêm từ vựng
    updateCategoryDropdowns();
}

// Đổi trang danh mục
function changeCategoryPage(page) {
    if (page < 1 || page > Math.ceil(categories.length / categoryItemsPerPage)) return;
    currentCategoryPage = page;
    displayCategories();
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
    const newCategoryName = document.querySelector('#newCategoryName + .invalid-feedback');
    // const newCategoryDescription = document.querySelector('#newCategoryDescription + .invalid-feedback');
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        if (newCategoryName) {
            newCategoryName.textContent = 'Category name already exists!';
            newCategoryName.classList.remove('hidden');
            return false;
        }
        return false;
    }
    if (!validateCategoryInput(name, description)) return false;
    // function toTitleCase(str) {
    //     return str
    //         .toLowerCase()
    //         .split(" ")
    //         .filter(word => word)
    //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    //         .join(" ");
    // }
    // name = toTitleCase(name);

    name = name
        .split('')
        .filter(char => /[a-zA-Z\s]/.test(char))
        .join('');

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
        const currentCategory = categories[index].name;
        if (!validateCategoryInput(name, description, currentCategory)) return false;
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
        // Sử dụng modal dể thông báo rằng danh mục đang được sử dụng và khi xóa sẽ ẩn modal cũ và hiện modal xác nhận

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
    const categoryPagination = document.getElementById('pagination');
    if (!categoryTableBody) return;

    categoryTableBody.innerHTML = '';

    // Tính toán phân trang
    const startIndex = (currentCategoryPage - 1) * categoryItemsPerPage;
    const endIndex = startIndex + categoryItemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    if (paginatedCategories.length === 0) {
        categoryTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No categories found</td>
            </tr>
        `;
    } else {
        paginatedCategories.forEach((category, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="openEditCategoryModal(${categories.indexOf(category)})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="openDeleteCategoryModal(${categories.indexOf(category)})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });
    }
    // paginationCategories();
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
document.addEventListener('DOMContentLoaded', function () {
    // Hiển thị danh sách danh mục khi trang load
    displayCategories();

    // Xử lý thêm danh mục
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function (e) {
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
        editCategoryForm.addEventListener('submit', function (e) {
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
        deleteCategoryForm.addEventListener('submit', function (e) {
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
        searchInput.addEventListener('input', function (e) {
            currentCategoryPage = 1; // Reset về trang 1 khi tìm kiếm
            searchCategories(e.target.value);
        });
    }
});

// Validation cho input danh mục
function validateCategoryInput(newName, description) {
    const newCategoryName = document.querySelector('#newCategoryName + .invalid-feedback');
    const newCategoryDescription = document.querySelector('#newCategoryDescription + .invalid-feedback');
    if (!newName.trim()) {
        newCategoryName.textContent = 'Please enter a category name';
        return false;
    }
    if (!description.trim()) {
        newCategoryDescription.textContent = 'Please enter a description';
        return false;
    }
    return true;
}
function paginationCategories() {
    // Hiển thị phân trang
    if (categoryPagination) {
        const totalPages = Math.ceil(filteredCategories.length / categoryItemsPerPage);
        let paginationHTML = '';

        // Nút Previous
        paginationHTML += `
            <li class="page-item ${currentCategoryPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeCategoryPage(${currentCategoryPage - 1})">Previous</a>
            </li>
        `;

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentCategoryPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeCategoryPage(${i})">${i}</a>
                </li>
            `;
        }

        // Nút Next
        paginationHTML += `
            <li class="page-item ${currentCategoryPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeCategoryPage(${currentCategoryPage + 1})">Next</a>
            </li>
        `;

        categoryPagination.innerHTML = paginationHTML;
    }
}