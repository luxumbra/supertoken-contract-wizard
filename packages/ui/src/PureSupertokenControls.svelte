<script lang="ts">
  
  import type { KindedOptions } from '@openzeppelin/wizard';
  import { infoDefaults, premintPattern } from '@openzeppelin/wizard';
  import { pureSupertoken } from '@openzeppelin/wizard/src/api';
  import { pureSupertokenDefaults } from '@openzeppelin/wizard/src/puretoken';
  import AccessControlSection from './AccessControlSection.svelte';
  import HelpTooltip from './HelpTooltip.svelte';
  import InfoSection from './InfoSection.svelte';
  import UpgradeabilitySection from './UpgradeabilitySection.svelte';

  export const opts: Required<KindedOptions['PURE']> = {
    kind: 'PURE',
    ...pureSupertokenDefaults,
    info: { ...infoDefaults }, // create new object since Info is nested
  };

  $: requireAccessControl = pureSupertoken.isAccessControlRequired(opts);
</script>

<section class="controls-section">
  <h1>Settings</h1>

    <div class="grid grid-cols-[2fr,1fr] gap-2">
      <label class="labeled-input">
        <span>Name 2:</span>
        <input bind:value={opts.name}>
      </label>

      <label class="labeled-input">
        <span>Symbol</span>
        <input bind:value={opts.symbol}>
      </label>
    </div>

    <label class="labeled-input">
      <span class="flex justify-between pr-2">
        Premint
        <HelpTooltip>Create an initial amount of tokens for the deployer.</HelpTooltip>
      </span>
      <input bind:value={opts.initialSupply} placeholder="0" pattern={premintPattern.source}>
    </label>
</section>

<section class="controls-section">
  <h1>Features</h1>

  <div class="checkbox-group">
    <label class:checked={opts.mintable}>
      <input type="checkbox" bind:checked={opts.mintable}>
      Mintable
      <HelpTooltip>
        Privileged accounts will be able to create more supply.
      </HelpTooltip>
    </label>

    <label class:checked={opts.burnable}>
      <input type="checkbox" bind:checked={opts.burnable}>
      Burnable
      <HelpTooltip>
        Token holders will be able to destroy their tokens.
      </HelpTooltip>
    </label>
  </div>
</section>

<AccessControlSection bind:access={opts.access} required={requireAccessControl} />

<UpgradeabilitySection bind:upgradeable={opts.upgradeable} />

<InfoSection bind:info={opts.info} />
