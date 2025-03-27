<script lang="ts">
  import Database from '@tauri-apps/plugin-sql';
  import { onMount } from 'svelte';

  let result: string = $state('');

  onMount(async () => {
    const db = await Database.load('sqlite:resume.db');
    db.select('SELECT * FROM projects WHERE id = ?', [1]).then((res) => {
      console.log(res)
    });
  })
</script>

<p>test</p>
<h1>{result}</h1>