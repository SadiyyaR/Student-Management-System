// Base URL for API
const API_URL = '/api/students';

// Utility to show Bootstrap alerts
function showAlert(message, type = 'success', containerId = 'alertContainer') {
    const container = document.getElementById(containerId) || document.getElementById('formAlertContainer');
    if (!container) return;
    
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    container.innerHTML = alertHtml;
    
    // Auto clear after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Fetch all students for the index page
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            renderStudentsTable(data.data);
            // Store globally for search filtering
            window.studentsData = data.data; 
        } else {
            showAlert('Failed to fetch students', 'danger');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        showAlert('Network error while fetching students', 'danger');
        document.getElementById('studentTableBody').innerHTML = `
            <tr><td colspan="7" class="text-center text-danger">Failed to load data. Ensure backend is running.</td></tr>
        `;
    }
}

// Render students into the table
function renderStudentsTable(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
    
    if (students.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No students found.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td class="fw-semibold">${student.name}</td>
            <td><span class="badge bg-secondary">${student.registerNumber}</span></td>
            <td>${student.department}</td>
            <td>${student.year}</td>
            <td><a href="mailto:${student.email}" class="text-decoration-none">${student.email}</a></td>
            <td>${student.phoneNumber}</td>
            <td class="text-center">
                <a href="/edit?id=${student._id}" class="btn btn-sm btn-outline-primary btn-action me-1" title="Edit">
                    <i class="fas fa-edit"></i>
                </a>
                <button onclick="confirmDelete('${student._id}')" class="btn btn-sm btn-outline-danger btn-action" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filter students based on search input
function filterStudents(query) {
    if (!window.studentsData) return;
    
    const lowerQuery = query.toLowerCase();
    const filtered = window.studentsData.filter(student => 
        student.name.toLowerCase().includes(lowerQuery) ||
        student.registerNumber.toLowerCase().includes(lowerQuery) ||
        student.department.toLowerCase().includes(lowerQuery)
    );
    
    renderStudentsTable(filtered);
}

// Handle Add Student form submission
async function handleAddSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    
    const studentData = {
        name: document.getElementById('name').value,
        registerNumber: document.getElementById('registerNumber').value,
        department: document.getElementById('department').value,
        year: parseInt(document.getElementById('year').value),
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Student added successfully!', 'success');
            form.reset();
            form.classList.remove('was-validated');
            // Redirect after brief delay
            setTimeout(() => window.location.href = '/', 1500);
        } else {
            // Handle validation errors from backend
            let errorMsg = data.error;
            if (Array.isArray(errorMsg)) {
                errorMsg = errorMsg.join('<br>');
            }
            showAlert(errorMsg || 'Failed to add student', 'danger');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        showAlert('Network error while adding student', 'danger');
    }
}

// Load student data for edit page
async function loadStudentDataForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        showAlert('No student ID provided', 'danger');
        return;
    }
    
    document.getElementById('studentId').value = id;
    
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const student = data.data;
            document.getElementById('name').value = student.name;
            document.getElementById('registerNumber').value = student.registerNumber;
            document.getElementById('department').value = student.department;
            document.getElementById('year').value = student.year;
            document.getElementById('email').value = student.email;
            document.getElementById('phoneNumber').value = student.phoneNumber;
        } else {
            showAlert('Failed to fetch student details', 'danger');
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        showAlert('Network error while fetching student details', 'danger');
    }
}

// Handle Edit form submission
async function handleEditSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    
    const id = document.getElementById('studentId').value;
    const studentData = {
        name: document.getElementById('name').value,
        registerNumber: document.getElementById('registerNumber').value,
        department: document.getElementById('department').value,
        year: parseInt(document.getElementById('year').value),
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value
    };
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Student updated successfully!', 'success');
            setTimeout(() => window.location.href = '/', 1500);
        } else {
            let errorMsg = data.error;
            if (Array.isArray(errorMsg)) {
                errorMsg = errorMsg.join('<br>');
            }
            showAlert(errorMsg || 'Failed to update student', 'danger');
        }
    } catch (error) {
        console.error('Error updating student:', error);
        showAlert('Network error while updating student', 'danger');
    }
}

// Delete student with confirmation
async function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert('Student deleted successfully!', 'success');
                // Refresh list
                fetchStudents();
            } else {
                showAlert('Failed to delete student', 'danger');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            showAlert('Network error while deleting student', 'danger');
        }
    }
}
