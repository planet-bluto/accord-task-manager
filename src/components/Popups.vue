<script setup lang="ts">
import {PopupDriver} from "../popups"
</script>

<template>
<div id="whole-popup-container" v-show="PopupDriver.in_popup.value">
    <div id="popup-container">
        <div id="popup"></div>
    </div>

    <div id="popup-fadeout" @click="PopupDriver.close()"></div>
</div>
</template>


<style scoped>
#popup {
    width: calc((100% - 150px) - (16px * 2));
    height: calc((100% - 150px) - (16px * 2));
    background: var(--theme-back-2);
    border-radius: 15px;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 20px;
    overflow-y: scroll;
}

#popup-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 101;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

#popup-fadeout {
    position: absolute;
    /* top: calc(var(--gap) * -1);
    left: calc(var(--gap) * -1); */
    width: 100%;
    height: 100%;
    z-index: 100;
    background: #000;
    opacity: 0.75;
}

#whole-popup-container {
    position: absolute;
    width: calc(100% + var(--gap));
    height: calc(100% + var(--gap));
    top: calc(var(--gap) * -1);
    left: calc(var(--gap) * -1);
}
</style>