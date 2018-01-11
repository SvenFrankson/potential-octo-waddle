class ILevelData {
}
class Level {
    constructor(index) {
        this._index = 0;
        this._width = 1;
        this._height = 1;
        this._values = [];
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
                this._width = data.width;
                this._height = data.height;
                this._values = data.initialValues;
                alert("Loaded " + this._width + " x " + this._height + " grid.");
            }
        });
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
class Main {
    constructor(canvasElement) {
        Main.Canvas = document.getElementById(canvasElement);
        Main.Engine = new BABYLON.Engine(Main.Canvas, true);
    }
    createScene() {
        Main.Scene = new BABYLON.Scene(Main.Engine);
        Main.Camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, BABYLON.Vector3.Zero(), Main.Scene);
        Main.Camera.setPosition(new BABYLON.Vector3(5, 2, 5));
        Main.Light = new BABYLON.HemisphericLight("AmbientLight", BABYLON.Axis.Y, Main.Scene);
        Main.Light.diffuse = new BABYLON.Color3(1, 1, 1);
        Main.Light.specular = new BABYLON.Color3(1, 1, 1);
    }
    animate() {
        Main.Engine.runRenderLoop(() => {
            Main.Scene.render();
        });
        window.addEventListener("resize", () => {
            Main.Engine.resize();
        });
    }
}
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
