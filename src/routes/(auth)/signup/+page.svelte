<script lang="ts">
  import supabase from "$lib/utils/supabase";
  import Alert from "$lib/components/Alert.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import { loadSettings } from "$lib/stores/settingsStore";

  let fullName = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let message = "";
  let isSignupFormShowing = true;
  let isLoading = false;

  const handleSubmit = async () => {
    isLoading = true;
    message = "";
    // make sure password matched with confirmPassword
    if (password !== confirmPassword) {
      message = "Your password and confirm password don't match";
      isLoading = false;
      return;
    }

    const { data: userData, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      message = error.message;
      console.error(error);
    }

    // add fullname to setting table
    if (userData.user?.id) {
      const { data: settings, error: settingError } = await supabase
        .from("Settings")
        .insert({ myName: fullName, userId: userData.user.id });

      if (settingError) {
        message = settingError.message;
        console.error(settingError.message);
        isLoading = false;
        return;
      }
    }

    isSignupFormShowing = false;
    isLoading = false;
  };
</script>

{#if isSignupFormShowing}
  <h1 class="auth-heading">Sign Up</h1>
  <Alert {message} />
  <form on:submit|preventDefault={handleSubmit}>
    <fieldset disabled={isLoading}>
      <div class="field">
        <label for="fullName" class="text-goldenFizz">Full Name</label>
        <input type="text" name="fullName" id="fullName" required bind:value={fullName} />
      </div>
      <div class="field">
        <label for="email" class="text-goldenFizz">Email Address</label>
        <input type="email" name="email" id="email" required bind:value={email} />
      </div>
      <div class="field">
        <label for="password" class="text-goldenFizz">Password</label>
        <input type="password" name="password" id="password" required bind:value={password} />
      </div>
      <div class="field">
        <label for="confirmPassword" class="text-goldenFizz">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
          bind:value={confirmPassword}
        />
      </div>
      <button type="submit" class="auth-button flex justify-center gap-x-2 items-center">
        {#if isLoading}
          <Loader />Load...
        {:else}
          Count me in!
        {/if}
      </button>
      <p class="mt-4 text-center text-sm text-white">
        <a href="/login" class="underline hover:no-underline">Already have an account?</a>
      </p>
    </fieldset>
  </form>
{:else}
  <Alert message="Check your email for the confirmation link" />
  <a href="/login" class="auth-button block text-center">Login</a>
{/if}
