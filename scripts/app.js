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
                document.getElementById("level-index").innerText = this._index.toFixed(0);
                document.getElementById("victory-next").onpointerup = () => {
                    let level = new Level(this._index + 1);
                    level.open();
                };
                document.getElementById("restart").onpointerup = () => {
                    let level = new Level(this._index);
                    level.open();
                };
                document.getElementById("back-main-menu").onpointerup = () => {
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
                this.turns = 0;
                this.width = data.width;
                this.height = data.height;
                this.values = data.initialValues;
                this.best = data.best;
                this.canvas = document.getElementById("render-canvas");
                this.engine = new BABYLON.Engine(this.canvas, true);
                this.createScene();
                this.animate();
                this.instance = new LevelInstance(this);
                this.instance.initialize();
                this.canvas.onpointerup = () => {
                    let pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                    if (pick.hit) {
                        let ij = this.instance.ijFromMesh(pick.pickedMesh.parent);
                        if (ij) {
                            this.instance.flip(ij.i, ij.j, () => {
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
                                this.turns++;
                                if (this.checkVictory()) {
                                    this.victory();
                                }
                            });
                        }
                    }
                };
            }
        });
    }
    checkVictory() {
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                if (this.values[j][i] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    victory() {
        this.canvas.onpointerup = undefined;
        let score = 0;
        if (this.turns <= this.best) {
            score = 3;
        }
        else if (this.turns <= this.best * 2) {
            score = 2;
        }
        else {
            score = 1;
        }
        this.instance.victory(() => {
            document.getElementById("level-victory-zone").removeAttribute("hidden");
            document.getElementById("victory-score").innerText = score.toFixed(0);
            for (let k = 1; k <= score; k++) {
                console.error(".");
                document.getElementById("victory-star-" + k).setAttribute("src", "./img/star-yellow.svg");
            }
            ScoreManager.setScore(this._index, score);
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
        this._isFliping = false;
        this._k = 0;
        this._flipAnim = () => {
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
            t.freezeWorldMatrix();
            t.getChildMeshes().forEach((m) => {
                m.freezeWorldMatrix();
            });
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
                                t.freezeWorldMatrix();
                                t.getChildMeshes().forEach((m) => {
                                    m.freezeWorldMatrix();
                                });
                            }
                        }
                    }
                }
            }
            this._k++;
            if (this._k > length) {
                this._isFliping = false;
                this._level.scene.unregisterBeforeRender(this._flipAnim);
                if (this._flipingCallback) {
                    this._flipingCallback();
                }
            }
        };
        this._victoryAnim = () => {
            this._k++;
            if (this._k > 120) {
                this._level.scene.unregisterBeforeRender(this._victoryAnim);
                if (this._victoryCallback) {
                    this._victoryCallback();
                }
            }
        };
        this._level = level;
        this._tiles = [];
        this._particleSystem = new ParticleManager();
    }
    initialize() {
        this._particleSystem.initialize(this._level.scene);
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
                    this._tiles[j][i].freezeWorldMatrix();
                    meshes.forEach((m) => {
                        m.parent = this._tiles[j][i];
                        m.freezeWorldMatrix();
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
    pickIJAtPointer(callback) {
        let pick = this._level.scene.pick(this._level.scene.pointerX, this._level.scene.pointerY);
        if (pick.hit) {
            let ij = this.ijFromMesh(pick.pickedMesh.parent);
            if (ij) {
                callback(ij.i, ij.j);
            }
        }
    }
    flip(i, j, callback) {
        if (this._isFliping) {
            return;
        }
        else {
            this._isFliping = true;
            this._k = 0;
            this._flipingI = i;
            this._flipingJ = j;
            this._flipingCallback = callback;
            this._level.scene.registerBeforeRender(this._flipAnim);
        }
    }
    victory(callback) {
        this._k = 0;
        this._victoryCallback = callback;
        this._level.scene.registerBeforeRender(this._victoryAnim);
        this._level.scene.registerBeforeRender(() => {
            this._particleSystem.pop((new BABYLON.Vector3(Math.random() - 0.5, -2, Math.random() - 0.5)).scaleInPlace(6), new BABYLON.Vector3(0, 20, 0));
        });
    }
}
class LevelSelection {
    static Open() {
        let levelSelection = new LevelSelection();
        levelSelection.open();
        return levelSelection;
    }
    constructor() {
        this.scores = new Map();
        for (let i = 0; i < 16; i++) {
            let index = i + 1;
            this.scores.set(index, ScoreManager.getScore(index));
            ;
        }
    }
    open() {
        $.ajax({
            url: "./views/level-selection.html",
            success: (data) => {
                Page.Clear();
                document.getElementById("page").innerHTML = data;
                document.getElementById("back-main-menu").onpointerup = () => {
                    MainMenu.Open();
                };
                this.populate();
            }
        });
    }
    populate() {
        $.ajax({
            url: "./views/level-icon-template.html",
            success: (template) => {
                console.log(this.scores);
                let rowCount = 4;
                let levelsByRow = 4;
                for (let i = 0; i < rowCount; i++) {
                    let row = document.createElement("div");
                    document.getElementById("levels").appendChild(row);
                    row.className = "row level-icon-row";
                    for (let j = 0; j < levelsByRow; j++) {
                        let level = document.createElement("div");
                        row.appendChild(level);
                        level.className = "col-xs-3 level-icon-cell";
                        let index = (i * rowCount + j + 1).toFixed(0);
                        let text = template;
                        let templateElement = document.createElement('template');
                        text = text.split("{{ id }}").join("level-" + index);
                        text = text.split("{{ level }}").join(index);
                        text = text.trim();
                        templateElement.innerHTML = text;
                        level.appendChild(templateElement.content.firstChild);
                    }
                }
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < levelsByRow; j++) {
                        let index = i * rowCount + j + 1;
                        document.getElementById("level-" + index.toFixed(0)).onpointerup = () => {
                            let level = new Level(index);
                            level.open();
                        };
                        let score = this.scores.get(index);
                        console.log(score);
                        for (let k = 1; k <= score; k++) {
                            document.getElementById("level-" + index.toFixed(0) + "-star-" + k).setAttribute("src", "./img/star-yellow.svg");
                        }
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
                document.getElementById("level-selection").onpointerup = () => {
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
class ParticleManager {
    constructor() {
        this._maxParticles = 40;
        this._maxLifeTime = 10;
        this._deltaPos = BABYLON.Vector3.Zero();
        this._update = () => {
            let deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
            for (let i = 0; i < this._particles.length && i < this._velocities.length && i < this._lives.length; i++) {
                this._deltaPos.copyFrom(this._velocities[i]);
                this._deltaPos.scaleInPlace(deltaTime);
                this._particles[i].position.addInPlace(this._deltaPos);
                this._lives[i] += deltaTime;
            }
            let i = 0;
            while (i < this._particles.length && i < this._velocities.length && i < this._lives.length) {
                if (this._lives[i] > this._maxLifeTime) {
                    let particle = this._particles.splice(i, 1);
                    if (particle[0]) {
                        particle[0].dispose();
                    }
                    this._velocities.splice(i, 1);
                    this._particles.splice(i, 1);
                }
                else {
                    i++;
                }
            }
        };
        this._particles = [];
        this._velocities = [];
        this._lives = [];
    }
    get scene() {
        if (this._template) {
            return this._template.getScene();
        }
        return null;
    }
    initialize(scene) {
        this._template = BABYLON.MeshBuilder.CreatePlane("particleTemplate", { width: 0.05, height: 1 }, scene);
        let particleMaterial = new BABYLON.StandardMaterial("particleMaterial", scene);
        particleMaterial.specularColor.copyFromFloats(0, 0, 0);
        particleMaterial.diffuseTexture = new BABYLON.Texture("./img/particle.png", scene);
        particleMaterial.diffuseTexture.hasAlpha = true;
        particleMaterial.useAlphaFromDiffuseTexture = true;
        particleMaterial.emissiveColor.copyFromFloats(1, 1, 1);
        particleMaterial.alpha = 0.5;
        this._template.material = particleMaterial;
        this._template.position.z = -42;
        this.scene.registerBeforeRender(this._update);
    }
    pop(position, velocity) {
        let particle = this._template.createInstance("particle");
        particle.position.copyFrom(position);
        this._particles.push(particle);
        this._velocities.push(velocity);
        this._lives.push(0);
        while (this._particles.length > this._maxParticles) {
            let particle = this._particles.splice(0, 1);
            if (particle[0]) {
                particle[0].dispose();
            }
        }
        while (this._velocities.length > this._maxParticles) {
            this._velocities.splice(0, 1);
        }
        while (this._lives.length > this._maxParticles) {
            this._lives.splice(0, 1);
        }
    }
}
class ScoreManager {
    static getScore(level) {
        let score = localStorage.getItem("score-level-" + level);
        if (score) {
            let scoreValue = parseInt(score);
            if (isFinite(scoreValue)) {
                return scoreValue;
            }
        }
        return 0;
    }
    static setScore(level, score) {
        let currentScore = ScoreManager.getScore(level);
        if (isFinite(score) && score > currentScore) {
            localStorage.setItem("score-level-" + level, score.toFixed());
        }
    }
    static ClearScore() {
        for (let i = 1; i <= 16; i++) {
            localStorage.setItem("score-level-" + i, "0");
        }
    }
}
