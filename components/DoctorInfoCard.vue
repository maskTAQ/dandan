<template>
  <div class="doctor-info-card">
    <p class="name">张俊山</p>
    <span class="tag">主治医师</span>
    <p class="hospital">北京协和医院</p>
    <p class="subtitle">生殖专家</p>
    <img src="" alt="" class="doctor" />
  </div>
</template>
<script>
export default {
  name: "DoctorLiveCard",
  props: {
    data: Object,
  },
};
</script>
<style lang="scss">
.doctor-info-card {
  position: relative;
  width: 2rem;
  height: 1.33rem;
  padding: 0.16rem 0.22rem;
  background: rgb(223, 237, 250);
  box-shadow: 0px 4px 12px rgba(139, 156, 164, 0.17);
  border-radius: 0.1rem;
  .name {
    font-size: 0.18rem;
    font-weight: bold;
    color: rgb(51, 51, 51);
  }
  .tag {
    display: inline-block;
    margin-top: 0.06rem;
    margin-bottom: .13rem;
    height: 0.2rem;
    line-height: 0.2rem;
    padding: 0 0.08rem;
    font-size: 0.12rem;
    color: rgb(48, 131, 180);
    background: rgb(187, 221, 250);
    border-radius: 0.1rem;
  }
  .doctor {
    position: absolute;
    top: -0.21rem;
    right: 0;
    z-index: 9;
    width: 1.07rem;
    height: 1.6rem;
    border: 1px solid red;
  }
}
</style>