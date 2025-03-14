<template>
    <div class="select-client__pop-up">
        <div class="container">
            <div class="select-client__pop-up__frame">
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

                    <div class="clients__title">
                        Клиенты
                    </div>

                    <div class="clients__list">
                        <div
                            v-for="(client, index) in filteredClients"
                            :key="index"
                            class="clients__item"
                            :class="{ active: selectedClient && selectedClient === client }"
                            @click="toggleClientSelection(client)">
                            <div class="clients__item__img">
                                <img class="clients__item__img-img" :src="client.img">
                            </div>
                            <div class="clients__item__content">
                                <div class="clients__item__content-name">
                                    {{client.name}}
                                </div>
                                <div class="clients__item__content-contacts">
                                    {{client.phone}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="select-client__pop-up__apply-btn" @click="applySelection" v-if="selectedClient">
                    Применить
                </div>
            </div>
        </div>
        <div class="select-client__pop-up__bg"></div>
    </div>
</template>

<script>
export default {
    name: 'SelectClientPopUp',
    methods: {
        closePopUp(){
            document.querySelector('.select-client__pop-up').style.display = "none";
        },
        showPopUp(){
            document.querySelector('.select-client__pop-up').style.display = "block";
        },
        toggleClientSelection(client) {
            if (this.selectedClient && this.selectedClient.name === client.name) {
                this.selectedClient = null;
            } else {
                this.selectedClient = client;
            }
        },
        applySelection() {
            if (this.selectedClient) {
                this.$emit('clientSelected', this.selectedClient);
                this.closePopUp();
            }
        },
        clearSelection() {
            this.selectedClient = null;
        }
    },
    data(){
        return {
            searchQuery: "",
            selectedClient: null,
            clients: [
                {
                    name: 'Денис',
                    img: '/images/clients/1.jpg',
                    phone: '+790812726848'
                },
                {
                    name: 'Александр Куликов',
                    img: '/images/clients/2.jpg',
                    phone: 'SachkaProg'
                },
                {
                    name: 'sidenko_showman',
                    img: '/images/clients/3.jpg',
                    phone: ''
                },
                {
                    name: 'default_blank',
                    img: '/images/clients/5.jpg',
                    phone: ''
                }
            ]
        }
    },
    computed: {
        filteredClients() {
            const query = this.searchQuery.toLowerCase().trim();
            return this.clients.filter((client) =>
                client.name.toLowerCase().includes(query) || 
                client.phone.toLowerCase().includes(query)
            );
        }
    },
    mounted() {
    }
}
</script>

<style scoped>
.select-client__pop-up {
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

.select-client__pop-up .container{
    padding: 0 8px;
}

.select-client__pop-up__frame {
    padding: 0;
    width: 100%;
    height: 100vh;
    background: #efeff3;
    z-index: 35;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.select-client__pop-up__bg {
    position: fixed;
    z-index: 34;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.select-client__pop-up__cross {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    z-index: 1002;
}
</style>

<style scoped>
.clients {
    width: 100%;
    display: flex;
    flex-direction: column;
    z-index: 35;
}

.clients-search {
    width: 100%;
    margin-top: 12px;
    margin-bottom: 8px;
    padding: 0 8px;
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
}

.clients-search__input:focus + .clients-search__placeholder,
.clients-search__input:not(:placeholder-shown) + .clients-search__placeholder {
    opacity: 0;
    visibility: hidden;
}
</style>

<style scoped>
.clients__title {
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

.clients__list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.clients__item {
    display: flex;
    align-items: center;
    padding: 8px;
}

.clients__item.active{
    background: #FFFFFF;
    border-radius: 12px;
}

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

.clients__item__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    flex-grow: 1;
    padding-right: 8px;
}

.clients__item__content-name {
    font-family: Microsoft Sans Serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 16.98px;
    text-align: left;
    color: #000000;
}

.clients__item__content-contacts {
    font-family: Microsoft Sans Serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 13.58px;
    text-align: left;
    color: var(--theme-text-color-gray);
}

.clients__item__delete-btn {
    font-family: Microsoft Sans Serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 14.71px;
    text-align: left;
    color: var(--theme-accent-color-blue);
    cursor: pointer;
}

.select-client__pop-up__apply-btn {
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