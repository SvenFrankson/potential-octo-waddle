class ILevelData {
}
class Level {
    constructor(index) {
        this._index = 0;
        this.width = 1;
        this.height = 1;
        this.values = [];
        this._index = index;
    }
    open() {
        $.ajax({
            url: "./views/level.html",
            success: (data) => {
                Page.Clear();
                document.getElementById("page").innerHTML = data;
                document.getElementById("back-main-menu").onclick = () => {
                    LevelSelection.Open();
                };
                this.initialize();
            }
        });
    }
    initialize() {
        $.ajax({
            url: "./levels/" + this._index + ".json",
            success: (data) => {
                this.width = data.width;
                this.height = data.height;
                this.values = data.initialValues;
                this.canvas = document.getElementById("render-canvas");
                this.engine = new BABYLON.Engine(this.canvas, true);
                this.createScene();
                this.animate();
                let instance = new LevelInstance(this);
                instance.initialize();
                this.canvas.onpointerup = () => {
                    let pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                    if (pick.hit) {
                        let ij = instance.ijFromMesh(pick.pickedMesh.parent);
                        if (ij) {
                            console.log("IJ = " + JSON.stringify(ij));
                            instance.flip(ij.i, ij.j, () => {
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
                            });
                        }
                    }
                };
            }
        });
    }
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor.copyFromFloats(0, 0, 0, 0);
        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, BABYLON.Vector3.Zero(), this.scene);
        this.camera.setPosition(new BABYLON.Vector3(0, 5, -2));
        this.light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, this.scene);
        this.light.diffuse = new BABYLON.Color3(1, 1, 1);
        this.light.specular = new BABYLON.Color3(1, 1, 1);
    }
    animate() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}
class LevelInstance {
    constructor(level) {
        this._k = 0;
        this._flipAnim = () => {
            let i = this._flipingI;
            let j = this._flipingJ;
            let t = this._tiles[j][i];
            let tx = 0;
            if (this._level.values[j][i] === 0) {
                tx = Math.PI;
            }
            t.rotation.x = tx + Math.PI / 30 * BABYLON.MathTools.Clamp(this._k, 0, 30);
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
                                t.rotation.x = tx + Math.PI / 30 * BABYLON.MathTools.Clamp(this._k - 30, 0, 30);
                            }
                        }
                    }
                }
            }
            this._k++;
            if (this._k > 60) {
                this._level.scene.unregisterBeforeRender(this._flipAnim);
                if (this._flipingCallback) {
                    this._flipingCallback();
                }
            }
        };
        this._level = level;
        this._tiles = [];
    }
    initialize() {
        for (let j = 0; j < this._level.height; j++) {
            this._tiles[j] = [];
            for (let i = 0; i < this._level.width; i++) {
                BABYLON.SceneLoader.ImportMesh("", "./datas/tile.babylon", "", this._level.scene, (meshes) => {
                    this._tiles[j][i] = new BABYLON.Mesh("Tile-" + i + "-" + j, this._level.scene);
                    this._tiles[j][i].position.x = i - (this._level.width - 1) / 2;
                    this._tiles[j][i].position.z = (this._level.height - 1) / 2 - j;
                    this._tiles[j][i].position.scaleInPlace(1.05);
                    if (this._level.values[j][i] === 0) {
                        this._tiles[j][i].rotation.x = Math.PI;
                    }
                    meshes.forEach((m) => {
                        m.parent = this._tiles[j][i];
                        if (m.name === "Picture") {
                            if (m.material instanceof BABYLON.StandardMaterial) {
                                m.material.diffuseTexture = new BABYLON.Texture("./img/" + j + "-" + i + ".png", this._level.scene);
                            }
                        }
                    });
                });
            }
        }
    }
    ijFromMesh(mesh) {
        for (let j = 0; j < this._level.height; j++) {
            for (let i = 0; i < this._level.width; i++) {
                if (this._tiles[j][i] === mesh) {
                    return { j: j, i: i };
                }
            }
        }
        return undefined;
    }
    flip(i, j, callback) {
        this._k = 0;
        this._flipingI = i;
        this._flipingJ = j;
        this._flipingCallback = callback;
        this._level.scene.registerBeforeRender(this._flipAnim);
    }
}
class LevelSelection {
    static Open() {
        $.ajax({
            url: "./views/level-selection.html",
            success: (data) => {
                Page.Clear();
                document.getElementById("page").innerHTML = data;
                document.getElementById("back-main-menu").onclick = () => {
                    MainMenu.Open();
                };
                LevelSelection.Populate();
            }
        });
    }
    static Populate() {
        $.ajax({
            url: "./views/level-icon-template.html",
            success: (template) => {
                let rowCount = 4;
                let levelsByRow = 4;
                for (let i = 0; i < rowCount; i++) {
                    let row = document.createElement("div");
                    document.getElementById("levels").appendChild(row);
                    row.className = "row";
                    for (let j = 0; j < levelsByRow; j++) {
                        let level = document.createElement("div");
                        row.appendChild(level);
                        level.className = "col-xs-3 level-icon-cell";
                        let index = (i * rowCount + j).toFixed(0);
                        let text = template;
                        let templateElement = document.createElement('template');
                        text = text.replace("{{ id }}", "level-" + index);
                        text = text.replace("{{ level }}", index);
                        text = text.trim();
                        templateElement.innerHTML = text;
                        level.appendChild(templateElement.content.firstChild);
                    }
                }
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < levelsByRow; j++) {
                        let index = i * rowCount + j;
                        document.getElementById("level-" + index.toFixed(0)).onclick = () => {
                            let level = new Level(index);
                            level.open();
                        };
                    }
                }
            }
        });
    }
}
/// <reference path="../lib/babylon.d.ts"/>
/// <reference path="../lib/jquery.d.ts"/>
window.addEventListener("DOMContentLoaded", () => {
    MainMenu.Open();
});
class MainMenu {
    static Open() {
        $.ajax({
            url: "./views/main-menu.html",
            success: (data) => {
                Page.Clear();
                document.getElementById("page").innerHTML = data;
                document.getElementById("level-selection").onclick = () => {
                    LevelSelection.Open();
                };
            }
        });
    }
}
class Page {
    static Clear() {
        document.getElementById("page").innerHTML = "";
    }
}
