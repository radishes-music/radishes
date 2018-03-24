<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
::scrollbar{width:6px;height:4px}
::-webkit-scrollbar{width:6px;height:4px}
::-webkit-scrollbar-track{background-color: rgb(245,245,247);}
::-webkit-scrollbar-thumb{background-color: rgb(200,200,200);}
::-moz-scrollbar{width:6px;height:4px}
::-moz-scrollbar-track{background-color: rgb(245,245,247);}
::-moz-scrollbar-thumb{background-color: rgb(200,200,200)}

#app {
  font-family: 'FangSong', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#boxMenu {
  position: absolute;
  width: 182px; 
  height: 136px;
  border: 1px solid #ccc;
  z-index: 999; 
  background-color: white; 
  color: black;
}

#boxMenu span {
  position: absolute;
  left: 182px;
  top: -1px;
  width: 142px;
  height: auto;
  background: rgb(250,250,250);
  border: 1px solid #ccc;
}
#boxMenu #marke {
  position: absolute;
  left: 116px;
  top: -13px;
}
#boxMenu .listSongName {
  margin: 0;
  padding: 0;
  position: absolute;
  left: -10px;
  top: -2px;
  width: 124px;
  white-space:nowrap; 
  overflow:hidden;
  text-overflow:ellipsis; 
}

.boxUl {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.boxLi {
  position: relative;
  width: 100%;
  height: 34px;
  font-size: 10pt;
  line-height: 34px;
  text-align: left;
  cursor: pointer;
  text-indent: 44px;
}
.boxLi img {
	position: absolute;
	left: 10px;
	top: 8px;
}
.boxLi:hover {
	background-color: rgb(230,230,230);
}
</style>
