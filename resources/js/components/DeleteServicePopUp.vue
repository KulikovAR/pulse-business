<template>
    <div class="delete-service__pop-up">
        <div class="delete-service__pop-up__frame">
            <div class="delete-service__pop-up__message">
                Вы действительно хотите <br> удалить услугу {{service.name}}?
            </div>
            
            <div class="delete-service__pop-up__btns">
                <div class="delete-service__pop-up__btn back" @click="closePopUp">
                    Назад
                </div>
                <div class="delete-service__pop-up__btn cancel" @click="deleteService">
                    Удалить
                </div>
            </div>
            
            <img class="delete-service__pop-up__cross" src="/images/btns/pop-up-cross.svg" alt="close" @click="closePopUp()">
        </div>
        
        <div class="delete-service__pop-up__bg"></div>
    </div>
</template>

<script>
export default {
    name: 'DeleteServicePopUp',
    methods: {
        closePopUp(){
            document.querySelector('.delete-service__pop-up').style.display = "none";
        },
        showPopUp(){
            document.querySelector('.delete-service__pop-up').style.display = "block";
        },
        deleteService(){
            this.$emit('deleteServiceConfirm',this.service);
        }
    },
    data(){
        return {
            service: {},
        }
    },
}
</script>

<style scoped>
.delete-service__pop-up {
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

.delete-service__pop-up__frame {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    padding: 18px;
    position: absolute;
    width: 85%;
    height: fit-content;
    background: rgba(255, 255, 255, 1);
    border-radius: 12px;
    box-shadow: 0px 2px 10px 0px rgba(184, 164, 142, 0.4);
    z-index: 35;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Microsoft Sans Serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 21.25px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    gap: 32px;
}

.delete-service__pop-up__bg {
    position: absolute;
    z-index: 34;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    margin: auto;
    background: rgba(0,0,0,0.4);
}

.delete-service__pop-up__cross {
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
}

.delete-service__pop-up__btns {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.delete-service__pop-up__btn {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Microsoft Sans Serif;
    font-size: 17px;
    font-weight: 400;
    line-height: 19.24px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    background: var(--theme-secondary-bg-color);
    border-radius: 8px;
    cursor: pointer;
}

.delete-service__pop-up__btn.cancel {
    color: var(--theme-destructive-color);
}
</style>