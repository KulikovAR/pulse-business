<template>
    <div class="reminder-page">
        <ReminderSinglePageItem 
            ref="ReminderSinglePageItem"
            @showCancelPopUp="showCancelPopUp"
            @showConfirmPopUp="showConfirmPopUp"
        />
        <CancelAppointmentPopUp 
            ref="CancelAppointmentPopUp"
            @cancel="cancel"
        />
        <ConfirmAppointmentPopUp
            ref="ConfirmAppointmentPopUp"
            @confirm="confirm"
        />
    </div>
</template>

<script>
import ReminderSinglePageItem from "../components/ReminderSinglePageItem.vue";
import CancelAppointmentPopUp from "../components/CancelAppointmentPopUp.vue";
import ConfirmAppointmentPopUp from '../components/ConfirmAppointmentPopUp.vue';
export default {
    name: 'ReminderPage',
    components: {
        ReminderSinglePageItem,
        CancelAppointmentPopUp,
        ConfirmAppointmentPopUp
    },
    methods: {
        showCancelPopUp(){
            this.$refs.CancelAppointmentPopUp.showPopUp();
        },
        showConfirmPopUp(){
            this.$refs.ConfirmAppointmentPopUp.showPopUp();
        },
        cancel(){
            this.$refs.CancelAppointmentPopUp.closePopUp();

            this.$refs.ReminderSinglePageItem.cancel();
        },
        confirm(){
            this.$refs.ConfirmAppointmentPopUp.closePopUp();

            this.$refs.ReminderSinglePageItem.confirm();
        }
    }
}
</script>

<style scoped>
    .reminder-page {
        display: flex;
        flex-direction: column; /* Устанавливаем вертикальное расположение */
        min-height: 100vh; /* Гарантируем высоту страницы на весь экран */
    }
</style>