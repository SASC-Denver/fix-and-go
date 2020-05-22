<script>
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {lastChatBatch} from "./ui-state";

    const dispatch = createEventDispatcher();

    let gameChatElement;

    let newMessage;

    let lastReceivedChatSecond = 0

    let lastSecondReceivedChatIds = {}

    const chatSubscription = lastChatBatch.subscribe(serverMessage => {
        serverMessage.forEach(messagesForSecond => {
            if (messagesForSecond.second < lastReceivedChatSecond) {
                return;
            }
            let messages = messagesForSecond.messages;
            if (messagesForSecond.second === lastReceivedChatSecond) {
                messages = messagesForSecond.messages.filter(message => {
                    return !lastSecondReceivedChatIds[message.id]
                })
            }
            messages.forEach(chatMessage => {
                const chatElement = document.createElement('div');
                chatElement.innerText = chatMessage.username + ': ' + chatMessage.text;
                gameChatElement.appendChild(chatElement);
            })
        })

        if (serverMessage.length) {
            const lastSecondMessages = serverMessage[serverMessage.length - 1];
            lastReceivedChatSecond = lastSecondMessages.second
            lastSecondReceivedChatIds = {}
            lastSecondMessages.messages.forEach(message => {
                lastSecondReceivedChatIds[message.id] = true
            })
        }

    });


    onMount(() => {
        gameChatElement = document.getElementById('gameChat');
    });

    onDestroy(() => {
        console.log('Leaving Chat.')
        chatSubscription.unsubscribe();
    });

    function handleKeyUp(event) {
        if (event.key !== 'Enter') {
            return;
        }
        if (!newMessage || !newMessage.trim()) {
            return;
        }
        // console.log(event)
        dispatch('chat', {
            text: newMessage.trim()
        });
        newMessage = ''
    }
</script>
<style>
    .chat {
        border-left: 1px solid black;
        border-right: 1px solid black;
        border-top: 1px solid black;
        height: 250px;
        overflow-y: scroll;
        width: 293px;
    }

    .chat-input {
        border-bottom: 1px solid black;
        border-left: 1px solid black;
        border-right: 1px solid black;
        width: 293px;
    }
</style>

<section id="gameChat" class="chat">
</section>
<input
        bind:value={newMessage}
        class="chat-input"
        on:keyup={handleKeyUp}
        type="text"
>
