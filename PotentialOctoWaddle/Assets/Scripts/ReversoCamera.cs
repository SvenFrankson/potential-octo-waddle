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

	private Dictionary<ReversoState, Quaternion> _positions;

	public void Start() {
		this._positions = new Dictionary<ReversoState, Quaternion>();
		this._positions.Add(ReversoState.MainMenu, Quaternion.identity);
		this._positions.Add(ReversoState.LevelSelection, Quaternion.AngleAxis(90f, Vector3.up));
		this._positions.Add(ReversoState.Level, Quaternion.AngleAxis(180f, Vector3.up));
		this._positions.Add(ReversoState.Options, Quaternion.AngleAxis(270f, Vector3.up));
		this._positions.Add(ReversoState.Licence, Quaternion.AngleAxis(-90f, Vector3.right));
		this._positions.Add(ReversoState.About, Quaternion.AngleAxis(90f, Vector3.right));
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
		Quaternion initialRotation = this.transform.localRotation;
		Quaternion targetRotation = this._positions[reversoState];
		while (dt < duration) {
			dt = Time.timeSinceLevelLoad - t0;
			this.transform.localRotation = Quaternion.Slerp(initialRotation, targetRotation, dt / duration);
			yield return null;
		}
		this.transform.localRotation = targetRotation;
        if (callback != null) {
            callback();
        }
	}
}
