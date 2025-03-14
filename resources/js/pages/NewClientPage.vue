<template>
    <div class="new-client-page">
        <div class="container">
            <div class="new-client__form">
                <div class="input-wrapper">
                    <input type="text" class="new-client__form-input" placeholder="Андрей" v-model="clientName">
                    <img class="new-client__form-input-icon" src="/images/icons/new-client/client.svg" alt="Client Icon">
                </div>
                <div class="input-wrapper">
                    <input type="text" class="new-client__form-input phone" placeholder="+7 (900) 900-90-90" v-model="clientPhone" @input="formatPhoneNumber">
                    <img class="new-client__form-input-icon" src="/images/icons/new-client/phone.svg" alt="Phone Icon">
                </div>
                <button class="new-client__form-btn add" @click="redirectToClients">Создать клиента</button>
                <div class="separator">
                    или
                </div>
                <button class="new-client__form-btn copy-link" @click="copyInvitationLink">Скопировать ссылку на приглашение</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewClientPage',
    data() {
        return {
            clientName: '',
            clientPhone: '',
        }
    },
    methods: {
        formatPhoneNumber() {
            let cleaned = this.clientPhone.replace(/\D/g, '');

            cleaned = cleaned.substring(0, 11);

            if (cleaned.length > 0) {
                if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
                    cleaned = cleaned.substring(1);
                }
                
                if (cleaned.length <= 3) {
                    this.clientPhone = '+7 (' + cleaned;
                } else if (cleaned.length <= 6) {
                    this.clientPhone = '+7 (' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3);
                } else if (cleaned.length <= 8) {
                    this.clientPhone = '+7 (' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6);
                } else {
                    this.clientPhone = '+7 (' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6, 8) + '-' + cleaned.substring(8);
                }
            } else {
                this.clientPhone = '';
            }
        },
        redirectToClients() {
            this.$router.push('/clients');
        },
        async copyInvitationLink() {
            try {
                await navigator.clipboard.writeText('Тут должна быть ссылка на приглашение');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    },
}
</script>

<style scoped>
.new-client__form {
    max-width: 400px;
    padding-top: 24px;
}

.input-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 6px;
}

.new-client__form-input {
    width: 100%;
    height: 44px;
    padding: 12px 12px 12px 40px;
    border-radius: 12px;
    background: #FFFFFF;
    border: none;
    outline: none;
    font-family: Microsoft Sans Serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 16.98px;
    letter-spacing: 0px;
    color: #000000;
    display: flex;
    align-items: center;
}

.new-client__form-input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    pointer-events: none;
}

.new-client__form-btn {
    width: 100%;
    height: 44px;
    border: none;
    border-radius: 12px;
    font-family: Microsoft Sans Serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 16.98px;
    letter-spacing: 0px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.new-client__form-btn.add {
    background: #3390EC;
    color: #FFFFFF;
    margin-top: 6px;
}

.new-client__form-btn.add:hover {
    background: #1976D2;
}

.new-client__form-btn.copy-link {
    background: #3390EC26;
    color: #3390EC;
}

.new-client__form-btn.copy-link:hover {
    background: #BBDEFB;
}

.separator {
    height: 15px;
    text-align: center;
    margin: 20px 0;
    color: #94A3B8;
    font-family: Inter;
    font-weight: 400;
    font-size: 12px;
    line-height: 14.52px;
    letter-spacing: 0%;
    text-align: center;
    position: relative;
}

.separator::before,
.separator::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 22.5%;
    height: 1px;
    background: #DDD3F2;
}

.separator::before {
    left: 18%;
}

.separator::after {
    right: 18%;
}
</style>