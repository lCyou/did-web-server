<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

import GetKeys from '@/components/GetKeys.vue';
import PublishDID from '@/components/PublishDID.vue';
import VerifyDoc from '@/components/VerifyDoc.vue';
import { didDocument, removeDoc } from '@/utils/document';

// same as beforeRouteLeave option but with no access to `this`
onBeforeRouteLeave((to, from) => {
    if (didDocument.uri) {
        const answer = window.confirm(
            'Do you really want to leave? you have unsaved changes!'
        )
        // cancel the navigation and stay on the same page
        if (!answer) return false
        removeDoc()
    }
})
</script>

<template>
    <div>
        <h1>Create your DID &#x1FAAA;</h1>
        <GetKeys />
        <PublishDID />
        <VerifyDoc />
        <h2 v-show="didDocument.verified"> &#x1F389; Now available &#x1F389;</h2>
    </div>
</template>

<style scoped>

</style>