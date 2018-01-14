class LevelInstance {

    private _level: Level;
    private _tiles: BABYLON.Mesh[][];

    constructor(level: Level) {
        this._level = level;
        this._tiles = [];
    }

    public initialize(): void {
        for (let j = 0; j < this._level.height; j++) {
            this._tiles[j] = [];
            for (let i = 0; i < this._level.width; i++) {
                BABYLON.SceneLoader.ImportMesh(
                    "",
                    "./datas/tile.babylon",
                    "",
                    this._level.scene,
                    (meshes) => {
                        this._tiles[j][i] = new BABYLON.Mesh("Tile-" + i + "-" + j, this._level.scene);
                        this._tiles[j][i].position.x = i - (this._level.width - 1) / 2;
                        this._tiles[j][i].position.z = (this._level.height - 1) / 2 - j;
                        this._tiles[j][i].position.scaleInPlace(1.05);
                        if (this._level.values[j][i] === 0) {
                            this._tiles[j][i].rotation.x = Math.PI;
                        }
                        meshes.forEach(
                            (m) => {
                                m.parent = this._tiles[j][i];
                                if (m.name === "Picture") {
                                    if (m.material instanceof BABYLON.StandardMaterial) {
                                        m.material.diffuseTexture = new BABYLON.Texture("./img/" + j + "-" + i + ".png", this._level.scene);
                                    }
                                }
                            }
                        )
                    }
                );
            }
        }
    }

    public ijFromMesh(mesh: BABYLON.Mesh): {j: number, i: number} {
        for (let j = 0; j < this._level.height; j++) {
            for (let i = 0; i < this._level.width; i++) {
                if (this._tiles[j][i] === mesh) {
                    return {j: j, i: i};
                }
            }
        }
        return undefined;
    }

    public flip(i: number, j: number, callback: () => void): void {
        this._k = 0;
        this._flipingI = i;
        this._flipingJ = j;
        this._flipingCallback = callback;
        this._level.scene.registerBeforeRender(this._flipAnim);
    }

    private _flipingI: number;
    private _flipingJ: number;
    private _flipingCallback: () => void;
    private _k: number = 0;
    private _flipAnim = () => {
        let length = 40;
        let halfLength = length / 2;
        let i = this._flipingI;
        let j = this._flipingJ;
        let t = this._tiles[j][i];

        let tx = 0;
        if (this._level.values[j][i] === 0) {
            tx = Math.PI;
        }
        t.rotation.x = tx + Math.PI / halfLength * BABYLON.MathTools.Clamp(this._k, 0, halfLength);
        let s = BABYLON.MathTools.Clamp(this._k, 0, halfLength);
        s = 1 - (0.5 - Math.abs(s / halfLength - 0.5));
        t.scaling.copyFromFloats(s, s, s);

        for (let k = -1; k < 2; k++) {
            for (let l = -1; l < 2; l++) {
                if (!(k === 0 && l === 0)) {
                    if (this._tiles[j + l]) {
                        let t = this._tiles[j + l][i + k];
                        if (t) {
                            tx = 0;
                            if (this._level.values[j + l][i + k] === 0) {
                                tx = Math.PI;
                            }
                            t.rotation.x = tx + Math.PI / halfLength * BABYLON.MathTools.Clamp(this._k - halfLength, 0, halfLength);
                            let s = BABYLON.MathTools.Clamp(this._k - halfLength, 0, halfLength);
                            s = 1 - (0.5 - Math.abs(s / halfLength - 0.5));
                            t.scaling.copyFromFloats(s, s, s);
                        }
                    }
                }
            }
        }

        this._k++;
        if (this._k > length) {
            this._level.scene.unregisterBeforeRender(this._flipAnim);
            if (this._flipingCallback) {
                this._flipingCallback();
            }
        }
    }

    public victory(callback: () => void): void {
        this._k = 0;
        this._victoryCallback = callback;
        this._level.scene.registerBeforeRender(this._victoryAnim);
    }

    private _victoryCallback: () => void;
    private _victoryAnim = () => {
        this._k++;
        if (this._k > 60) {
            this._level.scene.unregisterBeforeRender(this._victoryAnim);
            if (this._victoryCallback) {
                this._victoryCallback();
            }
        }
    }
}