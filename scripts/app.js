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
            }
        });
    }
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor.copyFromFloats(0, 0, 0, 0);
        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, BABYLON.Vector3.Zero(), this.scene);
        this.camera.setPosition(new BABYLON.Vector3(0, 5, -5));
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
        this._level = level;
        this._blackMaterial = new BABYLON.StandardMaterial("BlackMaterial", level.scene);
        this._blackMaterial.diffuseColor.copyFromFloats(0.2, 0.2, 0.2);
        this._whiteMaterial = new BABYLON.StandardMaterial("WhiteMaterial", level.scene);
        this._whiteMaterial.diffuseColor.copyFromFloats(0.8, 0.8, 0.8);
    }
    initialize() {
        for (let j = 0; j < this._level.height; j++) {
            for (let i = 0; i < this._level.width; i++) {
                let c = BABYLON.MeshBuilder.CreateBox(i + " " + j, { size: 1 }, this._level.scene);
                c.position.x = i - (this._level.width - 1) / 2;
                c.position.z = (this._level.height - 1) / 2 - j;
                if (this._level.values[i][j] === 0) {
                    c.material = this._blackMaterial;
                }
                else if (this._level.values[i][j] === 1) {
                    c.material = this._whiteMaterial;
                }
            }
        }
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
                let rowCount = 6;
                let levelsByRow = 4;
                for (let i = 0; i < rowCount; i++) {
                    let row = document.createElement("div");
                    row.className = "row";
                    for (let j = 0; j < levelsByRow; j++) {
                        let level = document.createElement("div");
                        level.className = "col-xs-3";
                        let index = (i * rowCount + j).toFixed(0);
                        let text = template;
                        text = text.replace("{{ id }}", "level-" + index);
                        text = text.replace("{{ level }}", index);
                        level.innerHTML = text;
                        row.appendChild(level);
                    }
                    document.getElementById("levels").appendChild(row);
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
