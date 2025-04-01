<template>
    <div class="public-api-page">
        <div class="container">
            <div class="public-api-content">
                <div class="public-api-content__item">
                    <div class="public-api-content__item__title">
                        Публичный API
                    </div>
                    <div class="public-api-content__item__input-wrapper">
                        <input 
                            type="text" 
                            class="public-api-content__item__input api"
                            v-model="apiUrl"
                            readonly
                        >
                        <button 
                            class="input-action-btn copy-btn"
                            @click="copyToClipboard(apiUrl)"
                            title="Copy to clipboard"
                        >
                            <img src="/images/icons/copy.svg" alt="Copy">
                        </button>
                    </div>
                    <div class="public-api-content__item__text">
                        The official Telegram app is available for Android, iPhone, iPad, Windows, macOS and Linux.
                    </div>
                </div>

                <div class="public-api-content__item">
                    <div class="public-api-content__item__title">
                        Токен
                    </div>
                    <div class="public-api-content__item__input-wrapper">
                        <input 
                            :type="showToken ? 'text' : 'password'" 
                            class="public-api-content__item__input"
                            v-model="token"
                            readonly
                        >
                        <div class="separator"></div>
                        <button 
                            class="input-action-btn toggle-btn"
                            @click="toggleTokenVisibility"
                            title="Toggle visibility"
                        >
                            <img :src="`/images/icons/${showToken ? 'hide' : 'show'}.svg`" alt="Toggle visibility">
                        </button>
                        <button 
                            class="input-action-btn copy-btn"
                            @click="copyToClipboard(token)"
                            title="Copy to clipboard"
                        >
                            <img src="/images/icons/copy.svg" alt="Copy">
                        </button>
                        
                    </div>
                    <div class="public-api-content__item__text">
                        The official Telegram app is available for Android, iPhone, iPad, Windows, macOS and Linux.
                    </div>
                </div>

            </div>

            <button class="documentation">Документация</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PublicApiPage',
    data() {
        return {
            apiUrl: 'https://pulse-back.pisateli-studio.ru/api/v1/',
            token: 'qPkRDakT7IQFWto9p6aP=',
            showToken: false
        }
    },
    methods: {
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        },
        toggleTokenVisibility() {
            this.showToken = !this.showToken;
        }
    }
}
</script>

<style scoped>
    .public-api-page{
        padding-top: 12px;
    }
    .public-api-content{
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
    }
    .public-api-content__item+.public-api-content__item{
        margin-top: 12px;
    }
    .public-api-content__item__title{
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 14.71px;
        letter-spacing: 0px;
        color: #707579;
        margin-bottom: 6px;
        margin-left: 10px;
        text-transform: uppercase;
    }
    .public-api-content__item__input-wrapper{
        /* max-width: 400px; */
        width: 100%;
        height: 44px;
        margin-bottom: 8px;
        position: relative;
        display: flex;
        align-items: center;
    }

    .public-api-content__item__input{
        width: 100%;
        height: 100%;
        border-radius: 12px;
        background: #FFFFFF;
        border: none;
        outline: none;
        padding: 12px 80px 12px 12px;
        color: #000000;
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 16.98px;
        letter-spacing: 0px;
    }
    .public-api-content__item__input[type="password"] {
        -webkit-text-security: disc;
        font-family: text-security-disc;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: 3px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: #707579;
    }
    .public-api-content__item__input.api{
        padding: 12px 44px 12px 12px;
        color: #00000033;
    }
    .input-action-btn {
        width: 20px;
        height: 20px;
        position: absolute;
        /* right: 12px; */
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .input-action-btn.copy-btn {
        right: 12px;
    }
    .input-action-btn.toggle-btn {
        right: 48px;
    }
    .separator{
        width: 1px;
        height: 16px;
        position: absolute;
        right: 40px;
        background: none;
        border: none;
        background: #D9D9D9;
    }
    .public-api-content__item__text{
        font-family: SF Pro;
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        letter-spacing: -0.08px;
        color: #707579;
        margin-left: 8px;
    }
    button.documentation{
        /* max-width: 400px; */
        width: 100%;
        height: 44px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #3390EC26;
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 16.98px;
        letter-spacing: 0px;
        color: #3390EC;
        border: none;
        outline: none;
    }
</style>