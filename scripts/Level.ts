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
    public instance: LevelInstance;

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

                    document.getElementById("victory-next").onpointerup = () => {
                        let level = new Level(this._index + 1);
                        level.open();
                    }
                    
                    document.getElementById("back-main-menu").onpointerup = () => {
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
                    this.instance = new LevelInstance(this);
                    this.instance.initialize();
                    this.canvas.onpointerup = () => {
                        let pick = this.scene.pick(
                            this.scene.pointerX,
                            this.scene.pointerY
                        );
                        if (pick.hit) {
                            let ij = this.instance.ijFromMesh(pick.pickedMesh.parent as BABYLON.Mesh);
                            if (ij) {
                                console.log("IJ = " + JSON.stringify(ij));
                                this.instance.flip(
                                    ij.i,
                                    ij.j,
                                    () => {
                                        this.values[ij.j][ij.i] = (this.values[ij.j][ij.i] + 1) % 2;
                                        for (let k = -1; k < 2; k++) {
                                            for (let l = -1; l < 2; l++) {
                                                if (!(k === 0 && l === 0)) {
                                                    if (this.values[ij.j + l]) {
                                                        if (isFinite(this.values[ij.j + l][ij.i + k])) {
                                                            this.values[ij.j + l][ij.i + k] = (this.values[ij.j + l][ij.i + k] + 1) % 2;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (this.checkVictory()) {
                                            this.victory();
                                        }
                                    }
                                );
                            }
                        }
                    }
                }
            }
        );
    }

    public checkVictory(): boolean {
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                if (this.values[j][i] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    public victory(): void {
        this.instance.victory(
            () => {
                document.getElementById("level-victory-zone").removeAttribute("hidden");
                ScoreManager.setScore(this._index, 3);
            }
        )
    }
    
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