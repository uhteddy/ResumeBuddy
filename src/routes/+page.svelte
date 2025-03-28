<script lang="ts">
  import Database from '@tauri-apps/plugin-sql';
  import { onMount } from 'svelte';

  let result: string = $state('');

  let database: Database;
  $effect(() => {
    Database.load('sqlite:resume.db')
    .then(db => {
      database = db;
      db.select('SELECT * FROM profiles WHERE id = ?', [1]).then((res) => {
        console.log(res)
      });
    })
  })
</script>

<p>test</p>
<a href="/on-boarding/1">Go to welcome</a>
<h1>{result}</h1>