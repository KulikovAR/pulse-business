<template>
    <div class="main-page">
        <div class="container">
            <div class="admin-panel__menu">
                <div class="admin-panel__menu__category">
                    <div class="admin-panel__menu__category-title">
                        Кабинет
                    </div>
                    <div class="admin-panel__menu-item-list">

                        <router-link :to="{ name:'calendar' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/calendar.svg">
                            <div class="admin-panel__menu-item__title">
                                Календарь
                            </div>
                        </router-link>

                        <router-link :to="{ name:'clients' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/clients.svg">
                            <div class="admin-panel__menu-item__title">
                                Клиенты
                            </div>
                        </router-link>

                        <router-link :to="{ name:'notes' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/notes.svg">
                            <div class="admin-panel__menu-item__title">
                                Мои записи
                            </div>
                        </router-link>

                        <!-- <router-link :to="{ name:'workers' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/clients.svg">
                            <div class="admin-panel__menu-item__title">
                                Работники
                            </div>
                        </router-link> -->
                        <router-link :to="{ name:'services' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/services.svg">
                            <div class="admin-panel__menu-item__title">
                                Услуги
                            </div>
                        </router-link>
                    </div>
                    
                </div>
                <div class="admin-panel__menu__category">
                    <div class="admin-panel__menu__category-title">
                        Настройка
                    </div>
                    <div class="admin-panel__menu-item-list">

                        <router-link :to="{ name:'settings' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/settings.svg">
                            <div class="admin-panel__menu-item__title">
                                Параметры
                            </div>
                        </router-link>

                    </div>
                </div>
                <div class="admin-panel__menu__category">
                    <div class="admin-panel__menu__category-title">
                        Интеграция
                    </div>
                    <div class="admin-panel__menu-item-list">

                        <router-link :to="{ name:'main' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/link.svg">
                            <div class="admin-panel__menu-item__title">
                                Интеграция с Битрикс 24
                            </div>
                        </router-link>

                        <router-link :to="{ name:'public-api' }" class="admin-panel__menu-item">
                            <img class="admin-panel__menu-item__img" src="/images/icons/nav/api.svg">
                            <div class="admin-panel__menu-item__title">
                                Публичный API
                            </div>
                        </router-link>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MainPage'
}
</script>

<style scoped>
    .admin-panel__menu{
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .admin-panel__menu__category{
        width: 100%;
        display: flex;
        flex-direction: column;

    }

    .admin-panel__menu__category-title{
        width: 100%;
        padding: 10px 0;

        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: #000000;

    }

    .admin-panel__menu-item-list{
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;

        padding-top: 8px;
        margin-bottom: 8px;
    }

    .admin-panel__menu-item{
        position: relative;
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;

        padding: 12px 44px 12px 12px;
        border-radius: 8px;
        background: var(--theme-bg-color-white);
        cursor: pointer;
    }

    .admin-panel__menu-item__img{
        width: 20px;
        height: 20px;
        display: block;
        margin-right: 8px;

    }

    .admin-panel__menu-item__title{
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        color: #000000;
    }

    .admin-panel__menu-item::after{
        content: url("/images/icons/nav/arrow.svg");
        width: 20px;
        height: 20px;
        display: block;
        position: absolute;
        right: 12px;
        top: 0;
        bottom: 0;
        margin: auto 0;
    }
</style>