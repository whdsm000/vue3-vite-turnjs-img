<script setup lang="ts">
const queryString = location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name');
const $=window.$
const Hash=window.Hash
const mapObj: {
  [key: string]: string
} = reactive({
  "wtny": "万图农业系统",
  "zjd": "农村宅基地管理系统",
  "gd": "耕地保护动态监测系统",
  "wty": "万图云平台"
})
useHead({
  title: mapObj[name ?? 'wty'],
  meta: [
    {
      name: 'keywords',
      content: 'test',
    },
    {
      name: 'description',
      content: 'test',
    },
  ],
  link: [
    {
      rel: 'icon',
      href: '/vite.svg',
    },
  ],
})
const gdImgs = import.meta.glob('./assets/gd/*.jpg', { eager: true })
const gdLength = Object.keys(gdImgs).length
const wty = import.meta.glob('./assets/wty/*.png', { eager: true })
const wtyLength = Object.keys(wty).length
const wtny = import.meta.glob('./assets/wtny/*.png', { eager: true })
const wtnyLength = Object.keys(wtny).length
const zjd = import.meta.glob('./assets/zjd/*.png', { eager: true })
const zjdLength = Object.keys(zjd).length
const maxLength = ref(0)
maxLength.value = name === 'gd' ? gdLength :
  name === 'wty' ? wtyLength :
    name === 'wtny' ? wtnyLength :
      name === 'zjd' ? zjdLength : 0;
const initLength = toRaw(maxLength.value)
maxLength.value % 2 === 0 ? maxLength.value : maxLength.value++
const suffix_name = name === 'gd' ? 'jpg' : 'png'
function getImg(i: number):string {
  const index = i < 10 ? `0${i}` : i;
  if (index > initLength) {
    return new URL(`./assets/cover.png`, import.meta.url) as any as string;
  }
  const url = new URL(`./assets/${name}/page_-${index}.${suffix_name}`, import.meta.url);
  return url as any as string;
}
const currentPage = ref(1)
//监听url变化
addEventListener('hashchange', function () {
  const hash = location.hash
  const page = hash.split('/')[1]
    if(!Number(page)) return
    if(Number(page)>maxLength.value){    
      currentPage.value=maxLength.value
      return
    }
    if(Number(page)<0){
      currentPage.value=1
      return
    }
    currentPage.value = Number(page)
})
onMounted(() => {
  //判断class为double胡元素有没有子元素,如果没有则删除
  const double = $('.double')
  double.each((index: any, item: { children: string | any[]; remove: () => void; }) => {
    if (item.children.length === 0) {
      item.remove()
    }
  })
  $('.flipbook').turn({
    // Width
    width: 922,
    // Height
    height: 600,
    // Elevation
    elevation: 50,
    // Enable gradients
    gradients: true,
    // Auto center this flipbook
    autoCenter: true,
    when: {
      turning: function (event: any, page: string, view: any) {
        var book = $(this)
        const currentPage = book.turn('page')
        const pages = book.turn('pages');
        Hash.go('page/' + page).update();
        $('.thumbnails .page-' + currentPage).
          parent().
          removeClass('current');
        $('.thumbnails .page-' + page).
          parent().
          addClass('current');
        const container = document.querySelector('.t_container')
        const currentThumbnail = document.querySelector('.current')! as HTMLDivElement
        const containerWidth = container!.clientWidth
        const thumbnailWidth = currentThumbnail.clientWidth
        const thumbnailLeft = currentThumbnail.offsetLeft
        container!.scrollLeft = thumbnailLeft - (containerWidth - thumbnailWidth) / 2
      },
    }
  })
  $(".flipbook").turn("zoom", 1.3);
  $('.thumbnails').click(function (event: { target: any; }) {
    let page;
    //给event.target的上层div添加class，其余移除class
    if (event.target && (page = /page-([0-9]+)/.exec($(event.target).attr('class')))) {
      $('.flipbook').turn('page', page[1]);
    }
  });
  $('.thumbnails div').
    bind($.mouseEvents.over, function () {
      $((this)).addClass('thumb-hover');
    }).bind($.mouseEvents.out, function () {
      $(this).removeClass('thumb-hover');
    });
  if ($.isTouch) {
    $('.thumbnails').
      addClass('thumbanils-touch').
      bind($.mouseEvents.move, function (event: { preventDefault: () => void; }) {
        event.preventDefault();
      });
  } else {
    $('.thumbnails div').mouseover(function () {
      $('.thumbnails').addClass('thumbnails-hover');
    }).mousedown(function () {
      return false;
    }).mouseout(function () {
      $('.thumbnails').removeClass('thumbnails-hover');
    });
  }
 Hash.on('^page\/([0-9]*)$', {
    yep: function (path: any, parts: any[]) {
      var page = parts[1];
      if(!Number(page)) return
      if(Number(page)>maxLength.value){       
        if ($('.flipbook').turn('is'))
          $('.flipbook').turn('page', maxLength.value);
       
        return
      }
      if(Number(page)<0){
        if ($('.flipbook').turn('is'))
        $('.flipbook').turn('page', 1);
        return
      }
      if ($('.flipbook').turn('is'))
        $('.flipbook').turn('page', Number(page));
    },
    nop: function (path: any) {      
      if ($('.flipbook').turn('is'))
        $('.flipbook').turn('page', 1);
        currentPage.value = 1
    }
  });
  $(document).keydown(function (e: { keyCode: any; }) {
    var previous = 37, next = 39;
    switch (e.keyCode) {
      case previous:
        $('.flipbook').turn('previous');
        break
      case next:
        $('.flipbook').turn('next');
        break;
    }
  });
})
function style(i: number) {
  const url = getImg(i)
  return {
    background: `url(${url})`,
    backgroundSize: '100% 100%',

  }
}
const isDark = useDark()
const toggleDark = () => {
  isDark.value = !isDark.value
}
function pageChange(type: string) {
  switch (type) {
    case 'pre':
      $('.flipbook').turn('previous');
      break;
    case 'next':
      $('.flipbook').turn('next');
      break;
  }
}
function goEvt() {
  //判断currentPage是否为数字
  if (!isNaN(Number(currentPage.value))) {
    if (Number(currentPage.value) < 0) {
      $('.flipbook').turn('page', 1);
      currentPage.value = 1
    } else if (Number(currentPage.value) > maxLength.value) {
      $('.flipbook').turn('page', maxLength.value);
      currentPage.value = maxLength.value
    } else {
      $('.flipbook').turn('page', Number(currentPage.value));
    }
  }else{
    $('.flipbook').turn('page', 1);
    currentPage.value = 1
  }
}
function requestFullscreen(fullscreenDiv: HTMLDivElement) {
  if (fullscreenDiv.requestFullscreen) {
    fullscreenDiv.requestFullscreen();
  }
}
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
function screen(type: 'full' | 'exit') {
  switch (type) {
    case 'full':
      const fullscreenDiv = document.getElementsByClassName("flipbook-viewport")[0]
      requestFullscreen(fullscreenDiv as HTMLDivElement)
      break;
    case 'exit':
      exitFullscreen()
      break;
  }
}
const isFullscreen = ref(false)
//禁止F11进入全屏
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 122) {
    event.preventDefault();
    return false;
  }
}, false);
const flipbook_left=ref('20%')
//监听页面是否全屏
document.addEventListener("fullscreenchange", function () {
  if (document.fullscreenElement) {
    isFullscreen.value = true
    isDark.value = true
    $('.flipbook').turn('zoom', 1.6)
    flipbook_left.value='12%'
  } else {
    isFullscreen.value = false
    isDark.value = false
    $('.flipbook').turn('zoom', 1.3)
    flipbook_left.value='20%'
  }
});
</script>
<template>
  <nav inline-flex gap-2 text-xl class="absolute right-10px top-12px z-999">
    <button icon-btn class="bg-white dark:bg-black dark:text-white border-none" @click="toggleDark">
      <div i-carbon-sun dark:i-carbon-moon />
    </button>
  </nav>
  <div class="flipbook-viewport">
    <div class="f-container">
      <div class="flipbook">
        <div v-for="i in maxLength" :key="i" :style="style(i)" class="item" />
      </div>
    </div>
    <div class="depth"></div>
    <div class="thumbnails">
      <div class="t_container">
        <div v-for="i in maxLength" :key="i" :class="[i === 1 || i === maxLength ? 'single' : 'double']">
          <template v-if="i === 1 || i === maxLength">
            <img :class="[`page-${i}`]" :src="getImg(i)" alt="">
            <span class="font-bold">{{ i }}</span>
          </template>
          <template v-else>
            <template v-if="i % 2 === 0">
              <img :class="[`page-${i}`]" :src="getImg(i)" alt="">
              <img :class="[`page-${i + 1}`]" :src="getImg(i + 1)" alt="">
              <span class="font-bold">{{ i }}-{{ i + 1 }}</span>
            </template>
          </template>
        </div>
      </div>
    </div>
    <div class="absolute  right-120px top-5px z-999 flex items-center">
      <span mr-10px dark:text-white>总计：{{ maxLength }}页</span>
      <button icon-btn class="bg-white dark:bg-black dark:text-white border-none w-40px h-40px"
        @click="pageChange('pre')">
        <div w-full h-full i-carbon:arrow-up></div>
      </button>
      <input type="text" p="x-4 y-2" w="20px" text="~ center dark:white" bg="transparent"
        border="~ rounded gray-200 dark:white" outline="none active:none" v-model="currentPage">
      <button icon-btn class="bg-white dark:bg-black dark:text-white border-none w-40px h-40px "
        @click="pageChange('next')">

        <div w-full h-full i-carbon:arrow-down></div>
      </button>
      <button icon-btn class="bg-white dark:bg-black dark:text-white border-none w-40px h-40px " @click="goEvt">
        <div w-full h-full i-mdi:subdirectory-arrow-left></div>
      </button>
    </div>
    <button absolute icon-btn w-40px h-40px class="bg-white" border-none dark="~ bg-black" right-65px top-5px>
      <div v-show="!isFullscreen" i-mdi:fullscreen text-size="30px" dark="~ text-white" @click="screen('full')"></div>
      <div v-show="isFullscreen" i-mdi:fullscreen-exit text-size="30px" dark="~ text-white" @click="screen('exit')"></div>
    </button>
    <button icon-btn class="bg-white dark:bg-black dark:text-white border-none absolute top-100 left-30"
      @click="pageChange('pre')">
      <div i-carbon:previous-filled text-size="40px"></div>
    </button>
    <button icon-btn class="bg-white dark:bg-black dark:text-white border-none absolute top-100 right-30"
      @click="pageChange('next')">
      <div i-carbon:next-filled text-size="40px"></div>
    </button>
  </div>
</template>

<style scoped lang="less">
.flipbook-viewport {

  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

}

.flipbook-viewport .f-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
  display: flex;

  align-items: center;
}

.flipbook {
  width: 922px;
  height: 600px;

  left:v-bind(flipbook_left);
 

}

.page {
  width: 461px;
  height: 600px;
  background-color: white;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

:deep(.shadow) {
  box-shadow: 0 0 20px #ccc;
}

.thumbnails {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 140px;
  z-index: 1;
  display: flex;
  justify-content: center;


  .t_container {
    width: 1000px;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    transform: scale3d(0.5, 0.5, 1);
    transition: transform ease-in-out 100ms;
    opacity: 0.3;

    div+div {
      margin: 5px;
    }

    div {
      box-shadow: 0 0 10px #ccc;
    }

    .single {
      width: 220px;
      height: 90%;
      display: flex;
      border: 1px solid #ddd;
      position: relative;
      cursor: pointer;
      box-sizing: border-box;

      span {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
       
      }


    }

    .double {
      width: 440px;
      height: 90%;
      position: relative;
      display: flex;
      border: 1px solid #ddd;
      padding: 10px;
      box-sizing: border-box;
      cursor: pointer;

      span {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
      }


    }

    .current {
      box-shadow: 0 0 10px red;
     
     
    }
  }
}

.thumbnails .thumb-hover {

  transform: scale3d(1, 1, 1);

  opacity: 1;
 
}


.thumbnails-hover div {

  transform: scale3d(0.6, 0.6, 1);
  
}


.thumbanils-touch .thumb-hover {

  transform: none;
 
}
</style>
