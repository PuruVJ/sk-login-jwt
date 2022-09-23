<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" type="text" value={form?.username ?? ''} />

	<br />
	<br />

	<label for="email">Email</label>
	<input name="email" type="email" value={form?.email ?? ''} />

	<br />
	<br />

	<label for="password">Password</label>
	<input type="password" name="password" id="password" />

	<button type="submit">Login</button>
</form>
