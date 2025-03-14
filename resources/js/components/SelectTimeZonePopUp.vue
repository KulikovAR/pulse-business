<template>
    <div class="select-timezone__pop-up">
        <div class="select-timezone__pop-up__frame">
            <div class="timezones">
                <div class="timezones-search">
                    <div class="timezones-search__wrapper">
                        <input 
                            class="timezones-search__input" 
                            type="text" 
                            placeholder=" " 
                            v-model="searchQuery" />
                        <div class="timezones-search__placeholder">
                            <img class="timezones-search__icon" src="/images/icons/search-icon.svg" alt="Search Icon">
                            <span class="timezones-search__text">Начните вводить</span>
                        </div>
                    </div>
                </div>

                <div class="select-timezone__pop-up__title">
                    Часовой пояс
                </div>

                <div class="timezones__list">
                    <div
                        v-for="(zone, index) in filteredZones"
                        :key="index"
                        class="timezones__item"
                        :class="{ active: selectedZone && selectedZone === zone }"
                        @click="toggleZoneSelection(zone)"
                    >
                        <div class="timezones__item__content-name">
                            {{zone.city}} {{zone.code}}
                        </div>
                        <img v-if="selectedZone && selectedZone === zone" class="timezones__item__check" src="/images/icons/selected.svg" alt="Selected">
                    </div>
                </div>
            </div>

            <div class="select-timezone__pop-up__apply-btn" @click="applySelection" v-if="selectedZone">
                Применить
            </div>
        </div>

        <div class="select-timezone__pop-up__bg" @click="closePopUp"></div>
    </div>
</template>

<script>
export default {
    name: 'SelectTimeZonePopUp',
    data() {
        return {
            searchQuery: "",
            selectedZone: null,
            zones: [
                { 
                    city: 'Москва',
                    code: '+3'
                },
                { 
                    city: 'Канада',
                    code: '+6'
                },
                { 
                    city: 'Афины',
                    code: '+2'
                },
                { 
                    city: 'Рим',
                    code: '+2'
                }
            ]
        }
    },
    methods: {
        closePopUp() {
            document.querySelector('.select-timezone__pop-up').style.display = "none";
        },
        showPopUp() {
            document.querySelector('.select-timezone__pop-up').style.display = "block";
        },
        toggleZoneSelection(zone) {
            if (this.selectedZone && this.selectedZone.city === zone.city) {
                this.selectedZone = null;
            } else {
                this.selectedZone = zone;
            }
        },
        applySelection() {
            if (this.selectedZone) {
                this.$emit('zoneSelected', this.selectedZone);
                this.closePopUp();
            }
        }
    },
    computed: {
        filteredZones() {
            const query = this.searchQuery.toLowerCase().trim();
            return this.zones.filter((zone) =>
                zone.city.toLowerCase().includes(query) ||
                zone.code.toLowerCase().includes(query)
            );
        }
    }
}
</script>

<style scoped>
.select-timezone__pop-up {
    position: fixed;
    width: 100%;
    height: 100%;
    display: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    z-index: 25;
}

.select-timezone__pop-up__frame {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    padding: 8px;
    width: 100%;
    height: 100vh;
    background: #efeff3;
    z-index: 35;
    display: flex;
    flex-direction: column;
}

.select-timezone__pop-up__bg {
    position: fixed;
    z-index: 34;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.select-timezone__pop-up__cross {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    z-index: 36;
}

.select-timezone__pop-up__title {
    width: 100%;
    font-family: Microsoft Sans Serif;
    font-weight: 400;
    font-size: 13px;
    line-height: 14.71px;
    letter-spacing: 0px;
    color: #707579;
    text-transform: uppercase;
    padding: 8px;
}

.timezones {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.timezones-search {
    width: 100%;
    margin-top: 12px;
    margin-bottom: 8px;
}

.timezones-search__wrapper {
    position: relative;
    width: 100%;
    padding: 0 8px;
}

.timezones-search__input {
    width: 100%;
    height: 36px;
    background: var(--theme-bg-color-white);
    border-radius: 8px;
    padding: 12px;
    outline: none;
    border: none;
    font-size: 16px;
    box-sizing: border-box;
}

.timezones-search__icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.timezones-search__placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    pointer-events: none;
    color: #707579;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    opacity: 1;
    visibility: visible;
    font-family: Microsoft Sans Serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 14.71px;
    text-align: left;
}

.timezones-search__input:focus + .timezones-search__placeholder,
.timezones-search__input:not(:placeholder-shown) + .timezones-search__placeholder {
    opacity: 0;
    visibility: hidden;
}

.timezones__list {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    background: #FFFFFF;
}

.timezones__item {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    cursor: pointer;
    padding: 0 16px;
    position: relative;
}

.timezones__item+.timezones__item::before{
    content: '';
    width: calc(100% - 16px);
    height: 1px;
    background: #00000026;
    position: absolute;
    top: 0;
    right: 0;
}

.timezones__item.active {
    background: var(--theme-bg-color-white);
}

.timezones__item__img-img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

.timezones__item__content-name {
    font-family: Microsoft Sans Serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 16.98px;
    text-align: left;
    flex-grow: 1;
    color: #000000;
}

.select-timezone__pop-up__apply-btn {
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
</style>