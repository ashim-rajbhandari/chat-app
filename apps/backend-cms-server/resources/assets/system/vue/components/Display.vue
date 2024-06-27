<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Button from './baseComponents/Button.vue';
import { socket } from '../socket';

const messages = ref([]);
const messageInput = ref('');
const chatBox = ref(null);

const props = defineProps({
  userId: String,
  userName: String,
});

// Function to send message
const sendMessage = () => {
  const message = messageInput.value;

  // Check if room is already there else add new URL
  const room = new URLSearchParams(window.location.search).get('room') ?? null;
  socket.emit('message', message, room, props.userId , props.userName , 'message');
  messageInput.value = '';
};


onMounted(() => {
  socket.on('message', (message, userId , userName , type) => {
    messages.value.push({ userId: userId, message: message , userName: userName , type: type});

    nextTick(() => { 
      if (chatBox.value) {
        chatBox.value.scrollTop = chatBox.value.scrollHeight;
      }
    });
  });

  socket.on('join-room', (message, userId , userName , type) => {
    messages.value.push({ userId: userId, message: message , userName: userName , type: type});

    nextTick(() => { 
      if (chatBox.value) {
        chatBox.value.scrollTop = chatBox.value.scrollHeight;
      }
    });

  });

    socket.on('leave-room', (message, userId , userName, type) => {
    messages.value.push({ userId: userId, message: message , userName: userName, type:type});

    nextTick(() => { 
      if (chatBox.value) {
        chatBox.value.scrollTop = chatBox.value.scrollHeight;
      }
    });
  });
})
</script>

<template>
  <div class="container">
    <div class="row justify-content-center mt-2">
      <div class="">
        <div class="card">
          <div class="card-header">Message</div>
          <div class="card-body chat-box" ref="chatBox">
            <div v-for="(message, index) in messages" :key="index" class="message">

              <div v-if="message.type === 'join-room'">
                <div :class="['message-container align-center']">
                  <div :class="['alert-info']" role="alert">
                    {{ message.message }}
                  </div>
                </div>
              </div>

              <div v-else-if="message.type === 'leave-room'">
                <div :class="['message-container align-center']">
                  <div :class="['alert-danger']" role="alert">
                    {{ message.message }}
                  </div>
                </div>
              </div>

              <div v-else>
                <div :class="['message-container', message.userId === props.userId ? 'align-left' : 'align-right']">
                  <div :class="['alert', message.userId === props.userId ? 'alert-primary' : 'alert-secondary']" role="alert">
                    {{ message.message }} - {{ message.userName}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="input-group">
              <input type="text" class="form-control" v-model="messageInput" placeholder="Type your message here...">
              <div class="input-group-append">
                <button class="btn btn-primary" @click="sendMessage">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-box {
  height: 400px;
  overflow-y: scroll;
}
.message {
  margin-bottom: 10px;
}
.message-container {
  display: flex;
}
.align-left {
  justify-content: flex-start;
}
.align-right {
  justify-content: flex-end;
}

.align-center {
  justify-content: center;
}

.alert {
  max-width: 75%;
}
</style>
