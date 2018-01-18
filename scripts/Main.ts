/// <reference path="../lib/babylon.d.ts"/>
/// <reference path="../lib/babylon.gui.d.ts"/>
/// <reference path="../lib/jquery.d.ts"/>

class Main {
    
    public canvas: HTMLCanvasElement;
    public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public camera: BABYLON.ArcRotateCamera;
    public light: BABYLON.Light;
    public guiTexture: BABYLON.GUI.AdvancedDynamicTexture;

    public createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor.copyFromFloats(0, 0, 0, 0);

        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, BABYLON.Vector3.Zero(), this.scene);
        this.camera.setPosition(new BABYLON.Vector3(0, 5, -2));

        this.light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, this.scene);
        this.light.diffuse = new BABYLON.Color3(1, 1, 1);
        this.light.specular = new BABYLON.Color3(1, 1, 1);
    }

    public animate(): void {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    let main = new Main();
    main.canvas = document.getElementById("render-canvas") as HTMLCanvasElement;
    main.engine = new BABYLON.Engine(main.canvas, true);
    main.createScene();
    main.animate();
    main.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUITexture");
    main.guiTexture.idealHeight = 1920;
    MainMenu.Open(main.guiTexture);
});
