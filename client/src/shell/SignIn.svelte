<script>
    import {CredentialsChecker} from '@fix-and-go/logic'
    import {createEventDispatcher, onDestroy, onMount} from 'svelte'
    import {showSignIn, signInError} from '../ui-state';
    import ActionPopover from './ActionPopover.svelte'

    let email
    let forgotPassword = false
    let password
    let signInMode = true
    let username

    const dispatch = createEventDispatcher()

    const credentialsChecker = new CredentialsChecker()

    const showSignInUnsubscribe = showSignIn.subscribe(doSignIn => {
        if (!doSignIn) {
            return;
        }
        email = '';
        password = '';
        username = '';
    });

    onMount(async () => {
    })

    onDestroy(() => {
        showSignInUnsubscribe();
    })

    function signIn() {
        doSignIn().then();
    }

    async function doSignIn() {
        const errorResponse = credentialsChecker
            .checkSignInCredentials(email, password);
        if (errorResponse) {
            signInError.set({
                eventId: 0,
                value: errorResponse.description
            });
            return;
        }
        dispatch('signIn', {
            encodedEmail: await encodeString(email),
            encodedPassword: await encodeString(password)
        });
    }

    function setSignIn(signInVal) {
        signInMode = signInVal
    }

    function signUp() {
        doSignUp().then()
    }

    async function doSignUp() {
        const errorResponse = credentialsChecker
            .checkSignUpCredentials(username, email, password);
        if (errorResponse) {
            signInError.set({
                eventId: 0,
                value: errorResponse.description
            });
            return;
        }

        dispatch('signUp', {
            encodedEmail: await encodeString(email),
            encodedPassword: await encodeString(password),
            username
        });
    }

    async function encodeString(
        aString
    ) {
        const jsSHA = await import('jssha/dist/sha512')

        const shaObj = new jsSHA.default('SHA-512', 'TEXT')
        shaObj.update(aString)

        return shaObj.getHash('B64')
    }

    function resetPassword() {
        const errorResponse = credentialsChecker
            .checkResetPasswordCredentials(email);
        if (errorResponse) {
            signInError.set({
                eventId: 0,
                value: errorResponse.description
            });
            return;
        }

        // doResetPassword(email).then(
        //     success => {
        //         if (success) {
        //             dispatch('closed')
        //         }
        //     })
    }

</script>

<style>
    nav {
        color: blue;
        display: inline-block;
        text-decoration: underline;
    }

    table {
        width: 100%;
    }

    td {
        height: initial;
        width: initial;
        border: 0px;
    }

    td:first-child {
        text-align: right;
        width: 40%;
    }

    .error {
        padding: 5px;
        text-align: center;
    }

</style>

<ActionPopover
        customCancel="true"
        maxWidth="400px"
        on:cancel="{() => dispatch('closed')}"
>
    <div slot="header">
        {#if signInMode}
        Sign In
        {:else}
        Sign Up
        {/if}
    </div>
    <div slot="content">
        {#if signInMode}
        New Users:
        <nav
                on:click="{() => setSignIn(false)}"
        >
            Sign Up
        </nav>
        {:else}
        Existing Users:
        <nav
                on:click="{() => setSignIn(true)}"
        >
            Sign In
        </nav>
        {/if}
        <br>
        {#if $signInError}
        <div
                class="error"
        >
            {$signInError.value}
        </div>
        {/if}
        <br>
        <form>
            <table>
                {#if !signInMode}
                <tr>
                    <td>
                        <label for="username">Username: </label>
                    </td>
                    <td>
                        <input
                                bind:value={username}
                                class="chat-input"
                                name="username"
                                type="text"
                        >
                    </td>
                </tr>
                {/if}
                <tr>
                    <td>
                        <label for="email">E-Mail: </label>
                    </td>
                    <td>
                        <input
                                bind:value={email}
                                class="chat-input"
                                name="email"
                                type="text"
                        >
                    </td>
                </tr>
                {#if !forgotPassword}
                <tr>
                    <td>
                        <label for="password">Password: </label>
                    </td>
                    <td>
                        <input
                                bind:value={password}
                                class="chat-input"
                                name="password"
                                type="password"
                        >
                    </td>
                </tr>
                {/if}
            </table>
        </form>
        <br>
    </div>
    <div slot="actions">
        {#if signInMode}
        <button
                on:click="{signIn}"
        >Sign In
        </button>
        {:else if forgotPassword}
        <button
                on:click="{resetPassword}"
        >Reset Password
        </button>
        {:else}
        <button
                on:click="{signUp}"
        >Sign Up
        </button>
        {/if}
    </div>
</ActionPopover>
