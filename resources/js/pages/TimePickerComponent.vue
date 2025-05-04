<template>
    <div class="time-picker">
      <!-- Крутилка для часов -->
      <div
        class="picker-item"
        ref="hourPicker"
        @wheel="handleScroll('hour', $event)"
        @touchstart="handleTouchStart('hour', $event)"
        @touchmove="handleTouchMove($event)"
        @touchend="handleTouchEnd"
      >
        <div
          class="picker-elements"
          :style="{ transform: `translateY(${hourOffset}px)` }"
        >
          <div
            v-for="(hour, index) in hours"
            :key="'hour-' + index"
            :class="['picker-element', { active: index === selectedHourIndex }]"
          >
            {{ hour }}
          </div>
        </div>
      </div>
  
      <!-- Крутилка для минут -->
      <div
        class="picker-item"
        ref="minutePicker"
        @wheel="handleScroll('minute', $event)"
        @touchstart="handleTouchStart('minute', $event)"
        @touchmove="handleTouchMove($event)"
        @touchend="handleTouchEnd"
      >
        <div
          class="picker-elements"
          :style="{ transform: `translateY(${minuteOffset}px)` }"
        >
          <div
            v-for="(minute, index) in minutes"
            :key="'minute-' + index"
            :class="['picker-element', { active: index === selectedMinuteIndex }]"
          >
            {{ minute }}
          </div>
        </div>
      </div>
  
      <!-- Крутилка для AM/PM -->
      <!-- <div
        class="picker-item"
        ref="periodPicker"
        @wheel="handleScroll('period', $event)"
        @touchstart="handleTouchStart('period', $event)"
        @touchmove="handleTouchMove($event)"
        @touchend="handleTouchEnd"
      >
        <div
          class="picker-elements"
          :style="{ transform: `translateY(${periodOffset}px)` }"
        >
          <div
            v-for="(period, index) in periods"
            :key="'period-' + index"
            :class="['picker-element', { active: index === selectedPeriodIndex }]"
          >
            {{ period }}
          </div>
        </div>
      </div> -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'TimePickerComponent',
    props: {
      initialTime: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        hours: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')), // Updated to 0-23 hours
        minutes: Array.from({ length: 60 }, (_, i) => (i < 10 ? '0' : '') + i),
        selectedHourIndex: 0,
        selectedMinuteIndex: 0,
        elementHeight: 40,
        touchStartY: 0,
        touchMoveOffset: 0,
        activeType: null,
        isAnimating: false,
        sensitivity: 2,
      };
    },
    computed: {
      hourOffset() {
        return -this.selectedHourIndex * this.elementHeight - this.elementHeight / 2 + (this.activeType === 'hour' ? this.touchMoveOffset : 0);
      },
      minuteOffset() {
        return -this.selectedMinuteIndex * this.elementHeight - this.elementHeight / 2 + (this.activeType === 'minute' ? this.touchMoveOffset : 0);
      },
      formattedTime() {
        const hour = this.hours[this.selectedHourIndex];
        const minute = this.minutes[this.selectedMinuteIndex];
        return `${hour}:${minute}`; // Updated to remove period
      }
    },
    watch: {
      formattedTime: {
        handler(newTime) {
          this.$emit('time-selected', newTime);
        }
      },
      initialTime: {
        immediate: true,
        handler(newTime) {
          if (newTime) {
            this.initializeFromTime(newTime);
          }
        }
      }
    },
    methods: {
      initializeFromTime(timeString) {
        const [hour, minute] = timeString.split(':');
        this.selectedHourIndex = this.hours.findIndex(h => h === hour);
        this.selectedMinuteIndex = this.minutes.findIndex(m => m === minute);
      },
      handleScroll(type, event) {
        if (event.target.closest('.picker-item')) {
          event.preventDefault(); // Отключаем прокрутку только внутри picker-item
          const delta = Math.sign(event.deltaY);
          this.updateIndex(type, delta);
        }
      },
      handleTouchStart(type, event) {
        event.preventDefault(); // Prevent page scrolling
        this.activeType = type;
        this.touchStartY = event.touches[0].clientY;
        this.touchMoveOffset = 0;
      },
      handleTouchMove(event) {
        event.preventDefault(); // Prevent page scrolling
        if (!this.activeType) return;
        const currentY = event.touches[0].clientY;
        this.touchMoveOffset = (currentY - this.touchStartY) * this.sensitivity;
      },
      handleTouchEnd() {
        if (!this.activeType) return;
  
        const deltaIndex = Math.round(this.touchMoveOffset / this.elementHeight);
        this.updateIndex(this.activeType, -deltaIndex);
  
        this.touchMoveOffset = 0;
        this.activeType = null;
      },
      updateIndex(type, delta) {
        if (this.isAnimating) return;
  
        let selectedIndex;
        let maxIndex;
        let minIndex = 0;
  
        if (type === 'hour') {
          selectedIndex = this.selectedHourIndex;
          maxIndex = this.hours.length - 1;
        } else if (type === 'minute') {
          selectedIndex = this.selectedMinuteIndex;
          maxIndex = this.minutes.length - 1;
        } else if (type === 'period') {
          selectedIndex = this.selectedPeriodIndex;
          maxIndex = this.periods.length - 1;
        }
  
        const nextIndex = selectedIndex + delta;
  
        if (nextIndex < 0) {
          if (type === 'hour') this.selectedHourIndex = 0;
          if (type === 'minute') this.selectedMinuteIndex = 0;
          if (type === 'period') this.selectedPeriodIndex = 0;
          this.touchMoveOffset = 0;
          return;
        }
  
        if (nextIndex > maxIndex) {
          if (type === 'hour') this.selectedHourIndex = maxIndex;
          if (type === 'minute') this.selectedMinuteIndex = maxIndex;
          if (type === 'period') this.selectedPeriodIndex = maxIndex;
          this.touchMoveOffset = 0;
          return;
        }
  
        if (type === 'hour') this.selectedHourIndex = nextIndex;
        if (type === 'minute') this.selectedMinuteIndex = nextIndex;
        if (type === 'period') this.selectedPeriodIndex = nextIndex;
  
        this.touchMoveOffset = 0;
      },

    },
    mounted() {
      if (this.initialTime) {
        this.initializeFromTime(this.initialTime);
      }
      this.$emit('time-selected', this.formattedTime);
    },
  };
  </script>
  
<style scoped>
  .time-picker {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 30px;
    height: 120px;
    z-index: 1;
  }
  
  .time-picker::after {
    position: absolute;
    content: '';
    width: 180px;
    height: 40px;
    background: #fff;
    border-radius: 8px;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    z-index: -1;
  }
  
  .separator {
    margin: 0 10px;
    font-size: 35px;
    display: flex;
    align-items: center;
  }
  
  .picker-item {
    width: 70px;
    height: 120px;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Microsoft Sans Serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 21.6px;
    text-align: left;
  }
  
  .picker-elements {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    transition: transform 0.3s ease-out;
  }
  
  .picker-element {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    opacity: 0.6;
    transition: opacity 0.3s, font-size 0.3s;
  }
  
  .picker-element.active {
    opacity: 1;
    font-size: 24px;
    font-weight: bold;
    color: #000;
  }
</style>