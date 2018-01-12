class LevelInstance {

    private _level: Level;

    private _blackMaterial: BABYLON.StandardMaterial;
    private _whiteMaterial: BABYLON.StandardMaterial;

    constructor(level: Level) {
        this._level = level;
        this._blackMaterial = new BABYLON.StandardMaterial("BlackMaterial", level.scene);
        this._blackMaterial.diffuseColor.copyFromFloats(0.2, 0.2, 0.2);
        this._whiteMaterial = new BABYLON.StandardMaterial("WhiteMaterial", level.scene);
        this._whiteMaterial.diffuseColor.copyFromFloats(0.8, 0.8, 0.8);
    }

    public initialize(): void {
        for (let j = 0; j < this._level.height; j++) {
            for (let i = 0; i < this._level.width; i++) {
                let c = BABYLON.MeshBuilder.CreateBox(i + " " + j, {size: 1}, this._level.scene);
                c.position.x = i - (this._level.width - 1) / 2;
                c.position.z = (this._level.height - 1) / 2 - j;
                if (this._level.values[i][j] === 0) {
                    c.material = this._blackMaterial;
                } else if (this._level.values[i][j] === 1) {
                    c.material = this._whiteMaterial;
                }
            }
        }
    }
}