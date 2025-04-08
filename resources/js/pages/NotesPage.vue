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
          <router-link v-for="event in filteredEvents" :key="event.event_time" :to="{ name:'reminder-page', params: { id: event.id } }" :class="['current-event__item status', { 'cancelled': event.status === 'cancelled', 'unread': event.status === 'unread', 'confirmed': event.status === 'confirmed' }]">
            <div class="current-event__item__title">
              <div class="current-event__item__client-photo" :style="{ backgroundColor: !event.company_client.photo ? getAvatarColor(event.company_client.name) : 'transparent' }">
                <template v-if="event.company_client.photo">
                  <img class="current-event__item__client-photo__img" :src="event.company_client.photo" alt="" />
                </template>
                <template v-else>
                  <span class="avatar-letter">{{ event.company_client.name.charAt(0).toUpperCase() }}</span>
                </template>
              </div>
              <div class="current-event__item__client-name">{{ event.company_client.name }}</div>
            </div>
            <div class="current-event__item__event-name">{{ formatServiceNames(event.services) }}</div>

            <!-- <div class="current-event__item__event-time">
              <span class="current-event-time">Время: </span>{{ formatTime(event.event_time) }}
            </div> -->

            <div class="current-event__item__service-date-time">
              <div class="current-event__item__service-time">
                  <img class="current-event__item__service-time__img" src="/images/reminder/time.svg">
                  <span class="service-time">{{this.getServiceTime(event.event_time)}}</span>
              </div>
              <div class="current-event__item__service-date">
                  <img class="current-event__item__service-time__img" src="/images/reminder/date.svg">
                  <span class="service-time">{{this.getServiceDate(event.event_time)}}</span>
              </div>
            </div>

          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, startOfMonth, endOfMonth, addMonths, subMonths, getDay, isSameDay, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import axios from 'axios';

export default {
  name: 'NotesPage',
  data() {
    return {
      currentDate: new Date(),
      selectedDate: new Date(),
      events: [],
      loading: false,
      error: null
    };
  },
  created() {
    this.fetchEvents();
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
      const allEvents = this.events.flatMap(event => [
        event,
        ...(event.repeats?.map(repeat => ({
          ...event,
          event_time: repeat.event_time
        })) || [])
      ]);
      
      return allEvents.filter((event) => {
        const eventDate = new Date(event.event_time);
        const localEventDate = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000);
        return isSameDay(localEventDate, this.selectedDate);
      });
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
    getAvatarColor(name) {
      const colors = [
        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
        '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
        '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
        '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
      ];
      const charCode = name.charCodeAt(0);
      return colors[charCode % colors.length];
    },
    async fetchEvents() {
      this.loading = true;
      this.error = null;
      try {
        const response = await window.axios.get('/events/company');
        this.events = response.data.data;
        console.log(response);
      } catch (error) {
        this.error = 'Failed to fetch events';
        console.error('Error fetching events:', error);
      } finally {
        this.loading = false;
      }
    },
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
      return this.events.some(event => {
          // Check original event date
          const originalDate = new Date(event.event_time);
          const localOriginal = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);
          
          // Check all repeat dates
          const repeatDates = event.repeats?.map(repeat => {
              const repeatDate = new Date(repeat.event_time);
              return new Date(repeatDate.getTime() - repeatDate.getTimezoneOffset() * 60000);
          }) || [];
          
          return isSameDay(localOriginal, date) || 
                     repeatDates.some(repeatDate => isSameDay(repeatDate, date));
      });
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
      const eventDate = new Date(dateTime);
      const localEventDate = new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000);
      return format(localEventDate, 'HH:mm');
    },
    formatServiceNames(services) {
      if (!services || !services.length) return '';
      const serviceNames = services.map(service => service.name);
      serviceNames[0] = serviceNames[0].charAt(0).toUpperCase() + serviceNames[0].slice(1);
      return serviceNames.join(', ');
    },
    getServiceTime(date_time){
      const originalDate = new Date(date_time);
      const date = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);
      // Извлекаем часы и минуты, добавляя ведущий ноль при необходимости
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const time = `${hours}:${minutes}`;
      // console.log(time);
      return time;
    },
    getServiceDate(date_time){
      const originalDate = new Date(date_time);
      const date = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);
      // Format day and month with leading zeros
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      // Get short weekday name in Russian
      const weekdays = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      const weekday = weekdays[date.getDay()];
      return `${day}.${month}. ${weekday}`;
    }
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
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 12px;
      border-radius: 12px;
      background: #FFFFFF;
      margin-bottom: 8px;
  }

  .current-event__item.status::after{
      content: 'Отменено';
      width: 70px;
      height: 23px;

      font-family: Microsoft Sans Serif;
      font-weight: 400;
      font-size: 13px;
      line-height: 100%;
      letter-spacing: 0px;

      position: absolute;
      bottom: 12px;
      right: 12px;

      display: flex;
      justify-content: center;
      align-items: center;

      /* border: 1px solid var(--theme-destructive-color); */
      border-radius: 6px;
      background: #E5393526;
      color: #E53935;
  }

  .current-event__item.cancelled::after{
      content: 'Отменено';
      width: 70px;

      background: #E5393526;
      color: #E53935;
  }

  .current-event__item.unread::after{
      content: 'Не подтверждено';
      width: 116px;

      background: #EDEDEE;
      color: #707579;
  }

  .current-event__item.confirmed::after{
      content: 'Подтверждено';
      width: 99px;

      background: #3390EC26;
      color: #3390EC;
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

  .avatar-letter {
      color: white;
      font-size: 16px;
      font-weight: 500;
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

  /* .current-event__item__event-time{
      font-family: Microsoft Sans Serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 14.71px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      
  } */

  .current-event__item__service-date-time{
      display: flex;
      align-items: center;
  }
  .current-event__item__service-time{
      font-family: Microsoft Sans Serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 14.71px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      display: flex;
      align-items: center;
  }
  .current-event__item__service-time__img{
      width: 16px;
      height: 16px;
      margin-right: 4px;
  }
  .current-event__item__service-date{
      display: flex;
      align-items: center;
      margin-left: 12px;
  }
  span.service-time{
      font-family: Microsoft Sans Serif;
      font-weight: 400;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0px;
      color: #000000;
      display: flex;
      height: 16px;
      align-items: center;
  }

  .current-event-time{
      color: #707579;
  }
  
</style>

