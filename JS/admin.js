/* =====================================================
   ADMIN PANEL - ENHANCED JAVASCRIPT
   Modern administration panel with full CRUD operations
   ===================================================== */

(function() {
    'use strict';

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    const AdminState = {
        questions: [],
        filteredQuestions: [],
        editingQuestion: null,
        currentPage: 1,
        itemsPerPage: 10,
        searchTerm: '',
        difficultyFilter: '',
        tagFilter: '',
        allTags: new Set(),
        tagCounts: new Map(),
        selectedTagsForDeletion: new Set(),
        hasUnsavedChanges: false
    };

    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================
    function showToast(message, type = 'info') {
        // Remove any existing toast
        const existingToast = document.querySelector('.admin-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `admin-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // DATA LOADING AND SAVING
    // ========================================
    function loadQuestions() {
        if (!window.allQuestions || window.allQuestions.length === 0) {
            console.warn('No questions loaded yet');
            showToast('Aguardando carregamento das questões...', 'info');
            return;
        }

        AdminState.questions = [...window.allQuestions];
        AdminState.filteredQuestions = [...AdminState.questions];
        
        // Extract all unique tags with counts
        AdminState.allTags.clear();
        const tagCounts = new Map();
        
        AdminState.questions.forEach(q => {
            const tags = q.tags || [];
            tags.forEach(tag => {
                const tagName = typeof tag === 'string' ? tag : (tag.name || tag);
                AdminState.allTags.add(tagName);
                tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1);
            });
        });

        // Store tag counts in state
        AdminState.tagCounts = tagCounts;

        updateStats();
        populateTagFilter();
        renderGlobalTags();
        applyFilters();
        showToast('Questões carregadas com sucesso!', 'success');
    }

    function saveAllQuestions() {
        if (!AdminState.hasUnsavedChanges) {
            showToast('Nenhuma alteração para salvar', 'info');
            return;
        }

        const saveBtn = document.getElementById('save-all-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span class="spinner"></span> Salvando...';
        }

        // Update the global questions array
        window.allQuestions = [...AdminState.questions];

        // Here you would normally save to a backend/database
        // For now, we'll just update localStorage as a fallback
        try {
            localStorage.setItem('quiz_questions_backup', JSON.stringify(AdminState.questions));
            AdminState.hasUnsavedChanges = false;
            showToast('Alterações salvas com sucesso!', 'success');
        } catch (error) {
            console.error('Error saving questions:', error);
            showToast('Erro ao salvar alterações', 'error');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '💾 Salvar Tudo';
            }
        }
    }

    // ========================================
    // STATISTICS
    // ========================================
    function updateStats() {
        const total = AdminState.questions.length;
        const easy = AdminState.questions.filter(q => q.dificuldade === 1).length;
        const medium = AdminState.questions.filter(q => q.dificuldade === 2).length;
        const hard = AdminState.questions.filter(q => q.dificuldade === 3).length;

        document.getElementById('total-questions-count').textContent = total;
        document.getElementById('easy-questions-count').textContent = easy;
        document.getElementById('medium-questions-count').textContent = medium;
        document.getElementById('hard-questions-count').textContent = hard;
    }

    // ========================================
    // FILTERS AND SEARCH
    // ========================================
    function populateTagFilter() {
        const tagFilter = document.getElementById('tag-filter');
        if (!tagFilter) return;

        tagFilter.innerHTML = '<option value="">Todas as tags</option>';
        
        Array.from(AdminState.allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }

    function applyFilters() {
        AdminState.filteredQuestions = AdminState.questions.filter(question => {
            // Text search
            const matchesSearch = !AdminState.searchTerm ||
                question.pergunta.toLowerCase().includes(AdminState.searchTerm.toLowerCase()) ||
                (question.id && question.id.toString().includes(AdminState.searchTerm)) ||
                (question.tags && question.tags.some(tag => {
                    const tagName = typeof tag === 'string' ? tag : tag.name;
                    return tagName.toLowerCase().includes(AdminState.searchTerm.toLowerCase());
                }));

            // Difficulty filter
            const matchesDifficulty = !AdminState.difficultyFilter ||
                question.dificuldade.toString() === AdminState.difficultyFilter;

            // Tag filter
            const matchesTag = !AdminState.tagFilter ||
                (question.tags && question.tags.some(tag => {
                    const tagName = typeof tag === 'string' ? tag : tag.name;
                    return tagName === AdminState.tagFilter;
                }));

            return matchesSearch && matchesDifficulty && matchesTag;
        });

        AdminState.currentPage = 1;
        renderQuestionsList();
        updateCountInfo();
    }

    function updateCountInfo() {
        const countInfo = document.getElementById('questions-count-info');
        if (countInfo) {
            const total = AdminState.questions.length;
            const filtered = AdminState.filteredQuestions.length;
            countInfo.textContent = filtered === total 
                ? `${total} questões` 
                : `${filtered} de ${total} questões visíveis`;
        }
    }

    // ========================================
    // RENDERING
    // ========================================
    function renderQuestionsList() {
        const container = document.getElementById('questions-list');
        if (!container) return;

        container.innerHTML = '';

        const totalPages = Math.ceil(AdminState.filteredQuestions.length / AdminState.itemsPerPage);
        const startIndex = (AdminState.currentPage - 1) * AdminState.itemsPerPage;
        const endIndex = Math.min(startIndex + AdminState.itemsPerPage, AdminState.filteredQuestions.length);
        const questionsToShow = AdminState.filteredQuestions.slice(startIndex, endIndex);

        if (questionsToShow.length === 0) {
            container.innerHTML = '<div class="admin-empty-state"><p>Nenhuma questão encontrada.</p></div>';
        } else {
            questionsToShow.forEach(question => {
                const questionElement = createQuestionListItem(question);
                container.appendChild(questionElement);
            });
        }

        updatePaginationControls(totalPages);
    }

    function createQuestionListItem(question) {
        const item = document.createElement('div');
        item.className = 'question-item';
        
        if (AdminState.editingQuestion && AdminState.editingQuestion.id === question.id) {
            item.classList.add('active');
        }

        const difficultyClass = question.dificuldade === 1 ? 'difficulty-easy' :
                               question.dificuldade === 2 ? 'difficulty-medium' : 'difficulty-hard';
        const difficultyText = question.dificuldade === 1 ? 'Fácil' :
                              question.dificuldade === 2 ? 'Médio' : 'Difícil';

        // Extract tag names
        const tagNames = question.tags ? question.tags.map(tag => 
            typeof tag === 'string' ? tag : tag.name
        ) : [];

        item.innerHTML = `
            <div class="question-id-label">ID: ${question.id || 'N/A'}</div>
            <div class="question-text-preview">${question.pergunta}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
                <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                <div class="question-tags-preview">
                    ${tagNames.slice(0, 3).map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                    ${tagNames.length > 3 ? `<span class="tag-badge">+${tagNames.length - 3}</span>` : ''}
                </div>
            </div>
        `;

        item.addEventListener('click', () => {
            selectQuestionForEditing(question);
        });

        return item;
    }

    function updatePaginationControls(totalPages) {
        const currentPageEl = document.getElementById('current-page');
        const totalPagesEl = document.getElementById('total-pages');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (currentPageEl) currentPageEl.textContent = AdminState.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages || 1;

        if (prevBtn) prevBtn.disabled = AdminState.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = AdminState.currentPage >= totalPages;
    }

    // ========================================
    // GLOBAL TAGS MANAGEMENT
    // ========================================
    function renderGlobalTags() {
        const container = document.getElementById('global-tags-container');
        if (!container) return;

        container.innerHTML = '';

        if (AdminState.allTags.size === 0) {
            container.innerHTML = '<p style="color: var(--admin-text-tertiary); margin: 0; font-size: 0.875rem;">Nenhuma tag encontrada.</p>';
            return;
        }

        // Add selection controls
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;';
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.className = 'btn btn-secondary';
        selectAllBtn.style.cssText = 'padding: 0.375rem 0.75rem; font-size: 0.8125rem; border-radius: 0.375rem;';
        selectAllBtn.textContent = 'Selecionar todas';
        selectAllBtn.onclick = () => {
            AdminState.selectedTagsForDeletion = new Set(AdminState.allTags);
            renderGlobalTags();
        };

        const deselectAllBtn = document.createElement('button');
        deselectAllBtn.className = 'btn btn-secondary';
        deselectAllBtn.style.cssText = 'padding: 0.375rem 0.75rem; font-size: 0.8125rem; border-radius: 0.375rem;';
        deselectAllBtn.textContent = 'Desmarcar todas';
        deselectAllBtn.onclick = () => {
            AdminState.selectedTagsForDeletion.clear();
            renderGlobalTags();
        };

        const deleteSelectedBtn = document.createElement('button');
        deleteSelectedBtn.className = 'btn btn-primary';
        deleteSelectedBtn.style.cssText = 'padding: 0.375rem 0.75rem; font-size: 0.8125rem; background: var(--admin-danger); border-radius: 0.375rem;';
        deleteSelectedBtn.textContent = AdminState.selectedTagsForDeletion.size > 0 
            ? `Deletar (${AdminState.selectedTagsForDeletion.size})` 
            : 'Deletar selecionadas';
        deleteSelectedBtn.disabled = AdminState.selectedTagsForDeletion.size === 0;
        deleteSelectedBtn.onclick = deleteSelectedTags;

        controls.appendChild(selectAllBtn);
        controls.appendChild(deselectAllBtn);
        controls.appendChild(deleteSelectedBtn);
        container.appendChild(controls);

        // Add tags with counts
        const tagsWrapper = document.createElement('div');
        tagsWrapper.style.cssText = 'display: flex; flex-wrap: wrap; gap: 0.5rem;';

        Array.from(AdminState.allTags).sort().forEach(tag => {
            const count = AdminState.tagCounts.get(tag) || 0;
            const isSelected = AdminState.selectedTagsForDeletion.has(tag);
            
            const badge = document.createElement('button');
            badge.className = `tag-badge-deletable ${isSelected ? 'selected' : ''}`;
            badge.innerHTML = `${tag} <span style="opacity: 0.6; font-size: 0.75rem;">(${count})</span>`;
            badge.title = `${tag} - ${count} uso${count !== 1 ? 's' : ''}`;
            
            badge.addEventListener('click', () => {
                if (isSelected) {
                    AdminState.selectedTagsForDeletion.delete(tag);
                } else {
                    AdminState.selectedTagsForDeletion.add(tag);
                }
                renderGlobalTags();
            });

            tagsWrapper.appendChild(badge);
        });

        container.appendChild(tagsWrapper);
    }

    function deleteSelectedTags() {
        if (AdminState.selectedTagsForDeletion.size === 0) {
            showToast('Nenhuma tag selecionada', 'info');
            return;
        }

        const tags = Array.from(AdminState.selectedTagsForDeletion);
        const totalCount = tags.reduce((sum, tag) => sum + (AdminState.tagCounts.get(tag) || 0), 0);

        if (!confirm(`Tem certeza que deseja remover ${tags.length} tag(s) selecionada(s) de ${totalCount} questões no total? Esta ação não pode ser desfeita!`)) {
            return;
        }

        AdminState.questions = AdminState.questions.map(q => ({
            ...q,
            tags: (q.tags || []).filter(t => {
                const tagName = typeof t === 'string' ? t : (t.name || t);
                return !AdminState.selectedTagsForDeletion.has(tagName);
            })
        }));

        tags.forEach(tag => AdminState.allTags.delete(tag));
        AdminState.selectedTagsForDeletion.clear();
        AdminState.hasUnsavedChanges = true;
        
        if (AdminState.editingQuestion) {
            AdminState.editingQuestion = null;
        }

        loadQuestions();
        showToast(`${tags.length} tag(s) removida(s) com sucesso`, 'success');
    }

    function deleteTagsWithLessThan10() {
        // Encontra todas as tags com menos de 10 ocorrências
        const tagsToDelete = [];
        AdminState.tagCounts.forEach((count, tag) => {
            if (count < 10) {
                tagsToDelete.push(tag);
            }
        });

        if (tagsToDelete.length === 0) {
            showToast('Não há tags com menos de 10 ocorrências', 'info');
            return;
        }

        const totalCount = tagsToDelete.reduce((sum, tag) => sum + (AdminState.tagCounts.get(tag) || 0), 0);

        if (!confirm(`Encontradas ${tagsToDelete.length} tags com menos de 10 usos (total de ${totalCount} ocorrências).\n\nTags que serão removidas:\n${tagsToDelete.slice(0, 10).join(', ')}${tagsToDelete.length > 10 ? `\n... e mais ${tagsToDelete.length - 10}` : ''}\n\nDeseja continuar? Esta ação não pode ser desfeita!`)) {
            return;
        }

        // Remove as tags de todas as questões
        const tagsToDeleteSet = new Set(tagsToDelete);
        AdminState.questions = AdminState.questions.map(q => ({
            ...q,
            tags: (q.tags || []).filter(t => {
                const tagName = typeof t === 'string' ? t : (t.name || t);
                return !tagsToDeleteSet.has(tagName);
            })
        }));

        // Remove das tags globais
        tagsToDelete.forEach(tag => AdminState.allTags.delete(tag));
        
        AdminState.hasUnsavedChanges = true;
        
        if (AdminState.editingQuestion) {
            AdminState.editingQuestion = null;
        }

        loadQuestions();
        showToast(`${tagsToDelete.length} tags com menos de 10 usos foram removidas!`, 'success');
    }

    function deleteGlobalTag(tagToDelete) {
        const count = AdminState.tagCounts.get(tagToDelete) || 0;

        if (!confirm(`Tem certeza que deseja remover a tag "${tagToDelete}" de ${count} questões? Esta ação não pode ser desfeita!`)) {
            return;
        }

        AdminState.questions = AdminState.questions.map(q => ({
            ...q,
            tags: (q.tags || []).filter(t => {
                const tagName = typeof t === 'string' ? t : (t.name || t);
                return tagName !== tagToDelete;
            })
        }));

        AdminState.allTags.delete(tagToDelete);
        AdminState.hasUnsavedChanges = true;
        
        if (AdminState.editingQuestion) {
            AdminState.editingQuestion = null;
        }

        loadQuestions();
        showToast(`Tag "${tagToDelete}" removida de ${count} questões`, 'success');
    }

    // ========================================
    // QUESTION EDITING
    // ========================================
    function selectQuestionForEditing(question) {
        AdminState.editingQuestion = { ...question };
        renderEditor();
        renderQuestionsList(); // Re-render to update active state
    }

    function renderEditor() {
        const container = document.getElementById('admin-editor-container');
        if (!container) return;

        if (!AdminState.editingQuestion) {
            container.innerHTML = '<div class="admin-empty-state"><p>Selecione uma pergunta na lista ao lado para começar a editar.</p></div>';
            return;
        }

        const question = AdminState.editingQuestion;
        const tagNames = question.tags ? question.tags.map(t => typeof t === 'string' ? t : t.name) : [];

        container.innerHTML = `
            <div class="admin-editor-panel">
                <div class="admin-editor-header">
                    <h3>Editando: ${question.id || 'Nova Pergunta'}</h3>
                    <button class="btn-close-editor" onclick="window.adminPanel.closeEditor()">×</button>
                </div>

                <div class="admin-editor-content">
                    <div class="form-group">
                        <label class="form-label" for="edit-id">ID da Pergunta</label>
                        <input type="text" id="edit-id" class="form-input" value="${question.id || ''}" disabled>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-question">Pergunta</label>
                        <textarea id="edit-question" class="form-textarea" rows="3">${question.pergunta || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-option-a">Opção A</label>
                        <input type="text" id="edit-option-a" class="form-input" value="${question.opcoes && question.opcoes[0] || ''}">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-option-b">Opção B</label>
                        <input type="text" id="edit-option-b" class="form-input" value="${question.opcoes && question.opcoes[1] || ''}">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-option-c">Opção C</label>
                        <input type="text" id="edit-option-c" class="form-input" value="${question.opcoes && question.opcoes[2] || ''}">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-option-d">Opção D</label>
                        <input type="text" id="edit-option-d" class="form-input" value="${question.opcoes && question.opcoes[3] || ''}">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-correct">Opção Correta (0-3)</label>
                        <select id="edit-correct" class="form-select">
                            <option value="0" ${question.resposta_correta === 0 ? 'selected' : ''}>A (0)</option>
                            <option value="1" ${question.resposta_correta === 1 ? 'selected' : ''}>B (1)</option>
                            <option value="2" ${question.resposta_correta === 2 ? 'selected' : ''}>C (2)</option>
                            <option value="3" ${question.resposta_correta === 3 ? 'selected' : ''}>D (3)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-difficulty">Dificuldade</label>
                        <select id="edit-difficulty" class="form-select">
                            <option value="1" ${question.dificuldade === 1 ? 'selected' : ''}>Fácil</option>
                            <option value="2" ${question.dificuldade === 2 ? 'selected' : ''}>Médio</option>
                            <option value="3" ${question.dificuldade === 3 ? 'selected' : ''}>Difícil</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-reference">Referência Bíblica</label>
                        <input type="text" id="edit-reference" class="form-input" value="${question.referencia || ''}">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="edit-explanation">Texto Bíblico / Explicação</label>
                        <textarea id="edit-explanation" class="form-textarea" rows="3">${question.texto_biblico || ''}</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Tags</label>
                        <div class="tags-editor">
                            <div class="tags-current" id="current-tags">
                                ${tagNames.map(tag => `
                                    <button class="tag-editable" onclick="window.adminPanel.removeTag('${tag}')">
                                        ${tag} <span style="font-weight: bold; margin-left: 0.25rem;">×</span>
                                    </button>
                                `).join('')}
                            </div>
                            <div class="tag-add-section">
                                <input 
                                    type="text" 
                                    id="tag-input" 
                                    class="tag-add-input" 
                                    placeholder="Nova tag (Enter para adicionar)"
                                    list="tag-suggestions"
                                    onkeypress="if(event.key === 'Enter') { event.preventDefault(); window.adminPanel.addTag(); }"
                                >
                                <datalist id="tag-suggestions">
                                    ${Array.from(AdminState.allTags).map(tag => `<option value="${tag}">`).join('')}
                                </datalist>
                                <button class="btn-add-tag" onclick="window.adminPanel.addTag()">Adicionar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="admin-editor-footer">
                    <button class="btn-save-question" onclick="window.adminPanel.saveQuestion()">💾 Salvar Alterações</button>
                </div>
            </div>
        `;
    }

    function addTag() {
        const input = document.getElementById('tag-input');
        if (!input || !AdminState.editingQuestion) return;

        const newTag = input.value.trim();
        if (!newTag) return;

        const currentTags = AdminState.editingQuestion.tags || [];
        const tagNames = currentTags.map(t => typeof t === 'string' ? t : t.name);

        if (tagNames.includes(newTag)) {
            showToast('Esta tag já existe nesta pergunta', 'info');
            return;
        }

        AdminState.editingQuestion.tags = [...currentTags, newTag];
        input.value = '';
        renderEditor();
    }

    function removeTag(tagToRemove) {
        if (!AdminState.editingQuestion) return;

        AdminState.editingQuestion.tags = (AdminState.editingQuestion.tags || []).filter(t => {
            const tagName = typeof t === 'string' ? t : t.name;
            return tagName !== tagToRemove;
        });

        renderEditor();
    }

    function saveQuestion() {
        if (!AdminState.editingQuestion) return;

        // Collect values from form
        const updatedQuestion = {
            ...AdminState.editingQuestion,
            pergunta: document.getElementById('edit-question').value,
            opcoes: [
                document.getElementById('edit-option-a').value,
                document.getElementById('edit-option-b').value,
                document.getElementById('edit-option-c').value,
                document.getElementById('edit-option-d').value
            ],
            resposta_correta: parseInt(document.getElementById('edit-correct').value),
            dificuldade: parseInt(document.getElementById('edit-difficulty').value),
            referencia: document.getElementById('edit-reference').value,
            texto_biblico: document.getElementById('edit-explanation').value
        };

        // Validate
        if (!updatedQuestion.pergunta || updatedQuestion.pergunta.trim() === '') {
            showToast('A pergunta não pode estar vazia', 'error');
            return;
        }

        if (updatedQuestion.opcoes.some(opt => !opt || opt.trim() === '')) {
            showToast('Todas as opções devem ser preenchidas', 'error');
            return;
        }

        // Update in main array
        const index = AdminState.questions.findIndex(q => q.id === updatedQuestion.id);
        if (index !== -1) {
            AdminState.questions[index] = updatedQuestion;
            AdminState.hasUnsavedChanges = true;
            
            showToast('Pergunta atualizada com sucesso!', 'success');
            
            // Reload to update tags and filters
            loadQuestions();
            closeEditor();
        }
    }

    function closeEditor() {
        AdminState.editingQuestion = null;
        renderEditor();
        renderQuestionsList();
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    function setupEventListeners() {
        // Search
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                AdminState.searchTerm = e.target.value;
                applyFilters();
            });
            
            // Suporte para tecla Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    AdminState.searchTerm = e.target.value;
                    applyFilters();
                }
            });
        }
        
        // Botão de busca
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                AdminState.searchTerm = searchInput ? searchInput.value : '';
                applyFilters();
            });
        }

        // Filters
        const difficultyFilter = document.getElementById('difficulty-filter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                AdminState.difficultyFilter = e.target.value;
                applyFilters();
            });
        }

        const tagFilter = document.getElementById('tag-filter');
        if (tagFilter) {
            tagFilter.addEventListener('change', (e) => {
                AdminState.tagFilter = e.target.value;
                applyFilters();
            });
        }

        // Pagination
        const prevBtn = document.getElementById('prev-page');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (AdminState.currentPage > 1) {
                    AdminState.currentPage--;
                    renderQuestionsList();
                }
            });
        }

        const nextBtn = document.getElementById('next-page');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(AdminState.filteredQuestions.length / AdminState.itemsPerPage);
                if (AdminState.currentPage < totalPages) {
                    AdminState.currentPage++;
                    renderQuestionsList();
                }
            });
        }

        // Save All
        const saveAllBtn = document.getElementById('save-all-btn');
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', saveAllQuestions);
        }

        // Back button
        const backBtn = document.getElementById('back-from-admin');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (AdminState.hasUnsavedChanges) {
                    if (!confirm('Você tem alterações não salvas. Deseja sair mesmo assim?')) {
                        return;
                    }
                }
                if (window.showView) {
                    window.showView('home-view');
                }
            });
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        setupEventListeners();
        
        // Wait for questions to load
        if (window.allQuestions && window.allQuestions.length > 0) {
            loadQuestions();
        } else {
            // Retry after a delay
            setTimeout(() => {
                if (window.allQuestions && window.allQuestions.length > 0) {
                    loadQuestions();
                } else {
                    showToast('Aguardando carregamento das questões...', 'info');
                }
            }, 1000);
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================
    window.adminPanel = {
        init,
        loadQuestions,
        saveQuestion,
        closeEditor,
        addTag,
        removeTag,
        saveAllQuestions,
        deleteTagsWithLessThan10
    };

    // Auto-init when admin view becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'admin-view' && mutation.target.classList.contains('active')) {
                init();
            }
        });
    });

    const adminView = document.getElementById('admin-view');
    if (adminView) {
        observer.observe(adminView, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Also init if already active
        if (adminView.classList.contains('active')) {
            init();
        }
    }

})();
