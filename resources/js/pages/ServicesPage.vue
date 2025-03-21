<template>
    <div class="services-page">
        <div class="container">
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

                <div class="services__add-btn__wrapper">
                    <div class="services__add-btn" @click="showAddServiceInput">
                        <img class="services__add-btn__img" src="/images/clients/add.svg">
                        <div class="services__add-btn__text">
                            Добавить услугу
                        </div>
                    </div>
                </div>

                <div class="services__list">
                    <div v-if="showNewServiceInput" class="services__item">
                        <img class="services__item__img-img" src="/images/icons/worker.svg">
                        <input
                            class="services__item__content-name services__item__input"
                            type="text"
                            v-model="newServiceName"
                            @blur="addNewService"
                            @keyup.enter="addNewService"
                            ref="newServiceInput"
                            placeholder="Введите название услуги"
                        >
                    </div>

                    <div
                        v-for="(service, index) in filteredServices"
                        :key="index"
                        class="services__item"
                    >

                        <img class="services__item__img-img" src="/images/icons/worker.svg">

                        <div class="services__item__content-name">
                            {{service.name}}
                        </div>
                            
                        <img class="services__item__delete-btn" 
                            src="/images/icons/cross.svg" 
                            alt="Удалить" 
                            @click="deleteService(service)"
                        >

                    </div>

                </div>

                <DeleteServicePopUp 
                    ref="DeleteServicePopUp"
                    @deleteServiceConfirm="deleteServiceConfirm"
                />
                
            </div>
        </div>
    </div>
</template>

<script>
import DeleteServicePopUp from '../components/DeleteServicePopUp.vue';
import axios from 'axios';
export default {
    name: 'ServicesPage',
    components: {
        DeleteServicePopUp
    },
    data(){
        return {
            searchQuery: "", // Поле для ввода текста поиска
            showNewServiceInput: false,
            newServiceName: "",
            services: []
        }
    },
    async created() {
        await this.fetchServices();
    },
    methods: {
        async fetchServices() {
            try {
                const response = await axios.get('/services');
                this.services = response.data.data;
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        },
        deleteService(service){
            this.$refs.DeleteServicePopUp.service = service;
            this.$refs.DeleteServicePopUp.showPopUp();
        },
        async deleteServiceConfirm(data){
            this.$refs.DeleteServicePopUp.closePopUp();
            try {
                await axios.delete(`/services/${data.id}`);
                await this.fetchServices();
            } catch (error) {
                console.error('Error deleting service:', error);
            }
        },
        showAddServiceInput() {
            this.showNewServiceInput = true;
            this.newServiceName = "";
            this.$nextTick(() => {
                this.$refs.newServiceInput.focus();
            });
        },
        async addNewService() {
            if (this.newServiceName.trim()) {
                try {
                    await axios.post('/services', {
                        name: this.newServiceName.trim()
                    });
                    await this.fetchServices();
                    this.showNewServiceInput = false;
                    this.newServiceName = "";
                } catch (error) {
                    console.error('Error creating service:', error);
                }
            } else {
                this.showNewServiceInput = false;
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
    },
}
</script>

<style scoped>
    .services{
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
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

    }

    .services-search__input:focus + .services-search__placeholder {
        opacity: 0;
        visibility: hidden;
    }

    .services-search__input:focus + .services-search__placeholder,
    .services-search__input:not(:placeholder-shown) + .services-search__placeholder {
        opacity: 0;
        visibility: hidden;
    }

    .services__add-btn__wrapper{
        width: 100%;
        padding: 8px 0;
        margin-bottom: 8px;
    }

    .services__add-btn{
        display: flex;
        align-items: center;
        cursor: pointer;
        width: fit-content;
    }

    .services__add-btn__img{
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }
    .services__add-btn__text{
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        
        color: var(--theme-accent-color-blue);
    }

    .services__list{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .services__item{
        width: 100%;
        display: flex;
        align-items: center;
        padding: 12px;

        border-radius: 8px;
        background: var(--theme-bg-color-white);
    }

    .services__item__img-img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }

    .services__item__content-name{
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        flex-grow: 1;

        color: #000000;
    }

    .services__item__delete-btn{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .services__item__input {
        border: none;
        outline: none;
        background: transparent;
        width: 100%;
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        color: #000000;
    }
</style>