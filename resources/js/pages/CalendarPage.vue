<template>
    <div class="calendar-page">
        <div class="container">
            <div class="calendar-wrapper">
                <!-- Блок выбора месяца и управления навигацией -->
                <div class="calendar-month">
                    <div class="calendar-month__current">{{ formattedCurrentMonth }}</div>
                    <div class="calendar-month__arrows">
                        <img
                            class="calendar-month__arrow left"
                            :class="{ limit: isPrevDisabled }"
                            src="/images/calendar/left-arrow.svg"
                            alt="prev"
                            @click="prevMonth"
                        />
                        <img
                            class="calendar-month__arrow right"
                            :class="{ limit: isNextDisabled }"
                            src="/images/calendar/right-arrow.svg"
                            alt="next"
                            @click="nextMonth"
                        />
                    </div>
                </div>
  
                <!-- Календарь дней -->
                <div class="calendar">
                    <div class="calendar__title-days">
                        <div v-for="day in weekDays" :key="day" class="calendar__title-day">{{ day }}</div>
                    </div>
                    <div class="calendar__days">
                        <div
                            v-for="(day, index) in daysInMonth"
                            :key="index"
                            :class="{
                                'calendar__day': true,
                                'empty': day.empty,
                                'active': day.active,
                                'today': day.today,
                                'has-events': day.hasEvents
                            }"
                            @click="selectDay(day)"
                        >
                            {{ day.day }}
                        </div>
                    </div>
                </div>


                <div class="new-event">
                    <div class="new-event__settings-item service" @click="$refs.selectServicePopUp.showPopUp()">
                        <img class="new-event__settings-item__img" src="/images/icons/new-event/service.svg" alt="Услуга">
                        <div class="new-event__settings-item__content">
                            {{ formattedSelectedServices }}
                        </div>
                        <img v-if="!selectedServices.length" class="new-event__settings-item__arrow" src="/images/icons/new-event/arrow.svg" alt="Выбрать">
                        <img v-else class="new-event__settings-item__cross" src="/images/icons/new-event/cross.svg" alt="Удалить" @click.stop="removeSelectedServices">
                    </div>

                    <SelectServicePopUp ref="selectServicePopUp" @serviceSelected="handleServiceSelected" />

                    <div class="new-event__settings-item time" @click="toggleTimePicker">
                        <img class="new-event__settings-item__img" src="/images/icons/new-event/time.svg" alt="Время">
                        <div class="new-event__settings-item__content">
                            {{ selectedTime || 'Выбрать время' }}
                        </div>
                        <img 
                            v-if="!selectedTime" 
                            class="new-event__settings-item__arrow" 
                            src="/images/icons/new-event/arrow.svg" 
                            alt="Выбрать"
                        >
                        <img 
                            v-else 
                            class="new-event__settings-item__cross" 
                            src="/images/icons/new-event/cross.svg" 
                            alt="Удалить"
                            @click.stop="clearSelectedTime"
                        >
                    </div>

                    <div v-if="isTimePickerVisible" class="time-picker-wrapper">
                        <TimePickerComponent 
                            :initial-time="selectedTime"
                            @time-selected="handleTimeSelected" 
                        />
                        <button class="transfer-button" @click="handleTransfer">Применить</button>
                    </div>
                    <div class="new-event__settings-item repeat" @click="toggleRepeatMenu">
                        <img class="new-event__settings-item__img" src="/images/icons/new-event/repeat.svg" alt="Повторять">
                        <div class="new-event__settings-item__content" v-html="selectedRepeatOption || 'Повторять событие'"></div>
                        <img 
                            v-if="!selectedRepeatOption" 
                            class="new-event__settings-item__arrow" 
                            src="/images/icons/new-event/arrow.svg" 
                            alt="Выбрать"
                        >
                        <img 
                            v-else 
                            class="new-event__settings-item__cross" 
                            src="/images/icons/new-event/cross.svg" 
                            alt="Удалить"
                            @click.stop="clearSelectedRepeat"
                        >
                    </div>

                    <div v-if="isRepeatMenuVisible" class="repeat-menu-wrapper">
                        <div class="repeat-menu">
                            <div 
                                v-for="(option, index) in repeatOptions" 
                                :key="index"
                                class="repeat-menu__item"
                                v-html="option"
                                @click="selectRepeatOption(option)"
                            >
                            </div>
                        </div>
                    </div>

                    <SelectDateTimePopUp
                        :is-visible="isSelectDateTimePopUpVisible"
                        @close="closeSelectDateTimePopUp"
                        @datetime-selected="handleDateTimeSelected"
                    />

                    <div class="new-event__settings-item client" @click="$refs.selectClientPopUp.showPopUp()">
                        <img class="new-event__settings-item__img" src="/images/icons/new-event/client.svg" alt="Клиент">
                        <div class="new-event__settings-item__content">
                            {{ selectedClient ? selectedClient.name : 'Клиент' }}
                        </div>
                        <img v-if="!selectedClient" class="new-event__settings-item__arrow" src="/images/icons/new-event/arrow.svg" alt="Выбрать">
                        <img v-else class="new-event__settings-item__cross" src="/images/icons/new-event/cross.svg" alt="Удалить" @click.stop="removeSelectedClient">
                    </div>

                    <SelectClientPopUp ref="selectClientPopUp" @clientSelected="handleClientSelected" />

                    <!-- <div class="new-event__settings-item worker" @click="$refs.selectWorkerPopUp.showPopUp()">
                        <img class="new-event__settings-item__img" src="/images/icons/new-event/worker.svg" alt="Исполнитель">
                        <div class="new-event__settings-item__content">
                            {{ selectedWorker ? selectedWorker.name : 'Исполнитель' }}
                        </div>
                        <img v-if="!selectedWorker" class="new-event__settings-item__arrow" src="/images/icons/new-event/arrow.svg" alt="Выбрать">
                        <img v-else class="new-event__settings-item__cross" src="/images/icons/new-event/cross.svg" alt="Удалить" @click.stop="removeSelectedWorker">
                    </div>

                    <SelectWorkerPopUp ref="selectWorkerPopUp" @workerSelected="handleWorkerSelected" /> -->

                </div>

                <button 
                    v-if="canCreateReminder" 
                    class="create-reminder-button"
                    @click="createReminder"
                >
                    Создать напоминание
                </button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { isSameDay } from 'date-fns';
import TimePickerComponent from './TimePickerComponent.vue';
import SelectClientPopUp from '../components/SelectClientPopUp.vue';
import SelectWorkerPopUp from '../components/SelectWorkerPopUp.vue';
import SelectDateTimePopUp from '../components/SelectDateTimePopUp.vue';
import SelectServicePopUp from '../components/SelectServicePopUp.vue';
    export default {
        name: 'CalendarPage',
        components: {
            TimePickerComponent,
            SelectClientPopUp,
            SelectWorkerPopUp,
            SelectDateTimePopUp,
            SelectServicePopUp
        },
        data() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return {
                currentDate: new Date(),
                weekDays: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
                selectedDay: tomorrow,
                selectedServices: [],
                canCreateReminder: false,
                events: [],
                selectedClient: null,
                selectedWorker: null,
                selectedService: null,
                isTimePickerVisible: false,
                selectedTime: null,
                isRepeatMenuVisible: false,
                selectedRepeatOption: null,
                selectedRepeatDateTime: null,
                repeatOptions: [
                    'Не повторять',
                    'В заданную дату...'
                ],
                weekDayNames: ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'],
                weekDayPrepositions: {
                    'вторник': 'во',
                    'default': 'в'
                },
                monthNames: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
            };
        },
        created() {
            this.updateRepeatOptions();
            this.fetchEvents();
        },
        computed: {
        formattedSelectedServices() {
            if (!this.selectedServices || this.selectedServices.length === 0) return 'Услуга';
            
            return this.selectedServices.map((service, index) => {
                const name = service.name.trim();
                return index === 0 ? name : name.toLowerCase();
            }).join(', ');
        },
            isPrevDisabled() {
                const currentDate = new Date();
                return this.currentDate.getMonth() === currentDate.getMonth() && 
                       this.currentDate.getFullYear() === currentDate.getFullYear();
            },
            isNextDisabled() {
                const currentDate = new Date();
                const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 11);
                return this.currentDate.getMonth() >= maxDate.getMonth() && 
                       this.currentDate.getFullYear() >= maxDate.getFullYear();
            },
            formattedCurrentMonth() {
                const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
                return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
            },
            daysInMonth() {
                const year = this.currentDate.getFullYear();
                const month = this.currentDate.getMonth();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                
                const days = [];
                
                // Add empty days before first day of month
                const firstDayOfWeek = firstDay.getDay() || 7;
                for (let i = 1; i < firstDayOfWeek; i++) {
                    days.push({ day: '', empty: true });
                }
                
                // Add days of month
                for (let i = 1; i <= lastDay.getDate(); i++) {
                    days.push({
                        day: i,
                        empty: false,
                        active: this.selectedDay && 
                               this.selectedDay.getDate() === i && 
                               this.selectedDay.getMonth() === this.currentDate.getMonth() && 
                               this.selectedDay.getFullYear() === this.currentDate.getFullYear(),
                        today: this.isToday(i),
                        hasEvents: this.hasEvents(i)
                    });
                }
                
                // Add empty days after last day of month
                const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
                for (let i = 0; i < remainingDays; i++) {
                    days.push({ day: '', empty: true });
                }
                
                return days;
            }
        },
        methods: {
            handleClientSelected(client) {
                this.selectedClient = client;
                this.updateCanCreateReminder();
            },
            removeSelectedClient() {
                this.selectedClient = null;
                this.updateCanCreateReminder();
            },
            prevMonth() {
                if (!this.isPrevDisabled) {
                    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
                }
            },
            nextMonth() {
                if (!this.isNextDisabled) {
                    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
                }
            },
            selectDay(day) {
                if (!day.empty) {
                    this.selectedDay = new Date(
                        this.currentDate.getFullYear(),
                        this.currentDate.getMonth(),
                        day.day
                    );
                    this.updateRepeatOptions();
                    if (this.selectedRepeatOption && this.selectedRepeatOption.includes('Каждую неделю')) {
                        const weekDay = this.weekDayNames[this.selectedDay.getDay()];
                        this.selectedRepeatOption = `Каждую неделю (${this.weekDayPrepositions[weekDay] || this.weekDayPrepositions.default} ${weekDay})`;
                    } else if (this.selectedRepeatOption && this.selectedRepeatOption.includes('Каждые две недели')) {
                        const weekDay = this.weekDayNames[this.selectedDay.getDay()];
                        this.selectedRepeatOption = `Каждые две недели (${this.weekDayPrepositions[weekDay] || this.weekDayPrepositions.default} ${weekDay})`;
                    } else if (this.selectedRepeatOption && this.selectedRepeatOption.includes('Каждый месяц')) {
                        this.selectedRepeatOption = `Каждый месяц (${this.selectedDay.getDate()} числа)`;
                    }
                }
            },
            updateRepeatOptions() {
                if (!this.selectedDay) {
                    this.repeatOptions = [
                        'Не повторять',
                        'В заданную дату...'
                    ];
                    return;
                }

                const weekDay = this.weekDayNames[this.selectedDay.getDay()];
                const dayOfMonth = this.selectedDay.getDate();

                const dateTimeOption = this.selectedRepeatDateTime ? 
                    `В заданную дату <span style="color: #2481CC">(${this.weekDays[this.selectedRepeatDateTime.getDay() === 0 ? 6 : this.selectedRepeatDateTime.getDay() - 1]}, ${String(this.selectedRepeatDateTime.getDate()).padStart(2, '0')} ${this.monthNames[this.selectedRepeatDateTime.getMonth()]}., ${String(this.selectedRepeatDateTime.getHours()).padStart(2, '0')}:${String(this.selectedRepeatDateTime.getMinutes()).padStart(2, '0')})</span>` : 
                    'В заданную дату <span style="color: #2481CC">...</span>';

                this.repeatOptions = [
                    'Не повторять',
                    `Каждую неделю <span style="color: #2481CC">(${this.weekDayPrepositions[weekDay] || this.weekDayPrepositions.default} ${weekDay})</span>`,
                    `Каждые две недели <span style="color: #2481CC">(${this.weekDayPrepositions[weekDay] || this.weekDayPrepositions.default} ${weekDay})</span>`,
                    `Каждый месяц <span style="color: #2481CC">(${dayOfMonth} числа)</span>`,
                    dateTimeOption
                ];
            },
            isToday(day) {
                const today = new Date();
                return day === today.getDate() && 
                       this.currentDate.getMonth() === today.getMonth() && 
                       this.currentDate.getFullYear() === today.getFullYear();
            },
            hasEvents(day) {
                return this.events.some(event => {
                    const eventDate = new Date(event.event_time);
                    const localEventDate = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000);
                    const compareDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
                    return isSameDay(localEventDate, compareDate);
                });
            },
            toggleTimePicker() {
                this.isTimePickerVisible = !this.isTimePickerVisible;
                this.updateCanCreateReminder();
            },
            
            handleTimeSelected(time) {
                this.selectedTime = time;
                this.updateCanCreateReminder();
            },
            handleTransfer() {
                this.isTimePickerVisible = false;
                this.updateCanCreateReminder();
            },
            clearSelectedTime() {
                this.selectedTime = null;
                this.updateCanCreateReminder();
            },
            toggleRepeatMenu() {
                this.isRepeatMenuVisible = !this.isRepeatMenuVisible;
            },
            selectRepeatOption(option) {
                if (option.includes('В заданную дату')) {
                    this.isSelectDateTimePopUpVisible = true;
                    if (this.selectedRepeatDateTime) {
                        const dayName = this.weekDays[this.selectedRepeatDateTime.getDay() === 0 ? 6 : this.selectedRepeatDateTime.getDay() - 1];
                        const day = String(this.selectedRepeatDateTime.getDate()).padStart(2, '0');
                        const month = this.monthNames[this.selectedRepeatDateTime.getMonth()];
                        const hours = String(this.selectedRepeatDateTime.getHours()).padStart(2, '0');
                        const minutes = String(this.selectedRepeatDateTime.getMinutes()).padStart(2, '0');
                        
                        this.selectedRepeatOption = `В заданную дату <span style="color: #2481CC">(${dayName}, ${day} ${month}., ${hours}:${minutes})</span>`;
                    } else {
                        this.selectedRepeatOption = 'В заданную дату <span style="color: #2481CC">...</span>';
                    }
                } else {
                    this.selectedRepeatOption = option;
                }
                this.isRepeatMenuVisible = false;
                this.updateCanCreateReminder();
            },

            clearSelectedRepeat() {
                this.selectedRepeatOption = null;
                this.selectedRepeatDateTime = null;
                this.updateRepeatOptions();
                this.updateCanCreateReminder();
            },
            handleWorkerSelected(worker) {
                this.selectedWorker = worker;
                this.updateCanCreateReminder();
            },
            removeSelectedWorker() {
                this.selectedWorker = null;
                this.updateCanCreateReminder();
            },
            updateCanCreateReminder() {
                this.canCreateReminder = !!this.selectedTime && 
                    !!this.selectedClient && 
                    // !!this.selectedWorker && 
                    !!this.selectedRepeatOption &&
                    this.selectedServices.length > 0 &&
                    !this.isTimePickerVisible;
            },
            async createReminder() {
                try {
                    const eventData = this.prepareEventData();
                    await window.axios.post('/event', eventData);
                    await this.fetchEvents();
                    this.clearForm();
                } catch (error) {
                    console.error('Error creating event:', error);
                }
            },
            clearForm() {
                this.selectedServices = [];
                this.selectedClient = null;
                this.selectedWorker = null;
                this.selectedTime = null;
                this.selectedRepeatOption = null;
                this.selectedRepeatDateTime = null;
                this.isTimePickerVisible = false;
                this.isRepeatMenuVisible = false;
                this.updateCanCreateReminder();
            },
            prepareEventData() {
                const eventData = {
                    service_ids: this.selectedServices.map(service => service.id),
                    event_time: null,
                    client_id: this.selectedClient?.id,
                    repeat_type: null,
                    target_time: null
                };

                if (this.selectedDay && this.selectedTime) {
                    const [time, period] = this.selectedTime.split(' ');
                    let [hours, minutes] = time.split(':');
                    hours = parseInt(hours);
                    if (period === 'PM' && hours < 12) {
                        hours += 12;
                    } else if (period === 'AM' && hours === 12) {
                        hours = 0;
                    }
                    const eventDateTime = new Date(this.selectedDay);
                    eventDateTime.setHours(hours);
                    eventDateTime.setMinutes(parseInt(minutes));
                    eventData.event_time = eventDateTime.toISOString().slice(0, 19).replace('T', ' ');
                }

                if (this.selectedRepeatOption) {
                    if (this.selectedRepeatOption.includes('Каждую неделю')) {
                        eventData.repeat_type = 'weekly';
                    } else if (this.selectedRepeatOption.includes('Каждые две недели')) {
                        eventData.repeat_type = 'biweekly';
                    } else if (this.selectedRepeatOption.includes('Каждый месяц')) {
                        eventData.repeat_type = 'monthly';
                    }
                }

                if (this.selectedRepeatOption?.includes('В заданную дату') && this.selectedRepeatDateTime) {
                    eventData.target_time = this.selectedRepeatDateTime.toISOString().slice(0, 19).replace('T', ' ');
                }

                return eventData;
            },
            handleServiceSelected(services) {
                this.selectedServices = services;
                this.updateCanCreateReminder();
            },
            removeSelectedServices() {
                this.selectedServices = [];
                this.updateCanCreateReminder();
            },
            showSelectDateTimePopUp() {
                this.isSelectDateTimePopUpVisible = true;
            },
            closeSelectDateTimePopUp() {
                this.isSelectDateTimePopUpVisible = false;
            },
            handleDateTimeSelected(dateTime) {
                this.selectedRepeatDateTime = dateTime.date;
                
                const dayName = this.weekDays[dateTime.date.getDay() === 0 ? 6 : dateTime.date.getDay() - 1];
                const day = String(dateTime.date.getDate()).padStart(2, '0');
                const month = this.monthNames[dateTime.date.getMonth()];
                const hours = String(dateTime.date.getHours()).padStart(2, '0');
                const minutes = String(dateTime.date.getMinutes()).padStart(2, '0');
                
                this.selectedRepeatOption = `В заданную дату <span style="color: #2481CC">(${dayName}, ${day} ${month}., ${hours}:${minutes})</span>`;
                this.updateCanCreateReminder();
            },
            async fetchEvents() {
                try {
                    const response = await window.axios.get('/events/company');
                    this.events = response.data.data;
                } catch (error) {
                    console.error('Error fetching events:', error);
                }
            },
        }
    };
</script>


<style scoped>
    .calendar{
        margin-bottom: 20px;
    }

    .calendar__day.active {
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
    }

    .calendar__day.has-events::after{
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--theme-accent-color-blue);

        position: absolute;
        bottom: 2px;
        right: 0;
        left: 0;
        margin: 0 auto;
    }

    .calendar__day.has-events.active::after{
        background: #FFFFFF;
    }

    .calendar__day.active {
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
    }

    .calendar__day.today {
        background: #F8F8F8;
        border: 1px solid var(--theme-accent-color-blue);
    }

    .calendar__day.active.today{
        background: var(--theme-accent-color-blue);
    }
    
    .calendar-month__arrow.limit {
        opacity: 0.5;
        pointer-events: none;
    }

    .repeat-menu {
        display: flex;
        flex-direction: column;
    }

    .repeat-menu__item {
        padding: 12px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .repeat-menu__item:hover {
        background-color: #F8F8F8;
    }

    .repeat-menu__item:not(:last-child) {
        border-bottom: 1px solid #F0F0F0;
    }

    .create-reminder-button {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 400px;
        padding: 12px;
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        transition: opacity 0.3s;
    }

    .create-reminder-button:hover {
        opacity: 1;
    }
</style>

<style scoped>
    .calendar-month{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 24px;
        margin-bottom: 12px;
    }
    .calendar__title-days{
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        height: 32px;
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: var(--theme-text-color-gray);
    }
    .calendar__title-day{
        width: 12%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .calendar__days{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
    }

    .calendar__day{
        position: relative;
        width: 12%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 4px;
        border-radius: 6px;
        cursor: pointer;
    }

    .calendar__day.has-events::after{
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--theme-accent-color-blue);

        position: absolute;
        bottom: 2px;
        right: 0;
        left: 0;
        margin: 0 auto;
    }

    .calendar__day.has-events.active::after{
        background: #FFFFFF;
    }

    .calendar__day.empty{
        color: var(--theme-text-color-gray);
    }

    .calendar-month__arrows{
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .calendar-month__arrow{
        width: 30px;
        height: 30px;
        cursor: pointer;
    }

    .calendar-content{
        flex-grow: 1; 
        display: flex;
        flex-direction: column;
    }

    .calendar-content .container{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .calendar-wrapper{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding-bottom: 71px;
    }

    .selected-day{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin-bottom: 84px;
    }

    .new-event{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 8px;
    }

    .new-event__settings-item{
        width: 100%;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 12px;
        border-radius: 8px;
        background: var(--theme-bg-color-white);
    }

    .new-event__settings-item__img,
    .new-event__settings-item__arrow,
    .new-event__settings-item__cross{
        width: 20px;
        height: 20px;
    }

    .new-event__settings-item__cross{
        display: block;
        cursor: pointer;
    }

    .new-event__settings-item__content{
        flex-grow: 1;
    }
    .repeat-menu-wrapper {
        margin-top: 8px;
        background: var(--theme-bg-color-white);
        border-radius: 8px;
        overflow: hidden;
    }
</style>

<style>
    .time-picker-wrapper {
        border-radius: 8px;
        padding: 16px 0;
    }

    .transfer-button {
        width: 100%;
        padding: 12px;
        margin-top: 16px;
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
    }

    .transfer-button:hover {
        opacity: 1;
    }
</style>



