<template>
    <div class="select-worker__pop-up">
        <div class="select-worker__pop-up__frame">
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

                <div class="select-worker__pop-up__title">
                    Работники
                </div>

                <div class="workers__list">
                    <div
                        v-for="(worker, index) in filteredWorkers"
                        :key="index"
                        class="workers__item"
                        :class="{ active: selectedWorker && selectedWorker === worker }"
                        @click="toggleWorkerSelection(worker)"
                    >
                        <img class="workers__item__img-img" src="/images/icons/new-event/worker.svg">
                        <div class="workers__item__content-name">
                            {{worker.name}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="select-worker__pop-up__apply-btn" @click="applySelection" v-if="selectedWorker">
                Применить
            </div>
        </div>

        <div class="select-worker__pop-up__bg" @click="closePopUp"></div>
    </div>
</template>

<script>
export default {
    name: 'SelectWorkerPopUp',
    data() {
        return {
            searchQuery: "",
            selectedWorker: null,
            workers: [
                { name: 'Андрей' },
                { name: 'Никита' },
                { name: 'Стас' },
                { name: 'Гена' }
            ]
        }
    },
    methods: {
        closePopUp() {
            document.querySelector('.select-worker__pop-up').style.display = "none";
        },
        showPopUp() {
            document.querySelector('.select-worker__pop-up').style.display = "block";
        },
        toggleWorkerSelection(worker) {
            if (this.selectedWorker && this.selectedWorker.name === worker.name) {
                this.selectedWorker = null;
            } else {
                this.selectedWorker = worker;
            }
        },
        applySelection() {
            if (this.selectedWorker) {
                this.$emit('workerSelected', this.selectedWorker);
                this.closePopUp();
            }
        }
    },
    computed: {
        filteredWorkers() {
            const query = this.searchQuery.toLowerCase().trim();
            return this.workers.filter((worker) =>
                worker.name.toLowerCase().includes(query)
            );
        },
    }
}
</script>

<style scoped>
.select-worker__pop-up {
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

.select-worker__pop-up__frame {
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

.select-worker__pop-up__bg {
    position: fixed;
    z-index: 34;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.select-worker__pop-up__cross {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
    z-index: 36;
}

.select-worker__pop-up__title {
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

.workers {
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
    padding: 0 8px;
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
}

.workers-search__input:focus + .workers-search__placeholder,
.workers-search__input:not(:placeholder-shown) + .workers-search__placeholder {
    opacity: 0;
    visibility: hidden;
}

.workers__list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.workers__item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
}

.workers__item.active {
    background: var(--theme-bg-color-white);
}

.workers__item__img-img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}

.workers__item__content-name {
    font-family: Microsoft Sans Serif;
    font-size: 15px;
    font-weight: 400;
    line-height: 16.98px;
    text-align: left;
    flex-grow: 1;
    color: #000000;
}

.select-worker__pop-up__apply-btn {
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