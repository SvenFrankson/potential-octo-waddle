class ILevelData {
    width: number;
    height: number;
    initialValues: number[][];
}

class Level {

    private _index: number = 0;
    public width: number = 1;
    public height: number = 1;
    public values: number[][] = [];

    constructor(index: number) {
        this._index = index;
    }

    public canvas: HTMLCanvasElement;
    public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public camera: BABYLON.ArcRotateCamera;
    public light: BABYLON.Light;

    public open(): void {
        $.ajax(
            {
                url: "./views/level.html",
                success: (data) => {
                    Page.Clear();
                    document.getElementById("page").innerHTML = data;
                    
                    document.getElementById("back-main-menu").onclick = () => {
                        LevelSelection.Open();
                    }

                    this.initialize();
                }
            }
        );
    }

    public initialize(): void {
        $.ajax(
            {
                url: "./levels/" + this._index + ".json",
                success: (data: ILevelData) => {
                    this.width = data.width;
                    this.height = data.height;
                    this.values = data.initialValues;
                    this.canvas = document.getElementById("render-canvas") as HTMLCanvasElement;
                    this.engine = new BABYLON.Engine(this.canvas, true);
                    this.createScene();
                    this.animate();
                    let instance = new LevelInstance(this);
                    instance.initialize();
                }
            }
        );
    }
    
    public createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor.copyFromFloats(0, 0, 0, 0);

        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, BABYLON.Vector3.Zero(), this.scene);
        this.camera.setPosition(new BABYLON.Vector3(0, 5, -5));

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