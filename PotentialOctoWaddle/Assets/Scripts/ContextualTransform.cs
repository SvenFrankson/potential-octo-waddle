using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class ContextualTransform : MonoBehaviour {

	private Dictionary<ReversoState, Vector3> _positions;
	private Dictionary<ReversoState, Vector3> _rotations;

    public Vector3 MainMenuPosition;
    public Vector3 MainMenuRotation;
	public Vector3 LevelSelectionPosition;
	public Vector3 LevelSelectionRotation;
	public Vector3 LevelPosition;
	public Vector3 LevelRotation;
	public Vector3 OptionsPosition;
	public Vector3 OptionsRotation;
	public Vector3 AboutPosition;
	public Vector3 AboutRotation;
	public Vector3 LicencePosition;
	public Vector3 LicenceRotation;

	public void Start() {
		this._positions = new Dictionary<ReversoState, Vector3>();
		this._rotations = new Dictionary<ReversoState, Vector3>();
        this._positions.Add(ReversoState.MainMenu, this.MainMenuPosition);
        this._positions.Add(ReversoState.LevelSelection, this.LevelSelectionPosition);
        this._positions.Add(ReversoState.Level, this.LevelPosition);
        this._positions.Add(ReversoState.Options, this.OptionsPosition);
        this._positions.Add(ReversoState.About, this.AboutPosition);
        this._positions.Add(ReversoState.Licence, this.LicencePosition);

        this._rotations.Add(ReversoState.MainMenu, this.MainMenuRotation);
        this._rotations.Add(ReversoState.LevelSelection, this.LevelSelectionRotation);
        this._rotations.Add(ReversoState.Level, this.LevelRotation);
        this._rotations.Add(ReversoState.Options, this.OptionsRotation);
        this._rotations.Add(ReversoState.About, this.AboutRotation);
        this._rotations.Add(ReversoState.Licence, this.LicenceRotation);
        
        this.GoTo(0f, ReversoState.MainMenu);
	}

	public void GoTo(
		float duration,
        ReversoState reversoState = ReversoState.MainMenu,
		Action callback = null
	) {
		StartCoroutine(this.goToRoutine(duration, reversoState, callback));
	}

	private IEnumerator goToRoutine(
		float duration,
        ReversoState reversoState = ReversoState.MainMenu,
		Action callback = null
    ) {
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		Vector3 initialPosition = this.transform.localPosition;
		Vector3 targetPosition = this._positions[reversoState];
		Quaternion initialRotation = this.transform.localRotation;
		Quaternion targetRotation = Quaternion.Euler(this._rotations[reversoState]);
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localPosition = Vector3.Slerp(initialPosition, targetPosition, dt / duration);
			this.transform.localRotation = Quaternion.Slerp(initialRotation, targetRotation, dt / duration);
			yield return null;
		}
		this.transform.localPosition = targetPosition;
		this.transform.localRotation = targetRotation;
        if (callback != null) {
            callback();
        }
	}
}
