<template>
    <div v-if="isVisible" class="popup-overlay" @click.self="closePopUp">
        <div class="popup-content">
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
                    <div class="new-event__settings-item time" @click="toggleTimePicker">
                        <img class="new-event__settings-item__img" src="/images/icons/new-event/time.svg" alt="Время">
                        <div class="new-event__settings-item__content">
                            <template v-if="selectedTime">
                                <span class="date-part">{{ formattedSelectedDate }}</span>
                                <span class="time-part">{{ selectedTime }}</span>
                            </template>
                            <template v-else>Выбрать время</template>
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
                </div>
            </div>

            
        </div>
        </div>
    </div>
</template>
  
<script>
import TimePickerComponent from '../pages/TimePickerComponent.vue';
    export default {
        name: 'SelectDateTimePopUp',
        components: {
            TimePickerComponent,
        },
        props: {
            isVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return {
                currentDate: new Date(),
                weekDays: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
                selectedDay: tomorrow,
                events: [],
                selectedClient: null,
                selectedWorker: null,
                isTimePickerVisible: false,
                selectedTime: null,
                isRepeatMenuVisible: false,
                selectedRepeatOption: null,
                repeatOptions: [
                    'Не повторять',
                    'В заданную дату...'
                ],
                selectedRepeatDateTime: null,
                weekDayNames: ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'],
                shortWeekDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
                weekDayPrepositions: {
                    'вторник': 'во',
                    'default': 'в'
                },
                selectedCustomDateTime: null
            };
        },
        computed: {
            formattedSelectedDate() {
                if (!this.selectedDay) return '';
                const day = this.shortWeekDays[this.selectedDay.getDay()];
                const date = this.selectedDay.getDate();
                const month = this.months[this.selectedDay.getMonth()];
                return `${day}, ${date} ${month}.,`;
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
                
                const firstDayOfWeek = firstDay.getDay() || 7;
                for (let i = 1; i < firstDayOfWeek; i++) {
                    days.push({ day: '', empty: true });
                }
                
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
                
                const remainingDays = 42 - days.length;
                for (let i = 0; i < remainingDays; i++) {
                    days.push({ day: '', empty: true });
                }
                
                return days;
            }
        },
        methods: {
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
                }
            },
            isToday(day) {
                const today = new Date();
                return day === today.getDate() && 
                       this.currentDate.getMonth() === today.getMonth() && 
                       this.currentDate.getFullYear() === today.getFullYear();
            },
            hasEvents(day) {
                return this.events.some(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getDate() === day && 
                           eventDate.getMonth() === this.currentDate.getMonth() && 
                           eventDate.getFullYear() === this.currentDate.getFullYear();
                });
            },
            toggleTimePicker() {
                this.isTimePickerVisible = !this.isTimePickerVisible;
            },
            handleTimeSelected(time) {
                this.selectedTime = time;
            },
            handleTransfer() {
                if (this.selectedDay && this.selectedTime) {
                    const [time, period] = this.selectedTime.split(' ');
                    let [hours, minutes] = time.split(':');
                    
                    // Convert to 24-hour format if needed
                    hours = parseInt(hours);
                    if (period === 'PM' && hours < 12) {
                        hours += 12;
                    } else if (period === 'AM' && hours === 12) {
                        hours = 0;
                    }
                    
                    const selectedDateTime = new Date(this.selectedDay);
                    selectedDateTime.setHours(hours);
                    selectedDateTime.setMinutes(parseInt(minutes));
                    
                    // Format datetime as YYYY-MM-DD HH:mm:ss
                    const year = selectedDateTime.getFullYear();
                    const month = String(selectedDateTime.getMonth() + 1).padStart(2, '0');
                    const day = String(selectedDateTime.getDate()).padStart(2, '0');
                    const formattedHours = String(selectedDateTime.getHours()).padStart(2, '0');
                    const formattedMinutes = String(selectedDateTime.getMinutes()).padStart(2, '0');
                    const formattedDateTime = `${year}-${month}-${day} ${formattedHours}:${formattedMinutes}:00`;
                    
                    this.$emit('datetime-selected', { date: selectedDateTime, formattedDateTime });
                    this.closePopUp();
                }
                this.isTimePickerVisible = false;
            },
            clearSelectedTime() {
                this.selectedTime = null;
            },
            closePopUp() {
                this.$emit('close');
            },
            confirmSelection() {
                if (this.selectedDay && this.selectedTime) {
                    const [hours, minutes] = this.selectedTime.split(':');
                    const selectedDateTime = new Date(this.selectedDay);
                    selectedDateTime.setHours(parseInt(hours));
                    selectedDateTime.setMinutes(parseInt(minutes));
                    
                    const dayName = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'][selectedDateTime.getDay()];
                    const day = selectedDateTime.getDate();
                    const month = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][selectedDateTime.getMonth()];
                    
                    const formattedDateTime = `В заданную дату <span style="color: #2481CC">(${dayName}, ${day} ${month}., ${hours}:${minutes})</span>`;
                    this.$emit('datetime-selected', { date: selectedDateTime, formattedText: formattedDateTime });
                    this.closePopUp();
                }
            }
        }
    };
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: #efeff3;
}

.popup-content {
    background: white;
    border-radius: 8px;
    width: 100%;
    height: 100%;
    max-width: 400px;
    background-color: #efeff3;
    overflow-y: scroll;
}

.calendar {
    margin-bottom: 20px;
}

.calendar__day.active {
    background: var(--theme-accent-color-blue);
    color: var(--theme-bg-color-white);
}

.calendar__day.today {
    background: #F8F8F8;
    border: 1px solid var(--theme-accent-color-blue);
}

.calendar-month__arrow.limit {
    opacity: 0.5;
    pointer-events: none;
}

.date-part {
    margin-right: 4px;
    font-family: Microsoft Sans Serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 16.98px;
    letter-spacing: 0px;
    color: #707579;
}

.time-part{
    font-family: Microsoft Sans Serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 16.98px;
    letter-spacing: 0px;
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

    .calendar__day.active{
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
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
</style>

<style scoped>
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
    }
    .selected-day{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin-bottom: 84px;
    }
</style>

<style scoped>
  .new-event{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .new-event__settings-item{
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 12px;
    border: none;
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
        opacity: 0.9;
    }
</style>
