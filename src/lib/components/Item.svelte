<script lang="ts">
  import { page } from "$app/stores";
  import { getRarityClass, isEnchanted, removeFormatting, renderLore } from "$lib/tools";
  import { cn, flyAndScale } from "$lib/utils";
  import type { ProcessedItem, ProcessedPet } from "$types/global";
  import { Avatar, Dialog, ScrollArea, Tooltip } from "bits-ui";
  import Image from "lucide-svelte/icons/image";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";

  export let piece: ProcessedItem;
  export let isInventory = false;
  export let showCount = true;

  const itemName = (piece as ProcessedItem).tag?.display?.Name ?? piece.display_name ?? "???";
  const itemNameHtml = renderLore(itemName);
  const isMulticolor = (itemNameHtml.match(/<\/span>/g) || []).length > 1;
  const bgColor = piece.rarity ? getRarityClass(piece.rarity.toLowerCase() as string, "bg") : "bg-background";
  const enchanted = isEnchanted(piece as ProcessedItem);

  const showNumbers = showCount && piece.Count > 1;

  const processedItem = piece as ProcessedItem;
  const processedPet = piece as unknown as ProcessedPet;

  const dialogOpen = writable<boolean>(false);
  const tooltipContentElement = writable<HTMLDivElement>();

  tooltipContentElement.subscribe((el) => {
    // extract the style string from the tooltip content element
    if (el) {
      const top = el.style.cssText;
      const left = el.style.getPropertyValue("left");

      console.log(`Tooltip content position: ${top} ${left}`);
    }
  });
</script>

<div class="nice-colors-dark contents">
  <Dialog.Root bind:open={$dialogOpen}>
    <Tooltip.Root group="armor" openDelay={0} closeDelay={90000000}>
      <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
        <Dialog.Trigger asChild let:builder={dialogBuilder}>
          <button class={cn(`relative flex items-center justify-center rounded-lg`, isInventory ? "p-0" : `p-4 ${bgColor}`)} use:tooltipBuilder.action {...tooltipBuilder} use:dialogBuilder.action {...dialogBuilder}>
            <Avatar.Root>
              <Avatar.Image src={$page.url.origin + piece.texture_path} alt={piece.display_name} class="data-[enchanted=true]:enchanted h-auto w-16 select-none" data-enchanted={enchanted} />
              <Avatar.Fallback>
                <Image class="size-16" />
              </Avatar.Fallback>
            </Avatar.Root>
            {#if showNumbers}
              <div class="absolute bottom-0.5 right-0.5 text-2xl font-semibold text-white text-shadow-[.1em_.1em_.1em_#000]">
                {piece.Count}
              </div>
            {/if}
          </button>
        </Dialog.Trigger>
      </Tooltip.Trigger>
      <Tooltip.Content class="z-50 w-max min-w-96 max-w-[calc(100vw-2.5rem)] select-text overflow-hidden rounded-lg bg-background-lore font-icomoon" transition={flyAndScale} transitionConfig={{ x: -8, duration: 150 }} sideOffset={8} side="right" align="center" fitViewport={true} overlap={true} collisionBoundary={"clippingAncestors"} bind:el={$tooltipContentElement}>
        <div class={cn(`flex flex-nowrap items-center justify-center gap-4 p-5`, bgColor)}>
          <Avatar.Root>
            <Avatar.Image src={$page.url.origin + piece.texture_path} alt={piece.display_name} class="data-[enchanted=true]:enchanted h-auto w-8 flex-none overflow-hidden" data-enchanted={enchanted} />
            <Avatar.Fallback>
              <Image class="size-8" />
            </Avatar.Fallback>
          </Avatar.Root>
          <p class="relative flex-1 text-center text-lg font-semibold uppercase data-[multicolor=true]:rounded-full data-[multicolor=true]:bg-background-lore data-[multicolor=true]:px-2 data-[multicolor=true]:py-1 data-[multicolor=false]:text-text" data-multicolor={isMulticolor}>
            {@html isMulticolor ? itemNameHtml : removeFormatting(itemNameHtml)}
          </p>
        </div>
        <ScrollArea.Root type="hover" class="relative px-4">
          <ScrollArea.Viewport class="h-full  w-full">
            <ScrollArea.Content class="nice-colors-auto p-6 font-semibold leading-snug" asChild let:builder>
              <p use:builder.action {...builder}>
                {#if processedItem.tag?.display?.Lore}
                  {#each processedItem.tag.display.Lore as lore}
                    {@html renderLore(lore)}
                  {/each}
                {:else if processedPet.lore}
                  {#each processedPet.lore as lore}
                    {@html renderLore(lore)}
                  {/each}
                {/if}
              </p>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" class="flex h-full w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all hover:w-3">
            <ScrollArea.Thumb class={cn("relative flex-1 rounded-full opacity-40 transition-opacity hover:opacity-100", bgColor)} />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </Tooltip.Content>
    </Tooltip.Root>

    <Dialog.Portal>
      <Dialog.Overlay transition={fade} transitionConfig={{ duration: 150 }} class="fixed inset-0 z-50 bg-black/80" />

      <Dialog.Content class="fixed left-[50%] top-[50%] z-50 w-max min-w-96 max-w-[calc(100vw-2.5rem)] translate-x-[-50%] translate-y-[-50%] select-text overflow-hidden rounded-lg bg-background-lore font-icomoon" transition={flyAndScale} transitionConfig={{ y: 8, duration: 150 }}>
        <div class={cn(`flex flex-nowrap items-center justify-center gap-4 p-5`, bgColor)}>
          <Avatar.Root>
            <Avatar.Image src={$page.url.origin + piece.texture_path} alt={piece.display_name} class="data-[enchanted=true]:enchanted h-auto w-8 flex-none overflow-hidden" data-enchanted={enchanted} />
            <Avatar.Fallback>
              <Image class="size-8" />
            </Avatar.Fallback>
          </Avatar.Root>

          <p class="relative flex-1 text-center text-lg font-semibold uppercase data-[multicolor=true]:rounded-full data-[multicolor=true]:bg-background-lore data-[multicolor=true]:px-2 data-[multicolor=true]:py-1 data-[multicolor=false]:text-text" data-multicolor={isMulticolor}>
            {@html isMulticolor ? itemNameHtml : removeFormatting(itemNameHtml)}
          </p>
        </div>
        <ScrollArea.Root type="hover" class="relative px-4">
          <ScrollArea.Viewport class="h-full max-h-[85dvh] w-full">
            <ScrollArea.Content class="nice-colors-auto p-6 font-semibold leading-snug" asChild let:builder>
              <p use:builder.action {...builder}>
                {#if processedItem.tag?.display?.Lore}
                  {#each processedItem.tag.display.Lore as lore}
                    {@html renderLore(lore)}
                  {/each}
                {:else if processedPet.lore}
                  {#each processedPet.lore as lore}
                    {@html renderLore(lore)}
                  {/each}
                {/if}
              </p>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" class="flex h-full w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all hover:w-3">
            <ScrollArea.Thumb class={cn("relative flex-1 rounded-full opacity-40 transition-opacity hover:opacity-100", bgColor)} />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</div>
