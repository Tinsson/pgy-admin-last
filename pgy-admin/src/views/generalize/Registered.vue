<template>
  <div id="registered">
    <img class="over-pic" src="../../assets/images/after.jpg" alt="">
  </div>
</template>

<script>
  import qs from 'qs'

  export default {
    name: 'registered',
    data () {
      return {
      }
    },
    mounted(){
      const title = '欣荣钱包推广'
      document.body.style.overflow = 'hidden';
      document.setTitle = function(t) {
        document.title = t;
        var i = document.createElement('iframe');
        i.style.display = 'none';
        i.onload = function() {
          setTimeout(function(){
            i.remove();
          }, 9)
        }
        document.body.appendChild(i);
      }
      document.title = title;
      document.setTitle(title);
    }
  }
</script>
<style lang="less" scoped>
  #registered{
    width: 100vw;
    height: 100vh;
    background-size: 100% 100%;
  }
  .over-pic{
    width: 100%;
    height: 100%;
  }
</style>
