class MainMenu {

    public static Open(guiTexture: BABYLON.GUI.AdvancedDynamicTexture): void {
        let background: BABYLON.GUI.Image = new BABYLON.GUI.Image("background", "./img/background.png");
        guiTexture.addControl(background);
    }
}