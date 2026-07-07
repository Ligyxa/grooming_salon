document.addEventListener('DOMContentLoaded', function() {
    // ===== БУРГЕР-МЕНЮ =====
    const burgerBtn = document.getElementById('burger-btn');
    const mainNav = document.querySelector('.nav');
    const body = document.body;

    if (burgerBtn && mainNav) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        body.appendChild(overlay);

        function toggleMenu() {
            burgerBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        }

        burgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', toggleMenu);

        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                toggleMenu();
            }
        });

        // ИСПРАВЛЕНО: условие совпадает с CSS (max-width: 800px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 800 && mainNav.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                mainNav.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // ===== СЛАЙДЕР СРАВНЕНИЯ (ДО/ПОСЛЕ) =====
    const compareSliders = document.querySelectorAll('.image-compare');
    
    compareSliders.forEach(container => {
        const sliderHandle = container.querySelector('.slider-handle');
        const imgAfter = container.querySelector('.img-after');
        const sliderLine = container.querySelector('.slider-line');
        let isDragging = false;
        
        function updateSlider(clientX) {
            const rect = container.getBoundingClientRect();
            let position = (clientX - rect.left) / rect.width;
            position = Math.max(0, Math.min(1, position));
            
            imgAfter.style.clipPath = `inset(0 ${(1 - position) * 100}% 0 0)`;
            sliderHandle.style.left = `${position * 100}%`;
            sliderLine.style.left = `${position * 100}%`;
        }
        
        sliderHandle.addEventListener('mousedown', function(e) {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                updateSlider(e.clientX);
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        sliderHandle.addEventListener('touchstart', function(e) {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                const touch = e.touches[0];
                updateSlider(touch.clientX);
            }
        });
        
        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    });

    // ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК "ДЛЯ СОБАК" / "ДЛЯ КОШЕК" =====
    document.querySelectorAll('.service-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.service-group').forEach(group => group.style.display = 'none');
            
            const target = this.dataset.target;
            const group = document.getElementById(`services-${target}`);
            if (group) {
                group.style.display = 'grid';
            }
        });
    });

    // ===== МОДАЛЬНОЕ ОКНО (закрытие) =====
    const modal = document.getElementById('modal-overlay');
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ===== ОБРАБОТЧИК КЛИКА НА ЗАГОЛОВКИ УСЛУГ =====
    document.querySelectorAll('.service-card h3').forEach(title => {
        title.addEventListener('click', function() {
            const serviceKey = this.getAttribute('data-service');
            if (serviceKey) {
                openModal(serviceKey);
            }
        });
    });

    // Обработчик клика на крестик модального окна
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal();
        });
    }

    // ===== SUCCESS OVERLAY (закрытие) =====
    const successOverlay = document.getElementById('success-overlay');
    
    if (successOverlay) {
        successOverlay.addEventListener('click', function(e) {
            if (e.target === successOverlay) {
                closeSuccessOverlay();
            }
        });
    }

    // ===== ВАЛИДАЦИЯ ФОРМЫ =====
    const bookingForm = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');

    if (bookingForm) {
        const phoneInput = document.getElementById('phone');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                
                let formattedValue = '';
                if (value.length > 0) {
                    if (value[0] === '7' || value[0] === '8') {
                        formattedValue = '+' + value[0];
                        if (value.length > 1) {
                            formattedValue += '(' + value.slice(1, 4);
                        }
                        if (value.length > 4) {
                            formattedValue += ')' + value.slice(4, 7);
                        }
                        if (value.length > 7) {
                            formattedValue += '-' + value.slice(7, 9);
                        }
                        if (value.length > 9) {
                            formattedValue += '-' + value.slice(9, 11);
                        }
                    } else {
                        formattedValue = '+' + value;
                    }
                }
                
                this.value = formattedValue;
                validatePhone();
            });
        }
        
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
                validateName();
            });
        }
        
        const breedInput = document.getElementById('breed');
        if (breedInput) {
            breedInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
                validateBreed();
            });
        }
        
        const petTypeSelect = document.getElementById('pet-type');
        const serviceSelect = document.getElementById('service');
        
        if (petTypeSelect && serviceSelect) {
            const allOptions = Array.from(serviceSelect.options).map(option => ({
                value: option.value,
                text: option.text
            }));
            
            petTypeSelect.addEventListener('change', function() {
                const selectedPet = this.value;
                
                serviceSelect.innerHTML = '';
                
                allOptions.forEach(option => {
                    if (selectedPet === 'Кошка' && option.text === 'SPA-процедуры') {
                        return;
                    }
                    
                    const optElement = document.createElement('option');
                    optElement.value = option.value;
                    optElement.text = option.text;
                    serviceSelect.appendChild(optElement);
                });
                
                if (selectedPet === 'Кошка' && serviceSelect.value === 'SPA-процедуры') {
                    serviceSelect.value = '';
                }
                
                validateService();
                checkFormValidity();
            });
        }
        
        const dateInput = document.getElementById('date');
        const agreementCheckbox = document.getElementById('agreement');
        
        if (petTypeSelect) {
            petTypeSelect.addEventListener('change', function() {
                validatePetType();
                checkFormValidity();
            });
        }
        
        if (serviceSelect) {
            serviceSelect.addEventListener('change', function() {
                validateService();
                checkFormValidity();
            });
        }
        
        if (dateInput) {
            dateInput.addEventListener('change', function() {
                validateDate();
                checkFormValidity();
            });
        }
        
        if (agreementCheckbox) {
            agreementCheckbox.addEventListener('change', function() {
                validateAgreement();
                checkFormValidity();
            });
        }
        
        // Отправка формы
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isPetTypeValid = validatePetType();
            const isBreedValid = validateBreed();
            const isServiceValid = validateService();
            const isDateValid = validateDate();
            const isAgreementValid = validateAgreement();
            
            if (isNameValid && isPhoneValid && isPetTypeValid && isBreedValid && 
                isServiceValid && isDateValid && isAgreementValid) {
                
                const formData = {
                    name: nameInput.value,
                    phone: phoneInput.value,
                    petType: petTypeSelect.value,
                    breed: breedInput.value,
                    service: serviceSelect.value,
                    date: dateInput.value
                };
                
                console.log('Форма отправлена:', formData);
                
                const successOverlay = document.getElementById('success-overlay');
                if (successOverlay) {
                    successOverlay.classList.add('active');
                }
                
                bookingForm.reset();
                if (submitBtn) submitBtn.disabled = true;
                
                document.querySelectorAll('.form-control').forEach(input => {
                    input.classList.remove('success', 'error');
                });
                document.querySelectorAll('.error-message').forEach(span => {
                    span.textContent = '';
                });
                
                if (serviceSelect && petTypeSelect) {
                    const allOptions = [
                        { value: '', text: 'Выберите' },
                        { value: 'Комплекс', text: 'Комплекс' },
                        { value: 'Стрижка', text: 'Стрижка' },
                        { value: 'Экспресс линька', text: 'Экспресс линька' },
                        { value: 'Подрезание когтей', text: 'Подрезание когтей' },
                        { value: 'Купание', text: 'Купание' },
                        { value: 'Чистка ушей', text: 'Чистка ушей' },
                        { value: 'SPA-процедуры', text: 'SPA-процедуры' }
                    ];
                    
                    serviceSelect.innerHTML = '';
                    allOptions.forEach(option => {
                        const optElement = document.createElement('option');
                        optElement.value = option.value;
                        optElement.text = option.text;
                        serviceSelect.appendChild(optElement);
                    });
                }
            }
        });
    }

    // Обновляем checkFormValidity при каждом вводе
    const inputs = document.querySelectorAll('#booking-form input, #booking-form select');
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('change', checkFormValidity);
    });
});

// ===== МОДАЛЬНОЕ ОКНО (глобальные функции) =====
const modal = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

const services = {
    'complex': {
        title: 'КОМПЛЕКС ДЛЯ СОБАК',
        breeds: [
            { name: 'Мелкие породы', time: '2,5-3 часа', note: 'Просим принять во внимание, что в стоимость комплекса не входит вычесывание колтунов', price: '4400' },
            { name: 'Средние породы', time: '2,5-3 часа', note: 'Просим принять во внимание, что в стоимость комплекса не входит вычесывание колтунов', price: '4800' },
            { name: 'Большие породы', time: '2,5-3 часа', note: 'Просим принять во внимание, что в стоимость комплекса не входит вычесывание колтунов', price: '5000' }
        ]
    },
    'haircut': {
        title: 'СТРИЖКА ДЛЯ СОБАК',
        breeds: [
            { name: 'Мелкие породы', time: '1-1,5 часа', note: 'Просим принять во внимание, что в стоимость стрижки входит вычесывание колтунов', price: '1500' },
            { name: 'Средние породы', time: '1-1,5 часа', note: 'Просим принять во внимание, что в стоимость стрижки входит вычесывание колтунов', price: '1600' },
            { name: 'Большие породы', time: '1-1,5 часа', note: 'Просим принять во внимание, что в стоимость стрижки входит вычесывание колтунов', price: '1700' }
        ]
    },
    'shedding': {
        title: 'ЭКСПРЕСС ЛИНЬКА ДЛЯ СОБАК',
        breeds: [
            { name: 'Мелкие породы', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость линьки входит вычесывание колтунов', price: '2300' },
            { name: 'Средние породы', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость линьки входит вычесывание колтунов', price: '2500' },
            { name: 'Большие породы', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость линьки входит вычесывание колтунов', price: '2700' }
        ]
    },
    'nails': {
        title: 'ПОДРЕЗАНИЕ КОГТЕЙ ДЛЯ СОБАК',
        breeds: [
            { name: 'Мелкие породы', time: '15-30 минут', note: 'В подстрижке когтей используются специальные инструменты', price: '400' },
            { name: 'Средние породы', time: '15-30 минут', note: 'В подстрижке когтей используются специальные инструменты', price: '450' },
            { name: 'Большие породы', time: '15-30 минут', note: 'В подстрижке когтей используются специальные инструменты', price: '500' }
        ]
    },
    'bathing': {
        title: 'КУПАНИЕ ДЛЯ СОБАК',
        breeds: [
            { name: 'Мелкие породы', time: '1,5-2 часа', note: 'Сушка питомца входит в стоимость', price: '2000' },
            { name: 'Средние породы', time: '1,5-2 часа', note: 'Сушка питомца входит в стоимость', price: '2400' },
            { name: 'Большие породы', time: '1,5-2 часа', note: 'Сушка питомца входит в стоимость', price: '2600' }
        ]
    },
    'ears': {
        title: 'ЧИСТКА УШЕЙ ДЛЯ СОБАК',
        breeds: [
            { name: 'Мелкие породы', time: '10-15 минут', note: 'Никаких ватных палочек во время чистки', price: '300' },
            { name: 'Средние породы', time: '10-15 минут', note: 'Никаких ватных палочек во время чистки', price: '350' },
            { name: 'Большие породы', time: '10-15 минут', note: 'Никаких ватных палочек во время чистки', price: '400' }
        ]
    },
    'spa': {
        title: 'SPA-ПРОЦЕДУРЫ ДЛЯ СОБАК',
        breeds: [
            { name: 'Мелкие породы', time: '1-1,5 часа', note: 'Маска наносится по типу шерсти', price: '800' },
            { name: 'Средние породы', time: '1-1,5 часа', note: 'Маска наносится по типу шерсти', price: '1000' },
            { name: 'Большие породы', time: '1-1,5 часа', note: 'Маска наносится по типу шерсти', price: '1200' }
        ]
    },
    'cat_complex': {
        title: 'КОМПЛЕКС ДЛЯ КОШЕК',
        breeds: [
            { name: 'Длинношёрстные', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость комплекса не входит вычесывание колтунов', price: '4400' },
            { name: 'Короткошерстные', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость комплекса не входит вычесывание колтунов', price: '4200' },
            { name: 'Бесшёрстные', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость комплекса не входит вычесывание колтунов', price: '4000' }
        ]
    },
    'cat_haircut': {
        title: 'СТРИЖКА ДЛЯ КОШЕК',
        breeds: [
            { name: 'Длинношёрстные', time: '1-1,5 часа', note: 'Просим принять во внимание, что в стоимость стрижки входит вычесывание колтунов', price: '2000' },
            { name: 'Короткошерстные', time: '1-1,5 часа', note: 'Просим принять во внимание, что в стоимость стрижки входит вычесывание колтунов', price: '1600' }
        ]
    },
    'cat_shedding': {
        title: 'ЭКСПРЕСС ЛИНЬКА ДЛЯ КОШЕК',
        breeds: [
            { name: 'Длинношёрстные', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость линьки входит вычесывание колтунов', price: '2700' },
            { name: 'Короткошерстные', time: '2-2,5 часа', note: 'Просим принять во внимание, что в стоимость линьки входит вычесывание колтунов', price: '2500' }
        ]
    },
    'cat_nails': {
        title: 'ПОДРЕЗАНИЕ КОГТЕЙ ДЛЯ КОШЕК',
        breeds: [
            { name: 'Все породы', time: '15-30 минут', note: 'В подстрижке когтей используются специальные инструменты', price: '400' }
        ]
    },
    'cat_bathing': {
        title: 'КУПАНИЕ ДЛЯ КОШЕК',
        breeds: [
            { name: 'Длинношёрстные', time: '1,5-2 часа', note: 'Сушка питомца входит в стоимость', price: '2700' },
            { name: 'Короткошерстные', time: '1,5-2 часа', note: 'Сушка питомца входит в стоимость', price: '2400' },
            { name: 'Бесшёрстные', time: '1,5-2 часа', note: 'Сушка питомца входит в стоимость', price: '2200' }
        ]
    },
    'cat_ears': {
        title: 'ЧИСТКА УШЕЙ ДЛЯ КОШЕК',
        breeds: [
            { name: 'Все породы', time: '10-15 минут', note: 'Никаких ватных палочек во время чистки', price: '300' }
        ]
    },
};

function openModal(serviceKey) {
    const service = services[serviceKey];
    if (service && modal) {
        modalTitle.textContent = service.title;
        
        let bodyHTML = '';
        service.breeds.forEach(breed => {
            bodyHTML += `
                <h4>${breed.name}:</h4>
                <p><span class="time">${breed.time}</span> <span class="description">• ${breed.note}</span></p>
                <span class="price">${breed.price} руб.</span>
            `;
        });
        
        modalBody.innerHTML = bodyHTML;
        modal.classList.add('active');
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeSuccessOverlay() {
    const successOverlay = document.getElementById('success-overlay');
    if (successOverlay) {
        successOverlay.classList.remove('active');
    }
}

function scrollToBooking() {
    closeModal();
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Функции валидации
function validateName() {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!nameInput || !nameError) return false;
    
    const value = nameInput.value.trim();
    
    if (!value) {
        nameError.textContent = 'Введите ваше имя';
        nameInput.classList.add('error');
        nameInput.classList.remove('success');
        return false;
    } else if (value.length < 2) {
        nameError.textContent = 'Имя должно содержать минимум 2 буквы';
        nameInput.classList.add('error');
        nameInput.classList.remove('success');
        return false;
    } else if (/\d/.test(value)) {
        nameError.textContent = 'Имя не должно содержать цифры';
        nameInput.classList.add('error');
        nameInput.classList.remove('success');
        return false;
    } else {
        nameError.textContent = '';
        nameInput.classList.remove('error');
        nameInput.classList.add('success');
        return true;
    }
}

function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    if (!phoneInput || !phoneError) return false;
    
    const value = phoneInput.value.replace(/\D/g, '');
    
    if (!value) {
        phoneError.textContent = 'Введите номер телефона';
        phoneInput.classList.add('error');
        phoneInput.classList.remove('success');
        return false;
    } else if (value.length !== 11) {
        phoneError.textContent = 'Номер телефона должен содержать 11 цифр';
        phoneInput.classList.add('error');
        phoneInput.classList.remove('success');
        return false;
    } else if (value[0] !== '7' && value[0] !== '8') {
        phoneError.textContent = 'Номер должен начинаться с +7 или 8';
        phoneInput.classList.add('error');
        phoneInput.classList.remove('success');
        return false;
    } else {
        phoneError.textContent = '';
        phoneInput.classList.remove('error');
        phoneInput.classList.add('success');
        return true;
    }
}

function validatePetType() {
    const petTypeSelect = document.getElementById('pet-type');
    const petTypeError = document.getElementById('pet-type-error');
    if (!petTypeSelect || !petTypeError) return false;
    
    if (!petTypeSelect.value) {
        petTypeError.textContent = 'Выберите тип питомца';
        petTypeSelect.classList.add('error');
        petTypeSelect.classList.remove('success');
        return false;
    } else {
        petTypeError.textContent = '';
        petTypeSelect.classList.remove('error');
        petTypeSelect.classList.add('success');
        return true;
    }
}

function validateBreed() {
    const breedInput = document.getElementById('breed');
    const breedError = document.getElementById('breed-error');
    if (!breedInput || !breedError) return false;
    
    const value = breedInput.value.trim();
    
    if (!value) {
        breedError.textContent = 'Введите породу питомца';
        breedInput.classList.add('error');
        breedInput.classList.remove('success');
        return false;
    } else if (/\d/.test(value)) {
        breedError.textContent = 'Порода не должна содержать цифры';
        breedInput.classList.add('error');
        breedInput.classList.remove('success');
        return false;
    } else {
        breedError.textContent = '';
        breedInput.classList.remove('error');
        breedInput.classList.add('success');
        return true;
    }
}

function validateService() {
    const serviceSelect = document.getElementById('service');
    const serviceError = document.getElementById('service-error');
    if (!serviceSelect || !serviceError) return false;
    
    if (!serviceSelect.value) {
        serviceError.textContent = 'Выберите услугу';
        serviceSelect.classList.add('error');
        serviceSelect.classList.remove('success');
        return false;
    } else {
        serviceError.textContent = '';
        serviceSelect.classList.remove('error');
        serviceSelect.classList.add('success');
        return true;
    }
}

function validateDate() {
    const dateInput = document.getElementById('date');
    const dateError = document.getElementById('date-error');
    if (!dateInput || !dateError) return false;
    
    if (!dateInput.value) {
        dateError.textContent = 'Выберите дату визита';
        dateInput.classList.add('error');
        dateInput.classList.remove('success');
        return false;
    } else {
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            dateError.textContent = 'Дата не может быть в прошлом';
            dateInput.classList.add('error');
            dateInput.classList.remove('success');
            return false;
        }
        
        dateError.textContent = '';
        dateInput.classList.remove('error');
        dateInput.classList.add('success');
        return true;
    }
}

function validateAgreement() {
    const agreementCheckbox = document.getElementById('agreement');
    const agreementError = document.getElementById('agreement-error');
    if (!agreementCheckbox || !agreementError) return false;
    
    if (!agreementCheckbox.checked) {
        agreementError.textContent = 'Необходимо принять пользовательское соглашение';
        return false;
    } else {
        agreementError.textContent = '';
        return true;
    }
}

function checkFormValidity() {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const petTypeSelect = document.getElementById('pet-type');
    const breedInput = document.getElementById('breed');
    const serviceSelect = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const agreementCheckbox = document.getElementById('agreement');
    
    const isNameValid = nameInput && nameInput.value.trim().length >= 2;
    const isPhoneValid = phoneInput && phoneInput.value.replace(/\D/g, '').length === 11;
    const isPetTypeValid = petTypeSelect && petTypeSelect.value !== '';
    const isBreedValid = breedInput && breedInput.value.trim().length > 0;
    const isServiceValid = serviceSelect && serviceSelect.value !== '';
    const isDateValid = dateInput && dateInput.value !== '';
    const isAgreementChecked = agreementCheckbox && agreementCheckbox.checked;
    
    if (isNameValid && isPhoneValid && isPetTypeValid && isBreedValid && 
        isServiceValid && isDateValid && isAgreementChecked) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}