<template>
    <div class="clients-page">
        <div class="container">
            <div class="clients">

                <div class="clients-search">
                    <div class="clients-search__wrapper">
                        <input 
                            class="clients-search__input" 
                            type="text" 
                            placeholder=" " 
                            v-model="searchQuery" />
                        <div class="clients-search__placeholder">
                            <img class="clients-search__icon" src="/images/icons/search-icon.svg" alt="Search Icon">
                            <span class="clients-search__text">Начните вводить</span>
                        </div>
                    </div>
                </div>

                <div class="clients__add-btn__wrapper">
                    <div class="clients__add-btn" @click="addNewClient">
                        <img class="clients__add-btn__img" src="/images/clients/add.svg">
                        <div class="clients__add-btn__text">
                            Добавить клиента
                        </div>
                    </div>
                </div>

                <div class="clients__list">

                    <div
                        v-for="(client, index) in filteredClients"
                        :key="index"
                        class="clients__item">
                        
                        <div class="clients__item__img" :style="{ backgroundColor: !client.img ? getAvatarColor(client.company_client.custom_name) : 'transparent' }">
                            <template v-if="client.img">
                                <img class="clients__item__img-img" :src="client.img" alt="" />
                            </template>
                            <template v-else>
                                <span class="avatar-letter">{{ client.company_client.custom_name.charAt(0).toUpperCase() }}</span>
                            </template>
                        </div>

                        <div class="clients__item__content">
                            <div class="clients__item__content-name">
                                {{client.company_client.custom_name}}
                            </div>
                            <div class="clients__item__content-contacts">
                                {{client.phone? '+'+client.phone: '' }}
                            </div>
                        </div>
                        <div class="clients__item__delete-btn" @click="deleteClient(client)">
                            Удалить
                        </div>
                    </div>

                </div>

                <DeleteClientPopUp 
                    ref="DeleteClientPopUp"
                    @deleteClientConfirm="deleteClientConfirm"
                />
            </div>
        </div>
    </div>
</template>

<script>
import DeleteClientPopUp from '../components/DeleteClientPopUp.vue';
import axios from 'axios';
export default {
    name: 'ClientsPage',
    components: {
        DeleteClientPopUp
    },
    data(){
        return {
            searchQuery: "",
            clients: []
        }
    },
    methods: {
        async fetchClients() {
            try {
                const response = await window.axios.get('/clients');
                this.clients = response.data.data;
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        },
        addNewClient() {
            this.$router.push('/new-client');
        },
        deleteClient(client){
            this.$refs.DeleteClientPopUp.client = client;
            this.$refs.DeleteClientPopUp.showPopUp();
        },
        async deleteClientConfirm(data){
            try {
                await axios.delete(`/clients/${data.id}`);
                this.$refs.DeleteClientPopUp.closePopUp();
                this.clients.splice(this.clients.indexOf(data), 1);
            } catch (error) {
                console.error('Error deleting client:', error);
            }
        },
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
    },
    mounted() {
        this.fetchClients();
    },
    computed: {
    // Отфильтрованный список клиентов
    filteredClients() {
      const query = this.searchQuery.toLowerCase().trim();
      return this.clients.filter((client) =>
        client.name.toLowerCase().includes(query) || // Фильтрация по имени
        client.phone.toLowerCase().includes(query)  // Фильтрация по номеру телефона
      );
    },
  },
}
</script>

<style scoped>
    .clients{
        width: 100%;
        display: flex;
        flex-direction: column;

    }

    .clients-search {
        width: 100%;
        margin-top: 12px;
        margin-bottom: 8px;
    }

    .clients-search__wrapper {
        position: relative;
        width: 100%;
    }

    .clients-search__input {
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

    .clients-search__icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }

    .clients-search__placeholder {
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

    .clients-search__input:focus + .clients-search__placeholder {
        opacity: 0;
        visibility: hidden;
    }

    .clients-search__input:focus + .clients-search__placeholder,
    .clients-search__input:not(:placeholder-shown) + .clients-search__placeholder {
        opacity: 0;
        visibility: hidden;
    }

    
</style>

<style scoped>
    .clients__add-btn__wrapper{
        width: 100%;
        padding: 8px 0;
        margin-bottom: 8px;
    }

    .clients__add-btn{
        display: flex;
        align-items: center;
        cursor: pointer;
        width: fit-content;
    }

    .clients__add-btn__img{
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }
    .clients__add-btn__text{
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        
        color: var(--theme-accent-color-blue);

    }
</style>

<style scoped>
    .clients__list{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .clients__item{
        display: flex;
        align-items: center;
        padding: 8px 0;
    }

    /* .clients__item__img,
    .clients__item__img-img{
        width: 30px;
        height: 30px;
    } */


    .clients__item__img {
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

    .clients__item__img-img {
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
    }

    .clients__item__content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        flex-grow: 1;
        padding-right: 8px;
    }

    .clients__item__content-name{
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        color: #000000;
    }

    .clients__item__content-contacts{
        font-family: Microsoft Sans Serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 13.58px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        color: var(--theme-text-color-gray);
    }

    .clients__item__delete-btn{
        font-family: Microsoft Sans Serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 14.71px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        color: var(--theme-accent-color-blue);
    }

    .avatar-letter {
        color: white;
        font-size: 15px;
        font-weight: 500;
    }
</style>