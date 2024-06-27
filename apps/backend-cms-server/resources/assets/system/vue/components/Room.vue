<script setup>
    import Button from './baseComponents/Button.vue';
    import { ref } from 'vue';
    import { socket } from '../socket';

    const props = defineProps({
      userId: { type: String, required: false },
      userName: { type: String, required: false }
    });

    const roomName = ref('');
    const joinRoom = () => {
      
      const room = roomName.value;
      let oldRoom = '';
      let newUrl = '';

      // //check if room is already there else add new url
      const currentUrl = new URL(window.location.href);
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');

      if(!room && !urlRoom){
        return;
      }

      if(room && !urlRoom) {
        newUrl = `${currentUrl}?room=${room}`;
        window.history.pushState({}, '' , newUrl);
      }
      
      if(urlRoom && room) {
        if(urlRoom !== room) {
          oldRoom = urlRoom;
          currentUrl.searchParams.set('room', room);
          window.history.pushState({}, '' , currentUrl);
        }else{
          return;
        }
      }
      

      if(!room && urlRoom){
        oldRoom = urlRoom;
        currentUrl.searchParams.delete('room');
        window.history.pushState({}, '', currentUrl.toString());
      }
 
      socket.emit('join-room', room , oldRoom , props.userId , props.userName);
    }
</script>

<template>
  <div class="col-md-10">
    <input
      class="form-control"
      id="room"
      type="text"
      placeholder="Room"
      v-model.trim="roomName"
    />
  </div>

<Button :title="'Join Room'" class="btn btn-secondary" @click="joinRoom"></Button>
</template>
