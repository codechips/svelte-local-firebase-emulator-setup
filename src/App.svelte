<script>
  import { onMount } from 'svelte';
  import { db, funcs } from './firebase';
  import firebase from 'firebase/app';
  import 'firebase/firebase-firestore';

  let message = '';
  let todo = '';
  let todos = [];

  // Firestore collection reference
  let todoCollection = null;

  // Firestore server timestamp function
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;

  onMount(async () => {
    // reference to our cloud function
    const helloFn = funcs().httpsCallable('helloWorld');
    const response = await helloFn();

    // assign result to message variable
    message = response.data.message;

    // assign collection to a variable
    todoCollection = db().collection('todos');

    // create a firestore listener that listens to collection changes
    const unsubscribe = todoCollection.orderBy('createdAt', 'desc').onSnapshot(ss => {
      let docs = [];
      // snapshot has only a forEach method
      ss.forEach(doc => {
        docs = [...docs, { id: doc.id, ...doc.data() }];
      });
      // replace todo variable with firebase snapshot changes
      todos = docs;
    });

    // unsubscribe to Firestore collection listener when unmounting
    return unsubscribe;
  });

  const submitHandler = async () => {
    if (!todo) return;
    // create new todo document
    await todoCollection.add({ action: todo, createdAt: timestamp() });
    todo = '';
  };
</script>

<h2>Functions Emulator</h2>
<!-- result from the helloWorld Firebase function call -->
<p>{message}</p>

<h2>Firestore Emulator</h2>
<form on:submit|preventDefault={submitHandler}>
  <input type="text" bind:value={todo} placeholder="Add new todo" />
  <button type="submit">add</button>
</form>

{#if todos.length}
  <ul>
    {#each todos as todo (todo.id)}
      <li>{todo.action}</li>
    {/each}
  </ul>
{:else}
  <p>No todos. Please add one.</p>
{/if}
