class MainMenu {

    public static Open(guiTexture: BABYLON.GUI.AdvancedDynamicTexture): void {
        let background: BABYLON.GUI.Image = new BABYLON.GUI.Image("background", "./img/background.png");
        guiTexture.addControl(background);

        let playButton: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("play-button", "./img/play-button.png");
        playButton.height = "465px";
        playButton.width = "897px";
        playButton.top = "-849px";
        playButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        playButton.thickness = 0;
        guiTexture.addControl(playButton);
        
        let optionsButton: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("options-button", "./img/options-button.png");
        optionsButton.height = "239px";
        optionsButton.width = "642px";
        optionsButton.top = "-510px";
        optionsButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        optionsButton.thickness = 0;
        guiTexture.addControl(optionsButton);
        
        let aboutButton: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("about-button", "./img/about-button.png");
        aboutButton.height = "151px";
        aboutButton.width = "370px";
        aboutButton.top = "-245px";
        aboutButton.left = "-245px";
        aboutButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        aboutButton.thickness = 0;
        guiTexture.addControl(aboutButton);
        
        let licenceButton: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("licence-button", "./img/licence-button.png");
        licenceButton.height = "151px";
        licenceButton.width = "370px";
        licenceButton.top = "-245px";
        licenceButton.left = "245px";
        licenceButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        licenceButton.thickness = 0;
        guiTexture.addControl(licenceButton);
    }
}