<template>
    <div class="settings-page">
        <div class="container">
            <SelectTimeZonePopUp ref="selectTimeZonePopUp" @zoneSelected="handleZoneSelected" />
            <div class="settings">
                <div class="settings__item">
                    <div class="settings__item__title">
                        Компания
                    </div>
                    <div class="settings__item__content settings-inputs" @click.self="hideKeyboard">
                        <div class="company-image-wrapper">
                            <div class="company-image" :style="{ backgroundColor: !company.image ? getAvatarColor(companyName) : 'transparent' }">
                                <template v-if="company.image">
                                    <img class="company-image__img" :src="company.image" alt="" />
                                </template>
                                <template v-else>
                                    <span class="avatar-letter">{{ companyName.charAt(0).toUpperCase() }}</span>
                                </template>
                            </div>
                            <label class="company-image-upload">
                                <input type="file" accept="image/*" @change="handleImageUpload" style="display: none">
                                <img src="/images/icons/camera.svg" alt="Upload" class="company-image-upload__icon">
                            </label>
                        </div>
                        <input 
                            ref="nameInput"
                            type="text" 
                            class="settings__content-block settings__input" 
                            v-model="companyName" 
                            placeholder="Введите название компании"
                            @keyup.enter="hideKeyboard"
                            @blur="onInputBlur"
                        >
                        <input 
                            ref="addressInput"
                            type="text" 
                            class="settings__content-block settings__input" 
                            v-model="companyAddress" 
                            placeholder="Адрес"
                            @keyup.enter="hideKeyboard"
                            @blur="onInputBlur"
                        >
                    </div>
                    <div class="settings__input-error" v-if="nameError">{{ nameError }}</div>
                    <div class="settings__input-error" v-if="addressError">{{ addressError }}</div>
                </div>

                <div class="settings__item">
                    <div class="settings__item__title">
                        Время
                    </div>
                    <div class="settings__item__content">
                        <div class="settings__content-block time-zone" @click="$refs.selectTimeZonePopUp.showPopUp()">
                            <div class="time-zone__text">
                                Часовой пояс
                            </div>
                            <div class="time-zone__value">
                                {{selectedTimeZone}}
                            </div>
                            <img class="time-zone__arrow" src="/images/icons/new-event/arrow.svg">
                        </div>
                    </div>
                </div>

                <div class="settings__item">
                    <div class="settings__item__title">
                        Уведомления
                    </div>
                    <div class="settings__item__content">
                        <div class="notification-settings">
                            <div class="notification-item">
                                <div class="notification-item__text">Действия клиента</div>
                                <label class="switch">
                                    <input type="checkbox" v-model="clientActionsNotifications">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="notification-item">
                                <div class="notification-item__text">Повтор событий</div>
                                <label class="switch">
                                    <input type="checkbox" v-model="eventRepeatNotifications">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings__item">
                    <div class="settings__item__title">
                        Управление
                    </div>
                    <div class="settings__item__content">
                        <div class="settings__content-block delete-company">
                            <div class="delete-company__text">
                                Удалить компанию
                            </div>
                            <div class="delete-company__delete-btn" @click="deleteCompany">
                                Удалить
                            </div>
                        </div>
                    </div>
                    <DeleteCompanyPopUp ref="DeleteCompanyPopUp" @deleteCompanyConfirm="deleteCompanyConfirm" />

                </div>

                <div class="settings__apply-btn" @click="applySettings" v-if="hasChanges">
                    Сохранить
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import notification from '../services/notification';
import SelectTimeZonePopUp from '../components/SelectTimeZonePopUp.vue';
import DeleteCompanyPopUp from '../components/DeleteCompanyPopUp.vue';
import { telegramAuth } from '../services/auth';

export default {
    name: 'SettingsPage',
    components: {
        SelectTimeZonePopUp,
        DeleteCompanyPopUp
    },
    data() {
        return {
            clientActionsNotifications: true,
            eventRepeatNotifications: false,
            selectedTimeZone: '+7',
            companyName: '',
            companyAddress: '',
            company: {},
            initialCompanyName: '',
            initialCompanyAddress: '',
            nameError: '',
            addressError: '',
            selectedImageFile: null
        }
    },
    async created() {
        try {
            const response = await window.axios.get('/companies');
            this.company = response.data.data[0];
            this.companyName = this.company.name || '';
            this.companyAddress = this.company.address || '';
            this.initialCompanyName = this.companyName;
            this.initialCompanyAddress = this.companyAddress;
        } catch (error) {
            console.error('Failed to fetch company data:', error);
        }
    },
    computed: {
        hasChanges() {
            return this.companyName !== this.initialCompanyName || 
                   this.companyAddress !== this.initialCompanyAddress ||
                   this.selectedImageFile !== null;
        }
    },
    methods: {
        async fetchCompanyData() {
            try {
                const response = await window.axios.get('/companies');
                this.company = response.data.data[0];
                this.companyName = this.company.name || '';
                this.companyAddress = this.company.address || '';
                this.initialCompanyName = this.companyName;
                this.initialCompanyAddress = this.companyAddress;
            } catch (error) {
                console.error('Failed to fetch company data:', error);
            }
        },
        handleZoneSelected(zone) {
            this.selectedTimeZone = zone.code;
        },
        deleteCompany(){
            this.$refs.DeleteCompanyPopUp.showPopUp();
        },
        async deleteCompanyConfirm() {
            try {
                await axios.delete(`/companies/${this.company.id}`);
                this.$refs.DeleteCompanyPopUp.closePopUp();
                await telegramAuth.logout();
                await telegramAuth.login();
                await this.fetchCompanyData();
            } catch (error) {
                console.error('Failed to delete company:', error);
            }
        },
        async applySettings() {
            this.nameError = '';
            this.addressError = '';
            
            if (!this.companyName.trim()) {
                this.nameError = 'Поле Название Компании обязательно для заполнения.';
                return;
            }
            if (!this.companyAddress.trim()) {
                this.addressError = 'Поле Адрес обязательно для заполнения.';
                return;
            }
            
            try {
                // Отправляем данные компании
                const updateData = {
                    name: this.companyName,
                    address: this.companyAddress
                };
                await axios.put(`/companies/${this.company.id}`, updateData);

                // Если есть новое изображение, отправляем его отдельным запросом
                if (this.selectedImageFile) {
                    console.log('Selected file:', this.selectedImageFile);
                    
                    const formData = new FormData();
                    formData.append('image', this.selectedImageFile, this.selectedImageFile.name);
                    
                    // Проверяем содержимое FormData
                    for (let pair of formData.entries()) {
                        console.log(pair[0] + ': ' + pair[1]);
                    }
                    
                    try {
                        const response = await axios.put(`/companies/${this.company.id}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            transformRequest: [(data, headers) => {
                                // Удаляем Content-Type, чтобы браузер сам установил его с boundary
                                delete headers['Content-Type'];
                                return data;
                            }]
                        });
                        console.log('Image upload response:', response);
                    } catch (error) {
                        console.error('Image upload error:', error);
                        throw error;
                    }
                }
                
                await this.fetchCompanyData();
                notification.show({
                    text: 'Настройки сохранены',
                    type: 'success'
                });
                this.$router.replace('/');
            } catch (error) {
                console.error('Failed to update company:', error);
                notification.show({
                    text: 'Не удалось сохранить настройки',
                    type: 'info'
                });
            }
        },
        hideKeyboard(event) {
            // Для iOS: программно скрываем клавиатуру
            if (this.$refs.nameInput === document.activeElement) {
                this.$refs.nameInput.blur();
            }
            if (this.$refs.addressInput === document.activeElement) {
                this.$refs.addressInput.blur();
            }
            
            // Добавляем задержку для iOS
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        },
        
        onInputBlur() {
            // Фикс для Safari: предотвращаем залипание клавиатуры
            document.body.classList.add('keyboard-closed');
            setTimeout(() => {
                document.body.classList.remove('keyboard-closed');
            }, 100);
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedImageFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.company.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        getAvatarColor(name) {
            const colors = [
                '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
                '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
                '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
                '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
            ];
            const charCode = name.charCodeAt(0);
            return colors[charCode % colors.length];
        }
    }
}
</script>

<style scoped>
    .settings-page{
        padding-top: 12px;
    }

    .settings{
        /* max-width: 400px; */
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .settings__item{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .settings__item__title{
        width: 100%;
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 14.71px;
        letter-spacing: 0px;
        color: #707579;
        text-transform: uppercase;
    }
    .settings__item__content{
        width: 100%;
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 16.98px;
        letter-spacing: 0px;
        color: #000000;
    }
    .settings__content-block{
        width: 100%;
        background: #FFFFFF;
        border-radius: 12px;
        padding: 12px;
        height: 44px;
    }

    .settings-inputs{
        background: #FFFFFF;
        border-radius: 12px;
    }

    .settings__input{
        border: none;
        outline: none;
    }

    .settings__input+.settings__input{
        border-top: 1px solid #F4F4F5;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .time-zone{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .time-zone__arrow{
        width: 20px;
        height: 20px;
    }
    .time-zone__value{
        margin-right: 4px;
        color: #707579;
    }
    .time-zone__text{
        flex-grow: 1;
    }

    .delete-company{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .delete-company__delete-btn{
        color: #E53935;
        cursor: pointer;
    }

    .notification-settings {
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
        border-radius: 12px;
    }

    .notification-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        position: relative;
    }

    .notification-item+.notification-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #F4F4F5;

    }

    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 30px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #EFEFF4;
        transition: .4s;
        border-radius: 100px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #007AFF;
    }

    input:checked + .slider:before {
        transform: translateX(20px);
    }


    .settings__apply-btn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: calc(100% - 16px*2);
        padding: 16px;
        background: #3390EC;
        box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        color: #FFFFFF;
        border-radius: 12px;
        cursor: pointer;
        z-index: 36;
        margin: 0 16px 12px;
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 16.98px;
        letter-spacing: 0px;
    }

    .settings__input-error {
        color: #E53935;
        font-size: 12px;
        margin-top: 4px;
        padding: 0 12px;
    }

    .company-image-wrapper {
        position: relative;
        width: 100%;
        height: 100px;
        border-radius: 12px;
        overflow: hidden;
    }

    .company-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
    }

    .company-image__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-letter {
        font-size: 24px;
        font-weight: bold;
    }

    .company-image-upload {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }

    .company-image-upload__icon {
        width: 16px;
        height: 16px;
    }
</style>

