<template>
    <div>
        [{{code}}]
        <input style="border:1px solid red;" type="text" v-model="code" maxlength="4" name="code">
    </div>
</template>
<script>
export default {
    name:'code',
    data() {
        return {
            code:'12'
        }
    },
}
</script>