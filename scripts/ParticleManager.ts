class ParticleManager {

    public get scene(): BABYLON.Scene {
        if (this._template) {
            return this._template.getScene();
        }
        return null;
    }
    private _template: BABYLON.Mesh;
    private _maxParticles: number = 40;
    private _maxLifeTime: number = 10;
    private _particles: BABYLON.InstancedMesh[];
    private _velocities: BABYLON.Vector3[];
    private _lives: number[];

    constructor() {
        this._particles = [];
        this._velocities = [];
        this._lives = [];
    }

    public initialize(scene: BABYLON.Scene) {
        this._template = BABYLON.MeshBuilder.CreatePlane("particleTemplate", {width: 0.1, height: 2}, scene);
        this.scene.registerBeforeRender(this._update);
    }

    public pop(position: BABYLON.Vector3, velocity: BABYLON.Vector3): void {
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

    private _deltaPos: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    private _update = () => {
        let deltaTime: number = this.scene.getEngine().getDeltaTime() / 1000;
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
            } else {
                i++;
            }
        }
    }
}