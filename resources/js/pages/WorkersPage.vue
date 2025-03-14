<template>
    <div class="workers-page">
        <div class="container">
            <div class="workers">

                <div class="workers-search">
                    <div class="workers-search__wrapper">
                        <input 
                            class="workers-search__input" 
                            type="text" 
                            placeholder=" " 
                            v-model="searchQuery" />
                        <div class="workers-search__placeholder">
                            <img class="workers-search__icon" src="/images/icons/search-icon.svg" alt="Search Icon">
                            <span class="workers-search__text">Начните вводить</span>
                        </div>
                    </div>
                </div>

                <div class="workers__add-btn__wrapper">
                    <div class="workers__add-btn" @click="showAddWorkerInput">
                        <img class="workers__add-btn__img" src="/images/clients/add.svg">
                        <div class="workers__add-btn__text">
                            Добавить работника
                        </div>
                    </div>
                </div>

                <div class="workers__list">
                    <div v-if="showNewWorkerInput" class="workers__item">
                        <img class="workers__item__img-img" src="/images/icons/worker.svg">
                        <input
                            class="workers__item__content-name workers__item__input"
                            type="text"
                            v-model="newWorkerName"
                            @blur="addNewWorker"
                            @keyup.enter="addNewWorker"
                            ref="newWorkerInput"
                            placeholder="Введите имя работника"
                        >
                    </div>

                    <div
                        v-for="(worker, index) in filteredWorkers"
                        :key="index"
                        class="workers__item"
                    >

                        <img class="workers__item__img-img" src="/images/icons/worker.svg">

                        <div class="workers__item__content-name">
                            {{worker.name}}
                        </div>
                            
                        <img class="workers__item__delete-btn" 
                            src="/images/icons/cross.svg" 
                            alt="Удалить" 
                            @click="deleteWorker(worker)"
                        >

                    </div>

                </div>

                <DeleteWorkerPopUp 
                    ref="DeleteWorkerPopUp"
                    @deleteWorkerConfirm="deleteWorkerConfirm"
                />
                
            </div>
        </div>
    </div>
</template>

<script>
import DeleteWorkerPopUp from '../components/DeleteWorkerPopUp.vue';
export default {
    name: 'WorkersPage',
    components: {
        DeleteWorkerPopUp
    },
    data(){
        return {
            searchQuery: "", // Поле для ввода текста поиска
            showNewWorkerInput: false,
            newWorkerName: "",
            workers: [
                {
                    name: 'Андрей',
                },
                {
                    name: 'Никита',
                },
                {
                    name: 'Стас',
                },
                {
                    name: 'Гена',
                }
            ]
        }
    },
    methods: {
        deleteWorker(worker){
            this.$refs.DeleteWorkerPopUp.worker = worker;
            this.$refs.DeleteWorkerPopUp.showPopUp();
        },
        deleteWorkerConfirm(data){
            this.$refs.DeleteWorkerPopUp.closePopUp();

            //для примера
            this.workers.splice(this.workers.indexOf(data), 1);
        },
        showAddWorkerInput() {
            this.showNewWorkerInput = true;
            this.newWorkerName = "";
            this.$nextTick(() => {
                this.$refs.newWorkerInput.focus();
            });
        },
        addNewWorker() {
            if (this.newWorkerName.trim()) {
                this.workers.unshift({
                    name: this.newWorkerName.trim()
                });
                this.showNewWorkerInput = false;
                this.newWorkerName = "";
            } else {
                this.showNewWorkerInput = false;
            }
        }
    },
    computed: {
    // Отфильтрованный список клиентов
    filteredWorkers() {
      const query = this.searchQuery.toLowerCase().trim();
      return this.workers.filter((worker) =>
        worker.name.toLowerCase().includes(query)
      );
    },
  },
}
</script>

<style scoped>
    .workers{
        width: 100%;
        display: flex;
        flex-direction: column;

    }

    .workers-search {
        width: 100%;
        margin-top: 12px;
        margin-bottom: 8px;
    }

    .workers-search__wrapper {
        position: relative;
        width: 100%;
    }

    .workers-search__input {
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

    .workers-search__icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }

    .workers-search__placeholder {
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

    .workers-search__input:focus + .workers-search__placeholder {
        opacity: 0;
        visibility: hidden;
    }

    .workers-search__input:focus + .workers-search__placeholder,
    .workers-search__input:not(:placeholder-shown) + .workers-search__placeholder {
        opacity: 0;
        visibility: hidden;
    }

    
</style>

<style scoped>
    .workers__add-btn__wrapper{
        width: 100%;
        padding: 8px 0;
        margin-bottom: 8px;
    }

    .workers__add-btn{
        display: flex;
        align-items: center;
        cursor: pointer;
        width: fit-content;
    }

    .workers__add-btn__img{
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }
    .workers__add-btn__text{
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
    .workers__list{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .workers__item{
        width: 100%;
        display: flex;
        align-items: center;
        padding: 12px;

        border-radius: 8px;
        background: var(--theme-bg-color-white);
    }

    .workers__item__img-img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }

    .workers__item__content-name{
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

    .workers__item__delete-btn{
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .workers__item__input {
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