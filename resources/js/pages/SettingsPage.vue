<template>
    <div class="settings-page">
        <div class="container">
            <SelectTimeZonePopUp ref="selectTimeZonePopUp" @zoneSelected="handleZoneSelected" />
            <div class="settings">
                <div class="settings__item">
                    <div class="settings__item__title">
                        Название компании
                    </div>
                    <div class="settings__item__content settings-inputs">
                        <input type="text" class="settings__content-block settings__input" v-model="companyName" placeholder="Введите название компании">
                        <input type="text" class="settings__content-block settings__input" v-model="companyAddress" placeholder="Адрес">
                    </div>
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
            </div>
        </div>
    </div>
</template>

<script>
import SelectTimeZonePopUp from '../components/SelectTimeZonePopUp.vue';
import DeleteCompanyPopUp from '../components/DeleteCompanyPopUp.vue';

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
            companyName: 'Николай бизнес',
            companyAddress: 'Адрес',
        }
    },
    methods: {
        handleZoneSelected(zone) {
            this.selectedTimeZone = zone.code;
        },
        deleteCompany(){
            this.$refs.DeleteCompanyPopUp.showPopUp();
        },
        deleteCompanyConfirm(){
            console.log('Удаляем компанию');
        }
    }
}
</script>

<style scoped>
    .settings-page{
        padding-top: 12px;
    }

    .settings{
        max-width: 400px;
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
</style>