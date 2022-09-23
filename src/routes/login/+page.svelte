<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form method="post" use:enhance>
	{#if form?.missing}<p class="error">The email field is required</p>{/if}
	{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}
	<label for="email">Email</label>
	<input name="email" type="email" value={form?.email ?? ''} />

	<br />
	<br />

	<label for="password">Password</label>
	<input type="password" name="password" id="password" />

	<button type="submit">Login</button>
</form>
