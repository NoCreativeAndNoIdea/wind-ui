<script lang="ts" setup></script>

<template>
  play ground:
  <d-config-provider size="large">
    <d-container>
      <d-aside>
        aside
        <d-button-group>
          <d-button type="primary">button</d-button>
          <d-button circle>circle</d-button>
          <d-button link>link</d-button>
        </d-button-group>
      </d-aside>
      <d-container>
        <d-header> header </d-header>
        <d-main>
          main
          <d-row justify="space-between">
            <d-col :span="13" size="xs">
              <d-button plain>plain</d-button>
            </d-col>
            <d-col :span="2" size="lg">
              <d-button dark>dark</d-button>
            </d-col>
          </d-row>
          <d-button color="#f20">color</d-button>
          <d-button disabled>auto insert space</d-button>
          <d-button loading>loading</d-button>
        </d-main>
        <d-footer>
          <d-link type="primary">footer</d-link>
        </d-footer>
      </d-container>
    </d-container>
  </d-config-provider>
  <d-scrollbar style="height: 100px">
    <div class="scrollbar-flex-content">
      <p v-for="item in 50" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
    </div>
  </d-scrollbar>
  <d-space alignment="start" :size="30">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">12</div>
    <div class="item">22</div>
    <div class="item">32</div>
    <div class="item">42</div>
    <div class="item">52</div>
    <div class="item">62</div>
    <div class="item">72</div>
    <div class="item">82</div>
    <div class="item">92</div>
    <div class="item">102</div>
  </d-space>
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#playground {
  width: 100vw;
  height: 100vh;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  background: var(--wind-bg-page);
}

.scrollbar-flex-content {
  display: flex;
}
.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--wind-color-danger-light-9);
  color: var(--wind-color-danger);
}

.item {
  width: 40px;
  height: 40px;
  color: #fff;
  text-align: center;
  line-height: 40px;
  background-color: var(--wind-color-primary);
}
</style>
