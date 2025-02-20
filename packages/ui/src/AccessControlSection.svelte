<script lang="ts">
  import type { Access } from '@superfluid-wizard/core';

  import ToggleRadio from './inputs/ToggleRadio.svelte';
  import HelpTooltip from './HelpTooltip.svelte';

  export let access: Access;
  export let required: boolean;
  let defaultValueWhenEnabled: 'ownable' | 'roles' = 'ownable';

  let wasRequired = required;
  let wasAccess = access;

  $: {
    if (wasRequired && !required) {
      access = wasAccess;
    } else {
      wasAccess = access;
      if (access === false && required) {
        access = defaultValueWhenEnabled;
      }
    }

    wasRequired = required;
    if (access !== false) {
      defaultValueWhenEnabled = access;
    }
  }
</script>

<section class="controls-section">
  <h2>
    <label class="flex items-center tooltip-container pr-2" for="access-control">
      <span>Access Control</span>
      <span class="ml-1">
        <ToggleRadio name="access-control" bind:value={access} defaultValue="ownable" disabled={required} />
      </span>
      <HelpTooltip align="right" link="https://docs.openzeppelin.com/contracts/4.x/api/access">
        Restrict who can access the functions of a contract or when they can do it.
      </HelpTooltip>
    </label>
  </h2>

  <div class="checkbox-group">
    <label class:checked={access === 'ownable'}>
      <input type="radio" bind:group={access} value="ownable">
      Ownable
      <HelpTooltip link="https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable">
        Simple mechanism with a single account authorized for all privileged actions.
      </HelpTooltip>
    </label>
    <label class:checked={access === 'roles'}>
      <input type="radio" bind:group={access} value="roles">
      Roles
      <HelpTooltip link="https://docs.openzeppelin.com/contracts/4.x/api/access#AccessControl">
        Flexible mechanism with a separate role for each privileged action. A role can have many authorized accounts.
      </HelpTooltip>
    </label>
  </div>
</section>

