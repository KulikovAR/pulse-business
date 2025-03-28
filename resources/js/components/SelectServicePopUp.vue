<template>
    <div class="select-service__pop-up">
        <div class="select-service__pop-up__frame">
            <div class="services">
                <div class="services-search">
                    <div class="services-search__wrapper">
                        <input 
                            class="services-search__input" 
                            type="text" 
                            placeholder=" " 
                            v-model="searchQuery" />
                        <div class="services-search__placeholder">
                            <img class="services-search__icon" src="/images/icons/search-icon.svg" alt="Search Icon">
                            <span class="services-search__text">Начните вводить</span>
                        </div>
                    </div>
                </div>

                <div class="select-service__pop-up__title">
                    Услуги
                </div>

                <div class="services__list">
                    <div
                        v-for="(service, index) in filteredServices"
                        :key="index"
                        class="services__item"
                        :class="{ active: selectedServices.includes(service) }"
                        @click="toggleServiceSelection(service)"
                    >
                        <img class="services__item__img-img" src="/images/icons/new-event/service.svg">
                        <div class="services__item__content-name">
                            {{service.name}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="select-service__pop-up__apply-btn" @click="applySelection" v-if="selectedServices.length > 0">
                Применить ({{selectedServices.length}})
            </div>
        </div>

        <div class="select-service__pop-up__bg" @click="closePopUp"></div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SelectServicePopUp',
    data() {
        return {
            searchQuery: "",
            selectedService: null,
            services: [],
            selectedServices: []
        }
    },
    async created() {
        await this.fetchServices();
    },
    methods: {
        async fetchServices() {
            try {
                const response = await window.axios.get('/services');
                this.services = response.data.data;
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        },
        closePopUp() {
            document.querySelector('.select-service__pop-up').style.display = "none";
        },
        showPopUp() {
            document.querySelector('.select-service__pop-up').style.display = "block";
        },
        toggleServiceSelection(service) {
            const index = this.selectedServices.findIndex(s => s.name === service.name);
            if (index > -1) {
                this.selectedServices.splice(index, 1);
            } else {
                this.selectedServices.push(service);
            }
        },
        applySelection() {
            if (this.selectedServices.length > 0) {
                this.$emit('serviceSelected', this.selectedServices);
                this.closePopUp();
            }
        }
    },
    computed: {
        filteredServices() {
            const query = this.searchQuery.toLowerCase().trim();
            return this.services.filter((service) =>
                service.name.toLowerCase().includes(query)
            );
        },
    }
}
</script>

<style scoped>
.select-service__pop-up {
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

.select-service__pop-up__frame {
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

.select-service__pop-up__bg {
    position: fixed;
    z-index: 34;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.select-service__pop-up__cross {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    z-index: 36;
}

.select-service__pop-up__title {
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

.services {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.services-search {
    width: 100%;
    margin-top: 12px;
    margin-bottom: 8px;
}

.services-search__wrapper {
    position: relative;
    width: 100%;
    padding: 0 8px;
}

.services-search__input {
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

.services-search__icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.services-search__placeholder {
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

.services-search__input:focus + .services-search__placeholder,
.services-search__input:not(:placeholder-shown) + .services-search__placeholder {
    opacity: 0;
    visibility: hidden;
}

.services__list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.services__item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
}

.services__item.active {
    background: var(--theme-bg-color-white);
}

.services__item__img-img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

.services__item__content-name {
    font-family: Microsoft Sans Serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 16.98px;
    text-align: left;
    flex-grow: 1;
    color: #000000;
}

.select-service__pop-up__apply-btn {
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