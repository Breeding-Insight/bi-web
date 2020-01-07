<template>
    <b-modal :active.sync="isFailedLoginModalActive">
        <div class="modal-card" style="width: auto">
            <section class="modal-card-body">
                <p>Login Failed</p>
                <p>We were not able to log you in successfully. Contact a system admin for assistance.</p>
            </section>
        </div>

    </b-modal>
</template>

<script>
    module.exports = {
        props: {
            isFailedLoginModalActive: Boolean,
        },
    }
</script>