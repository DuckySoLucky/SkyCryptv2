import type { ProcessedItem } from "$types/stats";
import * as helper from "$lib/helper";

export function getWardrobe(wardrobeInventory: ProcessedItem[]) {
  const wardrobeColumns = wardrobeInventory.length / 4;

  const wardrobe = [];
  for (let i = 0; i < wardrobeColumns; i++) {
    const page = Math.floor(i / 9);

    const wardrobeSlot = [];
    for (let j = 0; j < 4; j++) {
      const index = 36 * page + (i % 9) + j * 9;

      if (helper.getId(wardrobeInventory[index as number]).length > 0) {
        wardrobeSlot.push(wardrobeInventory[index]);
      } else {
        wardrobeSlot.push(null);
      }
    }

    if (wardrobeSlot.find((a) => a !== null) != undefined) {
      wardrobe.push(wardrobeSlot);
    }
  }

  return wardrobe;
}
