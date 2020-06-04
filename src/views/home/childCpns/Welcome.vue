<template>
  <div class="welcome">
    <ul class="box">
      <li
        v-for="(item,index ) in cities"
        :class="{checked:arr.includes(index)}"
        @click="checkedBox(index)"
        :key="index">
        <button>{{item}}</button>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      cities: ["上海", "北京", "广州", "重庆", "西安"],
      arr: []
    };
  },
  methods: {
    checkedBox(index) {
      if (this.arr.includes(index)) {
        //includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
        //filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
        this.arr = this.arr.filter(function(ele) {
          return ele != index;
        });
      } else {
        this.arr.push(index);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
  display: inline-block;
}
.checked button{
  background: lightBlue;
  color: #fff;
}
</style>
