<script setup lang="ts">
import {Router} from "../router"
</script>

<template>
<div id="header">
    <p>{{ Router.header }}</p>
</div>
</template>

<style scoped>
#header {
    font-size: 54px;
    width: calc(100% - 30px);
    height: 100px;
    background: var(--theme-back-2);
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    padding-left: 30px;

    display: flex;
    align-items: center;
}
</style>