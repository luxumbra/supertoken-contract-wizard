<script lang="ts">
  import type { Info } from '@superfluid-wizard/core';
  import { infoDefaults } from '@superfluid-wizard/core';

  import HelpTooltip from './HelpTooltip.svelte';

  export let info: Info;
</script>

<section class="controls-section">
  <h2>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="flex items-center tooltip-container pr-2">
      <span>Info</span>
    </label>
  </h2>

  <label class="labeled-input">
    <span class="flex justify-between pr-2">
      Security Contact
      <HelpTooltip link="https://github.com/ethereum-lists/contracts/blob/main/README.md#tracking-new-deployments">
      Where people can contact you to report security issues. Will only be visible if contract metadata is verified.
      </HelpTooltip>
    </span>
    <input bind:value={info.securityContact} placeholder="security@example.com" />
  </label>

  <label class="labeled-input">
    <span>License</span>
    <input bind:value={info.license} placeholder={infoDefaults.license} />
  </label>
</section>

