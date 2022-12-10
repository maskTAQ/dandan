<template>
    <div class="classroom-list page-full">
        <ChatRoom />
    </div>
</template>
<script>
import ChatRoom from '@/components/ChatRoom';
export default {
    name:'classroom-list',
    components:{
        ChatRoom
    }
}
</script>
<style lang="scss">
    .classroom-list{
        background: #fff;
    }
</style>