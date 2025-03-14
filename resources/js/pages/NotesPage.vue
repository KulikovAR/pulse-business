<template>
    <div class="notes-page">
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
                  'today': isToday(day),
                  'has-events': hasEvents(day),
                  'active': isActive(day)
                }"
                @click="selectDate(day)"
              >
                {{ day?.getDate() || '' }}
              </div>
            </div>
          </div>
  
          <!-- Список событий -->
          <div class="current-events__list">
            <div v-for="event in filteredEvents" :key="event.dateTime" class="current-event__item">
              <div class="current-event__item__title">
                <div class="current-event__item__client-photo">
                  <img class="current-event__item__client-photo__img" :src="event.clientPhoto" alt="" />
                </div>
                <div class="current-event__item__client-name">{{ event.clientName }}</div>
              </div>
              <div class="current-event__item__event-name">{{ event.eventName }}</div>
              <div class="current-event__item__event-time">
                <span class="current-event-time">Время: </span>{{ formatTime(event.dateTime) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { format, startOfMonth, endOfMonth, addMonths, subMonths, getDay, isSameDay, isToday } from 'date-fns';
  import { ru } from 'date-fns/locale';
  
  export default {
    name: 'NotesPage',
    data() {
      return {
        currentDate: new Date(),
        selectedDate: new Date(),
        events: [
          {
            clientPhoto: 'images/clients/1.jpg',
            clientName: 'den_nedlin',
            eventName: 'Стрижка волос, уход за бородой',
            dateTime: '2025-03-01T06:00:00.000Z',
          },
          {
            clientPhoto: 'images/clients/2.jpg',
            clientName: 'SachkaProg',
            eventName: 'Уход за бородой',
            dateTime: '2025-03-01T07:30:00.000Z',
          },
          {
            clientPhoto: 'images/clients/3.jpg',
            clientName: 'sidenko_showman',
            eventName: 'Стрижка волос',
            dateTime: '2025-03-01T09:00:00.000Z',
          },
          {
            clientPhoto: 'images/clients/1.jpg',
            clientName: 'den_nedlin',
            eventName: 'Стрижка волос, уход за бородой',
            dateTime: '2025-03-02T12:00:00.000Z',
          },
          {
            clientPhoto: 'images/clients/2.jpg',
            clientName: 'SachkaProg',
            eventName: 'Уход за бородой',
            dateTime: '2025-03-02T13:45:00.000Z',
          },
          {
            clientPhoto: 'images/clients/3.jpg',
            clientName: 'sidenko_showman',
            eventName: 'Стрижка волос',
            dateTime: '2025-03-03T14:15:00.000Z',
          },
          {
            clientPhoto: 'images/clients/3.jpg',
            clientName: 'sidenko_showman',
            eventName: 'Стрижка волос',
            dateTime: '2025-04-04T14:15:00.000Z',
          },
        ],
      };
    },
    computed: {
      weekDays() {
        return ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
      },
      formattedCurrentMonth() {
            const formattedMonth = format(this.currentDate, 'LLLL yyyy', { locale: ru });
            return formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);
        },
      daysInMonth() {
        const start = startOfMonth(this.currentDate);
        const end = endOfMonth(this.currentDate);
        const days = [];
  
        const startDay = getDay(start) || 7;
        for (let i = 1; i < startDay; i++) {
          days.push(null);
        }
  
        for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
          days.push(new Date(day));
        }

        const remainingDays = 7 - (days.length % 7);
        if (remainingDays < 7) {
          for (let i = 0; i < remainingDays; i++) {
            days.push(null);
          }
        }
        return days;
      },
      filteredEvents() {
        return this.events.filter((event) =>
          isSameDay(new Date(event.dateTime), this.selectedDate)
        );
      },
      isPrevDisabled() {
        return this.currentDate <= new Date();
      },
      isNextDisabled() {
        const oneYearAhead = addMonths(new Date(), 11);
        return this.currentDate >= oneYearAhead;
      },
    },
    methods: {
      prevMonth() {
        if (!this.isPrevDisabled) {
          this.currentDate = subMonths(this.currentDate, 1);
        }
      },
      nextMonth() {
        if (!this.isNextDisabled) {
          this.currentDate = addMonths(this.currentDate, 1);
        }
      },
      isToday(date) {
        return date && isToday(date);
      },
      hasEvents(date) {
        return this.events.some((event) => isSameDay(new Date(event.dateTime), date));
      },
      isActive(date) {
        return isSameDay(date, this.selectedDate);
      },
      selectDate(date) {
        if (date) {
          this.selectedDate = date;
        }
      },
      formatTime(dateTime) {
        return format(new Date(dateTime), 'HH:mm');
      },
    },
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
  
    .calendar__day.today {
        background: #F8F8F8;
        border: 1px solid var(--theme-accent-color-blue);
    }
    
    .calendar-month__arrow.limit {
        opacity: 0.5;
        pointer-events: none;
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
    .current-events__list{
        display: flex;
        flex-direction: column;
    }

    .current-event__item{
        display: flex;
        flex-direction: column;
        padding: 12px;
        border-radius: 12px;
        background: #FFFFFF;
        margin-bottom: 8px;
    }

    .current-event__item__title{
        display: flex;
        flex-direction: row;
        align-items: center;

        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: #000;


        margin-bottom: 8px;
    }

    .current-event__item__client-photo {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background-color: var(--theme-bg-color-white);

        margin-right: 8px;
    }

    .current-event__item__client-photo__img {
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
    }

    .current-event__item__event-name{
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: #000;
        margin-bottom: 12px;
    }

    .current-event__item__event-time{
        font-family: Microsoft Sans Serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 14.71px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        
    }

    .current-event-time{
        color: #707579;
    }
    
</style>

