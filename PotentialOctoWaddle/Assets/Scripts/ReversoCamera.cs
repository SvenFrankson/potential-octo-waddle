using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public enum ReversoState {
	MainMenu,
	LevelSelection,
	Level,
	Options,
	About,
	Licence
}
public class ReversoCamera : MonoBehaviour {

	public static ReversoCamera _Instance;
	public static ReversoCamera Instance {
		get {
			if (!ReversoCamera._Instance) {
				ReversoCamera._Instance = Resources.FindObjectsOfTypeAll<ReversoCamera> ()[0];
			}
			return ReversoCamera._Instance;
		}
	}
	public ContextualTransform[] stripes;

	private Dictionary<ReversoState, Quaternion> _positions;
	public float minimalVerticalFov;
	public float minimalHorizontalFov;

	public void Start() {
		this._positions = new Dictionary<ReversoState, Quaternion>();
		this._positions.Add(ReversoState.MainMenu, Quaternion.identity);
		this._positions.Add(ReversoState.LevelSelection, Quaternion.AngleAxis(90f, Vector3.up));
		this._positions.Add(ReversoState.Level, Quaternion.AngleAxis(180f, Vector3.up));
		this._positions.Add(ReversoState.Options, Quaternion.AngleAxis(270f, Vector3.up));
		this._positions.Add(ReversoState.Licence, Quaternion.AngleAxis(-90f, Vector3.right));
		this._positions.Add(ReversoState.About, Quaternion.AngleAxis(90f, Vector3.right));

		this.Resize();
	}

	public void Resize() {
		Camera camera = this.GetComponent<Camera>();
		if (camera) {
			if (camera.fieldOfView < this.minimalVerticalFov) {
				camera.fieldOfView = this.minimalVerticalFov;
			}
			float horizontalFov = 2f * Mathf.Atan(((float) Screen.width) / Screen.height * Mathf.Tan(camera.fieldOfView * Mathf.Deg2Rad / 2f)) * Mathf.Rad2Deg;
			if (horizontalFov < this.minimalHorizontalFov) {
				camera.fieldOfView = 2f * Mathf.Atan(((float) Screen.height) / Screen.width * Mathf.Tan(this.minimalHorizontalFov * Mathf.Deg2Rad / 2f)) * Mathf.Rad2Deg;
			}
		}
	}

	public void GoTo(
		float duration,
        ReversoState reversoState = ReversoState.MainMenu,
		Action callback = null
	) {
		StartCoroutine(this.goToAnim(duration, reversoState, callback));
		for (int i = 0; i < this.stripes.Length; i++) {
			this.stripes[i].GoTo(0.5f, reversoState);
		}
	}

	private IEnumerator goToAnim(
		float duration,
        ReversoState reversoState = ReversoState.MainMenu,
		Action callback = null
    ) {
		float t0 = Time.timeSinceLevelLoad;
		float dt = 0f;
		Quaternion initialRotation = this.transform.localRotation;
		Quaternion targetRotation = this._positions[reversoState];
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localRotation = Quaternion.Slerp(initialRotation, targetRotation, Easing.Square(dt / duration));
			yield return null;
		}
		this.transform.localRotation = targetRotation;
        if (callback != null) {
            callback();
        }
	}
}
