<template>
    <div class="panel">
        <div class="panel__header" v-bind:class="{'panel__header-orange': headerColor == 'orange'}" @click="hide=!hide">
            <div class="panel__header_toggler" v-show="!hide">▲</div>
            <div class="panel__header_toggler" v-show="hide">▼</div>
            <h3>{{ title }}</h3>
        </div>
        <div v-show="!hide" class="panel__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'headerColor'],
    data: function() {
        return {hide: false}
    }
};
</script>

<style>
.panel__header h3 {
    margin: 0;
    padding: 0;
    font-weight: 300;
    color: #fff;
}

.panel {
    background-color: #fff;
    margin-bottom: 20px;
}

.panel__header {
    border-bottom: 1px solid #16a085;
    padding: 5px;
    background-color: #1abc9c;
    cursor: pointer;
    user-select: none;
}

.panel__header-orange {
    background-color: #f39c12;
    border-bottom: 1px solid #e67e22;
}

.panel__header_toggler {
    float: right;
    color: #fff;
}

.panel__content {
    padding: 10px;
}
</style>