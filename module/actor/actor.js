/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IcrpgActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCommonData(actorData)
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    if (actorData.type === 'npc') this._prepareNpcData(actorData);
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareCommonData(actorData) {
    const data = actorData.data;

    data.effort.basic.die = "d4";
    data.effort.weapon.die = "d6";
    if (!data.effort.gun)
      data.effort.gun = { value: 0, base: 0, loot: 0 };
    data.effort.gun.die = "d8";
    data.effort.magic.die = "d10";
    data.effort.ultimate.die = "d12";
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;

    for (let [id, stat] of Object.entries(data.stats)) {
      stat.value = Number(stat.base) + Number(stat.loot);
    }

    for (let [id, eff] of Object.entries(data.effort)) {
      eff.value = Number(eff.base) + Number(eff.loot);
    }

    data.armor.value = Math.min(20, 10 + Number(data.armor.base) + Number(data.armor.loot));
    /*
        data.armour = actorData
          .items
          .map(item => item.data.armour * item.data.equipped)
          .reduce((a,b) => a + b, 0)
    */
  }

  /**
   * Prepare NPC type specific data
   */
  _prepareNpcData(actorData) {
    const data = actorData.data;

  }

  getRollData() {
    const data = super.getRollData();
    // Let us do @str etc, instead of @stats.str.value
    for (let [id, stat] of Object.entries(data.stats)) { // @stats.*.value
      if (!(id in data)) data[id] = stat.value;
    }
    for (let [id, eff] of Object.entries(data.effort)) { // @effort.*.value
      if (!(id in data)) data[id] = eff.value;
    }
    return data
  }

  /* TODO: quantity decrease not applied after refreshing page
    deleteOwnedItem(itemId) {
      const item = this.getOwnedItem(itemId);
      if (item.data.data.quantity > 1) {
        item.data.data.quantity--;
      } else {
        super.deleteOwnedItem(itemId);
      }
    }
  */
}
