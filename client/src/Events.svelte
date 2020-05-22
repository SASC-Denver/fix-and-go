<script>
    import {onDestroy, onMount} from 'svelte'
    import {lastMessage} from "./ui-state";

    let gameEventsElement;

    const messageSubscription = lastMessage.subscribe(message => {
        if(message === null) {
            return
        }
        const messageElement = document.createElement('div');
        messageElement.innerText = message.value;
        gameEventsElement.appendChild(messageElement);
        // gameEventsElement.appendChild(document.createElement('br'));
    });


    onMount(() => {
        gameEventsElement = document.getElementById('gameEvents');
    });

    onDestroy(() => {
        messageSubscription.unsubscribe();
    });
</script>
<style>
    .events {
        border: 1px solid black;
        height: 260px;
        overflow-y: scroll;
        width: 293px;
    }
</style>

<section id="gameEvents" class="events">
</section>
