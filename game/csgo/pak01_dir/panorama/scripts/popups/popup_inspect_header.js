"use strict";
/// <reference path="../csgo.d.ts" />
/// <reference path="../common/iteminfo.ts" />
var InspectHeader;
(function (InspectHeader) {
    let m_showXrayMachineUi = false;
    function Init(elPanel, itemId, funcGetSettingCallback) {
        m_showXrayMachineUi = (funcGetSettingCallback("showXrayMachineUi", "no") === 'yes') ? true : false;
        if (funcGetSettingCallback('inspectonly', 'false') === 'false' && !m_showXrayMachineUi)
            return;
        elPanel.RemoveClass('hidden');
        _SetName(elPanel, itemId, funcGetSettingCallback);
        _SetRarity(elPanel, itemId);
        _SetCollectionInfo(elPanel, itemId);
        _SetRentalTime(elPanel, itemId);
    }
    InspectHeader.Init = Init;
    function _SetName(elPanel, ItemId, funcGetSettingCallback) {
        let strViewFunc = funcGetSettingCallback ? funcGetSettingCallback('viewfunc', '') : '';
        if (ItemInfo.ItemDefinitionNameSubstrMatch(ItemId, 'tournament_journal_'))
            ItemId = (strViewFunc === 'primary') ? ItemId : ItemInfo.GetFauxReplacementItemID(ItemId, 'graffiti');
        elPanel.SetDialogVariable('item_name', InventoryAPI.GetItemNameUncustomized(ItemId));
        elPanel.SetDialogVariable('item_custom_name', InventoryAPI.GetItemNameCustomized(ItemId));
        const bShowCustomName = InventoryAPI.HasCustomName(ItemId);
        elPanel.FindChildInLayoutFile('InspectCustomName').visible = bShowCustomName;
        elPanel.FindChildInLayoutFile('InspectName').SetHasClass('text-align-left', ItemInfo.GetSet(ItemId) !== '');
    }
    function _SetRentalTime(elPanel, ItemId) {
        if (!InventoryAPI.IsRental(ItemId)) {
            elPanel.FindChildInLayoutFile('ItemRentalTime').SetHasClass('hide', true);
            return;
        }
        let seconds = InventoryAPI.GetExpirationDate(ItemId);
        let oLocData = FormatText.FormatRentalTime(seconds);
        elPanel.SetDialogVariable('time-remaining', oLocData.time);
        elPanel.FindChildInLayoutFile('ItemRentalTime').SetHasClass('hide', false);
    }
    function _SetRarity(elPanel, itemId) {
        let rarityColor = InventoryAPI.GetItemRarityColor(itemId);
        if (rarityColor) {
            elPanel.FindChildInLayoutFile('InspectBar').style.washColor = rarityColor;
        }
    }
    function _SetCollectionInfo(elPanel, itemId) {
        let setName = ItemInfo.GetSet(itemId);
        let elImage = elPanel.FindChildInLayoutFile('InspectSetImage');
        let elLabel = elPanel.FindChildInLayoutFile('InspectCollection');
        if (setName === '') {
            elImage.visible = false;
            elLabel.visible = false;
            return;
        }
        elLabel.text = $.Localize('#CSGO_' + setName);
        elLabel.visible = true;
        elImage.SetImage('file://{images}/econ/set_icons/' + setName + '_small.png');
        elImage.visible = true;
    }
})(InspectHeader || (InspectHeader = {}));
